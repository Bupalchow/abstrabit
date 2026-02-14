"use client";

import { createClient } from "@/lib/supabase/client";
import type { Bookmark } from "@/lib/types";

export default function BookmarkItem({ bookmark }: { bookmark: Bookmark }) {
  const handleDelete = async () => {
    const supabase = createClient();
    await supabase.from("bookmarks").delete().eq("id", bookmark.id);
  };

  return (
    <div className="flex items-center justify-between bg-card border border-border rounded-lg px-4 py-3 group">
      <div className="min-w-0 flex-1">
        <h3 className="font-medium text-sm truncate">{bookmark.title}</h3>
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary text-xs hover:underline truncate block"
        >
          {bookmark.url}
        </a>
      </div>
      <button
        onClick={handleDelete}
        className="text-muted hover:text-danger ml-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-sm"
      >
        Delete
      </button>
    </div>
  );
}
