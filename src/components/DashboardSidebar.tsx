"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Pen, 
  Home, 
  FileText, 
  FileEdit, 
  Globe, 
  Bookmark, 
  BarChart2, 
  MessageSquare, 
  Users, 
  Settings, 
  HelpCircle, 
  LogOut,
  ChevronDown,
  UserCircle
} from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [publishedOpen, setPublishedOpen] = useState(true);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/signin");
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "My Blogs", href: "/dashboard/blogs", icon: FileText },
    { name: "Drafts", href: "/dashboard/drafts", icon: FileEdit },
  ];

  const bottomNavItems = [
    { name: "Profile", href: "/dashboard/profile", icon: UserCircle },
    { name: "Bookmarks", href: "/dashboard/bookmarks", icon: Bookmark },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
    { name: "Comments", href: "/dashboard/comments", icon: MessageSquare },
    { name: "Followers", href: "/dashboard/followers", icon: Users },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Help & Support", href: "/dashboard/support", icon: HelpCircle },
  ];

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-[#e2e8f0] bg-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-[#e2e8f0]">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-[#6366f1] text-white">
          <Pen size={18} fill="currentColor" />
        </div>
        <span className="text-xl font-bold text-[#1e293b]">Blogsy</span>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
        {/* Write Button */}
        <Link 
          href="/write" 
          className="mb-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6366f1] py-3 text-sm font-semibold text-white transition-all hover:bg-[#4f46e5]"
        >
          <span className="text-lg leading-none">+</span> Write New Blog
        </Link>

        {/* Main Nav */}
        <nav className="space-y-1 mb-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-[#f8f9ff] text-[#6366f1]" 
                    : "text-[#64748b] hover:bg-[#f8f9ff] hover:text-[#1e293b]"
                }`}
              >
                <item.icon size={18} className={isActive ? "text-[#6366f1]" : ""} />
                {item.name}
              </Link>
            );
          })}

          {/* Published Accordion */}
          <div>
            <button 
              onClick={() => setPublishedOpen(!publishedOpen)}
              className="flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-sm font-medium text-[#64748b] transition-all hover:bg-[#f8f9ff] hover:text-[#1e293b]"
            >
              <div className="flex items-center gap-3">
                <Globe size={18} />
                Published
              </div>
              <ChevronDown size={16} className={`transition-transform ${publishedOpen ? "rotate-180" : ""}`} />
            </button>
            
            {publishedOpen && (
              <div className="ml-11 mt-1 space-y-1">
                <Link href="/dashboard/published/public" className="block rounded-lg px-4 py-2 text-sm text-[#64748b] hover:text-[#1e293b]">
                  Public (0)
                </Link>
                <Link href="/dashboard/published/private" className="block rounded-lg px-4 py-2 text-sm text-[#64748b] hover:text-[#1e293b]">
                  Private (0)
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Bottom Nav */}
        <nav className="space-y-1 mt-6">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-[#f8f9ff] text-[#6366f1]" 
                    : "text-[#64748b] hover:bg-[#f8f9ff] hover:text-[#1e293b]"
                }`}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="border-t border-[#e2e8f0] p-4">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-[#64748b] transition-all hover:bg-[#f8f9ff] hover:text-[#1e293b]"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
