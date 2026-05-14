"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { FileEdit, Trash2 } from "lucide-react";

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDrafts() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("author", user.id)
        .eq("published", false)
        .order("updated_at", { ascending: false });

      if (!error && data) {
        setDrafts(data);
      }
      setLoading(false);
    }
    fetchDrafts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this draft?")) return;
    
    await supabase.from("posts").delete().eq("id", id);
    setDrafts(drafts.filter(b => b.id !== id));
  };

  if (loading) return <div className="p-8 text-[#64748b]">Loading your drafts...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1e293b]">Manage Drafts</h1>
        <Link 
          href="/write" 
          className="rounded-xl bg-[#6366f1] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#4f46e5]"
        >
          + Write New
        </Link>
      </div>

      <div className="rounded-2xl border border-[#e2e8f0] bg-white overflow-hidden">
        {drafts.length === 0 ? (
          <div className="p-12 text-center text-[#64748b]">
            You have no drafts right now.
          </div>
        ) : (
          <table className="w-full text-left text-sm text-[#64748b]">
            <thead className="bg-[#f8f9ff] text-xs uppercase text-[#94a3b8] border-b border-[#e2e8f0]">
              <tr>
                <th className="px-6 py-4 font-semibold">Title</th>
                <th className="px-6 py-4 font-semibold">Last Edited</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {drafts.map((draft) => (
                <tr key={draft.id} className="hover:bg-[#f8f9ff]/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-bold text-[#1e293b]">{draft.title || "Untitled Draft"}</span>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(draft.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/write?id=${draft.id}`} className="text-[#94a3b8] hover:text-[#6366f1]">
                        <FileEdit size={18} />
                      </Link>
                      <button onClick={() => handleDelete(draft.id)} className="text-[#94a3b8] hover:text-red-500">
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
