"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { MessageSquare, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function CommentsPage() {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComments() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch user's posts
      const { data: posts } = await supabase.from("posts").select("id, title, slug").eq("author", user.id);
      if (!posts || posts.length === 0) {
        setLoading(false);
        return;
      }

      const postIds = posts.map(p => p.id);
      
      // Fetch comments on those posts
      const { data: commentsData } = await supabase
        .from("comments")
        .select(`
          id, 
          content, 
          created_at, 
          post_id,
          author:profiles(display_name)
        `)
        .in("post_id", postIds)
        .order("created_at", { ascending: false });

      if (commentsData) {
        // Map post title and slug to comments
        const enrichedComments = commentsData.map(c => ({
          ...c,
          post: posts.find(p => p.id === c.post_id)
        }));
        setComments(enrichedComments);
      }
      setLoading(false);
    }
    fetchComments();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this comment?")) return;
    await supabase.from("comments").delete().eq("id", id);
    setComments(comments.filter(c => c.id !== id));
  };

  if (loading) return <div className="p-8 text-[#64748b]">Loading comments...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1e293b]">Manage Comments</h1>
      </div>

      <div className="rounded-2xl border border-[#e2e8f0] bg-white overflow-hidden">
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-500">
              <MessageSquare size={32} />
            </div>
            <h3 className="mb-2 text-lg font-bold text-[#1e293b]">No comments yet</h3>
            <p className="text-sm text-[#64748b]">When readers comment on your posts, they'll appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#e2e8f0]">
            {comments.map((comment) => (
              <div key={comment.id} className="p-6 transition-colors hover:bg-[#f8f9ff]/50">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#1e293b]">
                      {comment.author?.display_name || "Unknown User"}
                    </span>
                    <span className="text-xs text-[#94a3b8]">
                      • {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <button onClick={() => handleDelete(comment.id)} className="text-[#94a3b8] hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="mb-3 text-sm text-[#64748b]">{comment.content}</p>
                <Link 
                  href={`/blog/${comment.post?.slug}`} 
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#6366f1] hover:underline"
                >
                  <ExternalLink size={12} />
                  On post: {comment.post?.title}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
