"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { LucideMessageSquare, LucideSend } from "lucide-react";

interface Comment {
  id: string;
  body: string;
  created_at: string;
  user_id: string;
  profiles: {
    display_name: string;
  };
}

const Comments = ({ postId }: { postId: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, [postId]);

  const fetchComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select(`
        *,
        profiles:user_id(display_name)
      `)
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    
    if (data) setComments(data as any);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setLoading(true);
    const { error } = await supabase.from("comments").insert({
      post_id: postId,
      user_id: user.id,
      body: newComment,
    });

    if (!error) {
      setNewComment("");
      fetchComments();
    }
    setLoading(false);
  };

  return (
    <section className="mt-16 pt-16 border-t border-white/10">
      <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <LucideMessageSquare /> Comments ({comments.length})
      </h2>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-12">
          <div className="relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full rounded-xl border border-white/10 bg-white/5 p-4 pr-16 outline-none focus:border-primary/50 transition-premium"
              rows={3}
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute bottom-4 right-4 text-primary transition-premium hover:scale-110 disabled:opacity-50"
            >
              <LucideSend size={24} />
            </button>
          </div>
        </form>
      ) : (
        <div className="glass-card p-6 text-center mb-12">
          <p className="text-foreground/60">
            Please <a href="/auth/signin" className="text-primary hover:underline">sign in</a> to join the conversation.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {comment.profiles?.display_name?.charAt(0) || "U"}
            </div>
            <div className="glass-card flex-1 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm">{comment.profiles?.display_name}</span>
                <span className="text-xs text-foreground/40">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">{comment.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Comments;
