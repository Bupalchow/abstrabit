"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Bookmark } from "@/lib/types";
import type { RealtimeChannel } from "@supabase/supabase-js";
import BookmarkItem from "./bookmark-item";

export default function BookmarkList({ userId }: { userId: string }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setBookmarks(data ?? []);
        setLoading(false);
      });

    // Listen for local "post completed" events so UI updates immediately
    const onBookmarkAdded = (e: Event) => {
      const newBookmark = (e as CustomEvent).detail as Bookmark;
      setBookmarks((prev) => {
        if (prev.some((b) => b.id === newBookmark.id)) return prev;
        return [newBookmark, ...prev];
      });
    };

    window.addEventListener("bookmark:added", onBookmarkAdded);

    // BroadcastChannel for same-browser tabs (fast cross-tab sync)
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("abstrabit:bookmarks");
      bc.onmessage = (ev) => {
        const newBookmark = ev.data as Bookmark;
        setBookmarks((prev) => {
          if (prev.some((b) => b.id === newBookmark.id)) return prev;
          return [newBookmark, ...prev];
        });
      };
    } catch (err) {
      bc = null;
      console.log("[bookmark-list]err",err);
    }

    channelRef.current = supabase
      .channel(`bookmarks-${userId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bookmarks" },
        (payload) => {
          const newBookmark = payload.new as Bookmark;
          if (newBookmark.user_id === userId) {
            setBookmarks((prev) => {
              if (prev.some((b) => b.id === newBookmark.id)) return prev;
              return [newBookmark, ...prev];
            });
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "bookmarks" },
        (payload) => {
          const oldBookmark = payload.old as Partial<Bookmark>;
          if (oldBookmark.id) {
            setBookmarks((prev) => prev.filter((b) => b.id !== oldBookmark.id));
          }
        }
      )
      .subscribe((status, err) => {
        if (err) console.error("Realtime subscription error:", err);
      });

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      window.removeEventListener("bookmark:added", onBookmarkAdded);
      if (bc) bc.close();
    };
  }, [userId]);

  if (loading) {
    return <p className="text-muted text-sm text-center py-8">Loading...</p>;
  }

  if (bookmarks.length === 0) {
    return <p className="text-muted text-sm text-center py-8">No bookmarks yet. Add one above!</p>;
  }

  return (
    <div className="space-y-2">
      {bookmarks.map((bookmark) => (
        <BookmarkItem key={bookmark.id} bookmark={bookmark} />
      ))}
    </div>
  );
}
