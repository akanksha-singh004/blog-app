"use client";

import { ChevronDown, FileText, Eye, Heart, MessageSquare, SquarePen, FileEdit, BarChart2, UserCog, Pen } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [userName, setUserName] = useState("Creator");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    public: 0,
    private: 0,
    drafts: 0,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch User Profile for name
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("id", user.id)
          .single();
        
        if (profile?.display_name) {
          setUserName(profile.display_name.split(" ")[0]); // First name only
        } else if (user.user_metadata?.display_name) {
          setUserName(user.user_metadata.display_name.split(" ")[0]);
        }

        // Fetch Posts
        const { data: posts, error: postsError } = await supabase
          .from("posts")
          .select("id, published, is_public, views, likes")
          .eq("author", user.id);

        if (postsError) throw postsError;

        // Fetch Comments count for user's posts
        const postIds = posts?.map(p => p.id) || [];
        let commentsCount = 0;
        if (postIds.length > 0) {
          const { count, error: commentsError } = await supabase
            .from("comments")
            .select("id", { count: "exact", head: true })
            .in("post_id", postIds);
          if (!commentsError) commentsCount = count || 0;
        }

        // Calculate Stats
        let views = 0;
        let likes = 0;
        let pubPublic = 0;
        let pubPrivate = 0;
        let drafts = 0;

        posts?.forEach(post => {
          views += post.views || 0;
          likes += post.likes || 0;
          if (post.published) {
            if (post.is_public) pubPublic++;
            else pubPrivate++;
          } else {
            drafts++;
          }
        });

        setStats({
          totalBlogs: posts?.length || 0,
          totalViews: views,
          totalLikes: likes,
          totalComments: commentsCount,
          public: pubPublic,
          private: pubPrivate,
          drafts: drafts,
        });

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const totalChart = stats.totalBlogs > 0 ? stats.totalBlogs : 1; // Prevent div by 0
  const publicPcnt = (stats.public / totalChart) * 100;
  const privatePcnt = (stats.private / totalChart) * 100;
  // CSS Conic gradient string
  const conicGradient = `conic-gradient(#6366f1 0% ${publicPcnt}%, #22c55e ${publicPcnt}% ${publicPcnt + privatePcnt}%, #f59e0b ${publicPcnt + privatePcnt}% 100%)`;

  if (loading) {
    return <div className="p-10 text-center text-[#64748b]">Loading your dashboard...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Welcome back, {userName}! 👋</h1>
          <p className="text-sm text-[#64748b] mt-1">Here's what's happening with your blog.</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-[#e2e8f0] bg-white px-4 py-2 text-sm font-medium text-[#1e293b] hover:bg-[#f8f9ff]">
          Last 30 days
          <ChevronDown size={16} className="text-[#64748b]" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard 
          icon={<FileText size={24} />} 
          title="Total Blogs" 
          value={stats.totalBlogs.toString()} 
          color="bg-[#6366f1]" 
        />
        <StatCard 
          icon={<Eye size={24} />} 
          title="Total Views" 
          value={stats.totalViews.toString()} 
          color="bg-[#22c55e]" 
        />
        <StatCard 
          icon={<Heart size={24} />} 
          title="Total Likes" 
          value={stats.totalLikes.toString()} 
          color="bg-[#ec4899]" 
        />
        <StatCard 
          icon={<MessageSquare size={24} />} 
          title="Total Comments" 
          value={stats.totalComments.toString()} 
          color="bg-[#3b82f6]" 
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content Area - My Blogs (Empty State) */}
        <div className="col-span-2 rounded-2xl border border-[#e2e8f0] bg-white p-6">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-lg font-bold text-[#1e293b]">My Blogs</h2>
            <Link href="/dashboard/blogs" className="text-sm font-semibold text-[#6366f1] hover:underline">
              View all
            </Link>
          </div>

          {stats.totalBlogs === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              {/* Custom SVG Illustration for Empty State */}
              <div className="mb-8 relative">
                <svg width="240" height="120" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Background Blob */}
                  <path d="M120 110C170 110 200 80 200 60C200 40 170 20 120 20C70 20 40 40 40 60C40 80 70 110 120 110Z" fill="#f8f9ff" />
                  {/* Pen */}
                  <g transform="translate(60, 40) rotate(-45)">
                    <rect x="0" y="0" width="16" height="50" rx="4" fill="#6366f1" />
                    <path d="M0 50L8 65L16 50H0Z" fill="#a5b4fc" />
                    <path d="M6 60L8 65L10 60H6Z" fill="#1e293b" />
                  </g>
                  {/* Document */}
                  <rect x="100" y="30" width="50" height="60" rx="4" fill="white" stroke="#e2e8f0" strokeWidth="2" />
                  <rect x="110" y="40" width="30" height="4" rx="2" fill="#e2e8f0" />
                  <rect x="110" y="50" width="30" height="4" rx="2" fill="#e2e8f0" />
                  <rect x="110" y="60" width="20" height="4" rx="2" fill="#e2e8f0" />
                  {/* Desk Base */}
                  <rect x="50" y="100" width="140" height="4" rx="2" fill="#e2e8f0" />
                </svg>
              </div>

              <h3 className="mb-2 text-xl font-bold text-[#1e293b]">You haven't written any blogs yet.</h3>
              <p className="mb-6 text-sm text-[#64748b]">Share your thoughts with the world.</p>
              
              <Link 
                href="/write" 
                className="flex items-center gap-2 rounded-xl bg-[#6366f1] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#4f46e5] shadow-lg shadow-[#6366f1]/20"
              >
                <SquarePen size={18} />
                Write Your First Blog
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-[#f8f9ff] rounded-xl border border-dashed border-[#cbd5e1]">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#6366f1]/10 text-[#6366f1]">
                <FileText size={32} />
              </div>
              <h3 className="mb-2 text-xl font-bold text-[#1e293b]">You have {stats.totalBlogs} blogs!</h3>
              <p className="mb-6 text-sm text-[#64748b]">Keep up the great work and inspire the world.</p>
              <Link 
                href="/dashboard/blogs" 
                className="text-sm font-bold text-[#6366f1] hover:underline"
              >
                Manage your blogs &rarr;
              </Link>
            </div>
          )}
        </div>

        {/* Right Sidebar Area */}
        <div className="col-span-1 space-y-6">
          {/* Blog Status Chart */}
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
            <h2 className="mb-6 text-lg font-bold text-[#1e293b]">Blog Status</h2>
            <div className="flex items-center justify-between gap-6">
              {/* CSS Donut Chart */}
              <div className="relative h-28 w-28 flex-shrink-0 rounded-full" 
                style={{ 
                  background: stats.totalBlogs === 0 ? '#e2e8f0' : conicGradient,
                }}
              >
                <div className="absolute inset-[18%] rounded-full bg-white" />
              </div>

              {/* Legend */}
              <div className="w-full space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#6366f1]" />
                    <span className="text-[#64748b]">Published (Public)</span>
                  </div>
                  <span className="font-semibold text-[#1e293b]">{stats.public}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]" />
                    <span className="text-[#64748b]">Published (Private)</span>
                  </div>
                  <span className="font-semibold text-[#1e293b]">{stats.private}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
                    <span className="text-[#64748b]">Drafts</span>
                  </div>
                  <span className="font-semibold text-[#1e293b]">{stats.drafts}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
            <h2 className="mb-4 text-lg font-bold text-[#1e293b]">Quick Actions</h2>
            <div className="space-y-4">
              <QuickAction 
                icon={<Pen size={18} />} 
                title="Write New Blog" 
                desc="Start writing something new" 
                color="text-[#6366f1] bg-[#eef0ff]" 
                href="/write"
              />
              <QuickAction 
                icon={<FileEdit size={18} />} 
                title="Manage Drafts" 
                desc="Continue working on your drafts" 
                color="text-[#6366f1] bg-[#eef0ff]" 
                href="/dashboard/drafts"
              />
              <QuickAction 
                icon={<BarChart2 size={18} />} 
                title="View Analytics" 
                desc="Check your blog performance" 
                color="text-[#6366f1] bg-[#eef0ff]" 
                href="/dashboard/analytics"
              />
              <QuickAction 
                icon={<UserCog size={18} />} 
                title="Customize Profile" 
                desc="Update your profile details" 
                color="text-[#6366f1] bg-[#eef0ff]" 
                href="/dashboard/settings"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }: { icon: React.ReactNode, title: string, value: string, color: string }) {
  return (
    <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5">
      <div className="flex items-center gap-4">
        <div className={`flex h-14 w-14 items-center justify-center rounded-xl text-white ${color}`}>
          {icon}
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">{title}</h3>
          <p className="mt-1 text-2xl font-bold text-[#1e293b]">{value}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-[#94a3b8]">
        <div className="h-1.5 w-1.5 rounded-full bg-[#cbd5e1]" />
        No change
      </div>
    </div>
  );
}

function QuickAction({ icon, title, desc, color, href }: { icon: React.ReactNode, title: string, desc: string, color: string, href: string }) {
  return (
    <Link href={href} className="flex items-start gap-4 rounded-xl p-2 transition-all hover:bg-[#f8f9ff]">
      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${color}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-bold text-[#1e293b]">{title}</h3>
        <p className="text-xs text-[#64748b]">{desc}</p>
      </div>
    </Link>
  );
}
