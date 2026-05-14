"use client";

import { Users } from "lucide-react";
import Link from "next/link";

export default function FollowersPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1e293b]">My Followers</h1>
      </div>

      <div className="rounded-2xl border border-[#e2e8f0] bg-white overflow-hidden">
        <div className="flex flex-col items-center justify-center p-16 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-500">
            <Users size={40} />
          </div>
          <h3 className="mb-3 text-xl font-bold text-[#1e293b]">Build your audience</h3>
          <p className="mb-8 max-w-md text-sm text-[#64748b]">
            You don't have any followers yet. Keep publishing great content to build your community and engage with your readers!
          </p>
          <Link 
            href="/write"
            className="rounded-xl bg-[#6366f1] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#4f46e5]"
          >
            Write a New Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
