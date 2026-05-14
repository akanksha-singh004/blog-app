"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Eye, Heart, Globe, Lock } from "lucide-react";

export default function PublishedBlogsPage({ isPublic = true }: { isPublic?: boolean }) {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("author", user.id)
        .eq("published", true)
        .eq("is_public", isPublic)
        .order("created_at", { ascending: false });

      if (data) setBlogs(data);
      setLoading(false);
    }
    fetchBlogs();
  }, [isPublic]);

  if (loading) return <div className="p-8 text-[#64748b]">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#1e293b]">
        {isPublic ? "Public" : "Private"} Blogs
      </h1>

      <div className="rounded-2xl border border-[#e2e8f0] bg-white overflow-hidden">
        {blogs.length === 0 ? (
          <div className="p-12 text-center text-[#64748b]">
            No {isPublic ? "public" : "private"} blogs found.
          </div>
        ) : (
          <table className="w-full text-left text-sm text-[#64748b]">
            <thead className="bg-[#f8f9ff] text-xs uppercase text-[#94a3b8] border-b border-[#e2e8f0]">
              <tr>
                <th className="px-6 py-4 font-semibold">Title</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-[#f8f9ff]/50">
                  <td className="px-6 py-4 font-bold text-[#1e293b]">{blog.title}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${isPublic ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'bg-[#f59e0b]/10 text-[#f59e0b]'}`}>
                      {isPublic ? <Globe size={12} /> : <Lock size={12} />}
                      {isPublic ? 'Public' : 'Private'}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(blog.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
