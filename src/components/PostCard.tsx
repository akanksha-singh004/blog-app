import Link from "next/link";
import { LucideCalendar, LucideUser } from "lucide-react";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    created_at: string;
    author: {
      display_name: string;
    };
  };
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="glass-card transition-premium group flex h-full flex-col overflow-hidden p-6 hover:-translate-y-2 hover:border-primary/50">
        <div className="mb-4 flex items-center gap-4 text-xs text-foreground/50">
          <span className="flex items-center gap-1">
            <LucideUser size={14} />
            {post.author.display_name}
          </span>
          <span className="flex items-center gap-1">
            <LucideCalendar size={14} />
            {new Date(post.created_at).toLocaleDateString()}
          </span>
        </div>
        
        <h3 className="mb-3 text-xl font-bold transition-colors group-hover:text-primary">
          {post.title}
        </h3>
        
        <p className="mb-6 line-clamp-3 text-sm text-foreground/70">
          {post.excerpt || "No excerpt available for this post."}
        </p>
        
        <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-primary">
          Read More
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </div>
      </article>
    </Link>
  );
};

export default PostCard;
