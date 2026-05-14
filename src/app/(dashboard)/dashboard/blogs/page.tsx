"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { FileEdit, Trash2, Eye, Globe, Lock, Heart } from "lucide-react";

export default function MyBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("author", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setBlogs(data);
      }
      setLoading(false);
    }
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    
    await supabase.from("posts").delete().eq("id", id);
    setBlogs(blogs.filter(b => b.id !== id));
  };

  if (loading) return <div className="p-8 text-[#64748b]">Loading your blogs...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1e293b]">My Blogs</h1>
        <Link 
          href="/write" 
          className="rounded-xl bg-[#6366f1] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#4f46e5]"
        >
          + Write New
        </Link>
      </div>

      <div className="rounded-2xl border border-[#e2e8f0] bg-white overflow-hidden">
        {blogs.length === 0 ? (
          <div className="p-12 text-center text-[#64748b]">
            You have not written any blogs yet.
          </div>
        ) : (
          <table className="w-full text-left text-sm text-[#64748b]">
            <thead className="bg-[#f8f9ff] text-xs uppercase text-[#94a3b8] border-b border-[#e2e8f0]">
              <tr>
                <th className="px-6 py-4 font-semibold">Title</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Views / Likes</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-[#f8f9ff]/50 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/${blog.slug}`} className="font-bold text-[#1e293b] hover:text-[#6366f1] hover:underline">
                      {blog.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    {blog.published ? (
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${blog.is_public ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'bg-[#f59e0b]/10 text-[#f59e0b]'}`}>
                        {blog.is_public ? <Globe size={12} /> : <Lock size={12} />}
                        {blog.is_public ? 'Public' : 'Private'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#64748b]/10 px-2.5 py-1 text-xs font-medium text-[#64748b]">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1"><Eye size={14} /> {blog.views || 0}</span>
                      <span className="flex items-center gap-1"><Heart size={14} /> {blog.likes || 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(blog.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/write?id=${blog.id}`} className="text-[#94a3b8] hover:text-[#6366f1]">
                        <FileEdit size={18} />
                      </Link>
                      <button onClick={() => handleDelete(blog.id)} className="text-[#94a3b8] hover:text-red-500">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
