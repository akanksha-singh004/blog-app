"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PostCard from "@/components/PostCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Globe, AtSign, Mail, MapPin, Calendar } from "lucide-react";
import { useParams } from "next/navigation";

export default function ProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfileData() {
      if (!id) return;

      // Fetch Profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch Posts
      const { data: postsData } = await supabase
        .from("posts")
        .select("*, author:profiles(display_name)")
        .eq("author", id)
        .eq("published", true)
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      if (postsData) {
        setPosts(postsData);
      }
      setLoading(false);
    }
    fetchProfileData();
  }, [id]);

  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading profile...</div>;
  if (!profile) return <div className="flex min-h-screen items-center justify-center">Profile not found.</div>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-32 pb-20">
        {/* Profile Header */}
        <div className="relative mb-12 rounded-3xl bg-white/5 p-8 backdrop-blur-sm border border-white/10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="h-32 w-32 overflow-hidden rounded-2xl bg-primary/20">
              <img 
                src={`https://api.dicebear.com/7.x/notionists/svg?seed=${profile.display_name}`} 
                alt={profile.display_name} 
                className="h-full w-full object-cover"
              />
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-4xl font-bold">{profile.display_name}</h1>
                <p className="text-foreground/60 max-w-2xl mt-2">{profile.bio || "No bio added yet."}</p>
              </div>
              
              <div className="flex flex-wrap gap-6 text-sm text-foreground/50">
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                    <Globe size={16} /> {new URL(profile.website).hostname}
                  </a>
                )}
                {profile.twitter_handle && (
                  <a href={`https://twitter.com/${profile.twitter_handle.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                    <AtSign size={16} /> {profile.twitter_handle}
                  </a>
                )}
                <div className="flex items-center gap-2">
                  <Calendar size={16} /> Joined {new Date(profile.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User's Blogs */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Published Stories</h2>
            <span className="rounded-full bg-white/5 px-4 py-1 text-sm text-foreground/50 border border-white/10">
              {posts.length} posts
            </span>
          </div>

          {posts.length === 0 ? (
            <div className="rounded-3xl bg-white/5 p-20 text-center backdrop-blur-sm border border-white/10">
              <p className="text-foreground/60 italic">This creator hasn't published any stories yet.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
