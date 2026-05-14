import { supabase } from "@/lib/supabase";
import Hero from "@/components/Hero";
import PostCard from "@/components/PostCard";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const { data: posts, error } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      slug,
      excerpt,
      created_at,
      author:profiles(display_name)
    `)
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
  }

  return (
    <div className="container mx-auto px-6">
      <Hero />
      
      <section className="py-20">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="mb-2 text-3xl font-bold">Latest <span className="text-gradient">Stories</span></h2>
            <p className="text-foreground/60">Discover the most recent insights from our community.</p>
          </div>
        </div>

        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="glass-card flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg text-foreground/50">No posts yet. Be the first to share a story!</p>
          </div>
        )}
      </section>
    </div>
  );
}
