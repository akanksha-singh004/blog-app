"use client";

import { Bookmark } from "lucide-react";
import Link from "next/link";

export default function BookmarksPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1e293b]">Saved Bookmarks</h1>
      </div>

      <div className="rounded-2xl border border-[#e2e8f0] bg-white overflow-hidden">
        <div className="flex flex-col items-center justify-center p-16 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-purple-50 text-purple-500">
            <Bookmark size={40} />
          </div>
          <h3 className="mb-3 text-xl font-bold text-[#1e293b]">No bookmarks saved yet</h3>
          <p className="mb-8 max-w-md text-sm text-[#64748b]">
            When you find stories you want to read later, click the bookmark icon on any post to save it here.
          </p>
          <Link 
            href="/"
            className="rounded-xl bg-[#6366f1] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#4f46e5]"
          >
            Explore Stories
          </Link>
        </div>
      </div>
    </div>
  );
}
