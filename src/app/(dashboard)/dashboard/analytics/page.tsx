"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { BarChart2, TrendingUp, Users, Eye } from "lucide-react";

export default function AnalyticsPage() {
  const [stats, setStats] = useState({ views: 0, likes: 0, comments: 0, posts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: posts } = await supabase
        .from("posts")
        .select("id, views, likes")
        .eq("author", user.id);

      if (posts) {
        const postIds = posts.map(p => p.id);
        const { count } = await supabase
          .from("comments")
          .select("id", { count: "exact", head: true })
          .in("post_id", postIds.length ? postIds : ['00000000-0000-0000-0000-000000000000']);

        setStats({
          posts: posts.length,
          views: posts.reduce((acc, p) => acc + (p.views || 0), 0),
          likes: posts.reduce((acc, p) => acc + (p.likes || 0), 0),
          comments: count || 0,
        });
      }
      setLoading(false);
    }
    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-8 text-[#64748b]">Loading analytics...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1e293b]">Analytics Overview</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-500">
              <Eye size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#64748b]">Total Views</p>
              <h3 className="text-2xl font-bold text-[#1e293b]">{stats.views}</h3>
            </div>
          </div>
        </div>
        
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-500">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#64748b]">Total Likes</p>
              <h3 className="text-2xl font-bold text-[#1e293b]">{stats.likes}</h3>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 text-purple-500">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#64748b]">Engagement (Comments)</p>
              <h3 className="text-2xl font-bold text-[#1e293b]">{stats.comments}</h3>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-500">
              <BarChart2 size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#64748b]">Published Posts</p>
              <h3 className="text-2xl font-bold text-[#1e293b]">{stats.posts}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-8">
        <h3 className="mb-6 font-bold text-[#1e293b]">Performance over time</h3>
        <div className="flex h-64 items-end gap-2 border-b border-l border-[#e2e8f0] p-4">
          {/* CSS Chart mockup since we don't have historical data or a chart library */}
          {[40, 20, 60, 80, 45, 90, 50, 75, 100, 60, 30, 85].map((val, i) => (
            <div key={i} className="group relative w-full flex-1">
              <div 
                className="w-full rounded-t-md bg-[#6366f1]/20 transition-all group-hover:bg-[#6366f1]" 
                style={{ height: `${val}%` }} 
              />
              <span className="absolute -top-8 left-1/2 hidden -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
                {val}k
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between text-xs text-[#94a3b8]">
          <span>Jan</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>May</span>
          <span>Jun</span>
          <span>Jul</span>
          <span>Aug</span>
          <span>Sep</span>
          <span>Oct</span>
          <span>Nov</span>
          <span>Dec</span>
        </div>
      </div>
    </div>
  );
}
