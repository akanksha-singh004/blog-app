"use client";

import { useState, useEffect, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { Save, Send, SquarePen, Image as ImageIcon } from "lucide-react";

function WriteBlogContent() {
  const [title, setTitle] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  useEffect(() => {
    async function fetchPost() {
      if (!editId) return;
      const { data, error } = await supabase.from("posts").select("*").eq("id", editId).single();
      if (data && !error) {
        setTitle(data.title);
        setMarkdown(data.markdown);
        setExcerpt(data.excerpt || "");
        setTags((data.tags || []).join(", "));
      }
    }
    fetchPost();
  }, [editId]);

  const handleSave = async (published: boolean) => {
    if (!title || !markdown) {
      alert("Title and content are required.");
      return;
    }

    if (published) setLoading(true);
    else setDraftLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const postData = {
      title,
      slug: editId ? undefined : slug, // Don't update slug if editing to prevent broken links
      markdown,
      excerpt,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      author: user.id,
      published,
      is_public: true, // Default to public
      updated_at: new Date().toISOString(),
    };

    let error;
    if (editId) {
      const { error: updateError } = await supabase.from("posts").update(postData).eq("id", editId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from("posts").insert(postData);
      error = insertError;
    }

    if (error) {
      alert(error.message);
    } else {
      router.push(published ? "/dashboard/blogs" : "/dashboard/drafts");
    }
    
    setLoading(false);
    setDraftLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6366f1] text-white">
            <SquarePen size={20} />
          </div>
          <h1 className="text-2xl font-bold text-[#1e293b]">
            {editId ? "Edit Story" : "Write a New Story"}
          </h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleSave(false)}
            disabled={draftLoading || loading}
            className="flex items-center gap-2 rounded-xl border border-[#e2e8f0] bg-white px-6 py-2.5 text-sm font-bold text-[#1e293b] transition-all hover:bg-[#f8f9ff] disabled:opacity-50"
          >
            <Save size={18} />
            {draftLoading ? "Saving..." : "Save Draft"}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={loading || draftLoading}
            className="flex items-center gap-2 rounded-xl bg-[#6366f1] px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#4f46e5] disabled:opacity-50"
          >
            <Send size={18} />
            {loading ? "Publishing..." : "Publish Now"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-8">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-4xl font-bold text-[#1e293b] outline-none placeholder:text-[#cbd5e1]"
              placeholder="Post Title..."
              autoFocus
            />
          </div>

          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-8">
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="min-h-[500px] w-full resize-y text-lg text-[#1e293b] outline-none placeholder:text-[#cbd5e1] leading-relaxed"
              placeholder="Tell your story..."
            />
          </div>
        </div>

        <div className="col-span-1 space-y-6">
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 space-y-6">
            <h3 className="font-bold text-[#1e293b]">Post Settings</h3>
            
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
                Excerpt
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8f9ff] p-4 text-sm outline-none transition-all focus:border-[#6366f1] focus:bg-white"
                placeholder="A brief summary of your post..."
                rows={3}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
                Tags
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8f9ff] px-4 py-3 text-sm outline-none transition-all focus:border-[#6366f1] focus:bg-white"
                placeholder="tech, lifestyle, design..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WriteBlogPage() {
  return (
    <Suspense fallback={<div className="p-8 text-[#64748b]">Loading editor...</div>}>
      <WriteBlogContent />
    </Suspense>
  );
}
