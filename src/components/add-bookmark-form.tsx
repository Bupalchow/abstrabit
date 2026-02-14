"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AddBookmarkForm() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    setLoading(true);
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from("bookmarks")
      .insert({ title: title.trim(), url: url.trim() })
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error);
      setLoading(false);
      return;
    }

    // notify listeners (BookmarkList will pick this up and update state)
    if (data) {
      // dispatch to same-tab listeners
      window.dispatchEvent(new CustomEvent("bookmark:added", { detail: data }));

      // broadcast to other tabs in the same browser (instant cross-tab sync)
      try {
        const bc = new BroadcastChannel("abstrabit:bookmarks");
        bc.postMessage(data);
        bc.close();
      } catch (err) {
        console.log("[add-bookmark-form] error",err)
      }
    }

    setTitle("");
    setUrl("");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="flex-1 bg-card border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
      />
      <input
        type="url"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
        className="flex-1 bg-card border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-white font-medium px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer text-sm"
      >
        {loading ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
