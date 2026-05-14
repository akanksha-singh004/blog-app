import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { LucideCalendar, LucideUser, LucideArrowLeft } from "lucide-react";
import Link from "next/link";
import Comments from "@/components/Comments";

interface PostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt")
    .eq("slug", slug)
    .single();

  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | Blogsy`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const { data: post, error } = await supabase
    .from("posts")
    .select(`
      *,
      author:profiles(display_name)
    `)
    .eq("slug", slug)
    .single();

  if (error || !post) {
    notFound();
  }

  return (
    <article className="container mx-auto max-w-4xl px-6 py-12">
      <Link 
        href="/" 
        className="mb-8 flex items-center gap-2 text-sm text-foreground/50 transition-colors hover:text-primary"
      >
        <LucideArrowLeft size={16} />
        Back to Stories
      </Link>

      <header className="mb-12">
        <h1 className="mb-6 text-4xl font-extrabold md:text-5xl lg:text-6xl">
          {post.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-6 text-foreground/60">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <LucideUser size={20} className="text-primary" />
            </div>
            <span className="font-medium text-foreground">{post.author.display_name}</span>
          </div>
          <div className="flex items-center gap-2">
            <LucideCalendar size={18} />
            <span>{new Date(post.created_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric"
            })}</span>
          </div>
        </div>
      </header>

      {post.image_url && (
        <div className="mb-12 overflow-hidden rounded-2xl border border-white/10">
          <img 
            src={post.image_url} 
            alt={post.title} 
            className="w-full object-cover max-h-[500px]"
          />
        </div>
      )}

      <div className="prose prose-invert prose-primary max-w-none">
        <ReactMarkdown>{post.markdown}</ReactMarkdown>
      </div>

      <footer className="mt-20 border-t border-white/10 pt-10">
        <div className="flex flex-wrap gap-2">
          {post.tags?.map((tag: string) => (
            <span 
              key={tag} 
              className="rounded-full bg-white/5 px-4 py-1 text-sm text-foreground/60 border border-white/10"
            >
              #{tag}
            </span>
          ))}
        </div>
      </footer>

      <Comments postId={post.id} />
    </article>
  );
}
