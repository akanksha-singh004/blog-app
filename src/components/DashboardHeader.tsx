"use client";

import { Search, Bell, ChevronDown, LogOut, User, Settings as SettingsIcon, UserCircle } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardHeader() {
  const [userName, setUserName] = useState("Creator");
  const [userId, setUserId] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter();

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("id", user.id)
          .single();
        
        if (profile?.display_name) {
          setUserName(profile.display_name.split(" ")[0]);
        } else if (user.user_metadata?.display_name) {
          setUserName(user.user_metadata.display_name.split(" ")[0]);
        } else {
          setUserName(user.email?.split("@")[0] || "Creator");
        }
      }
    }
    getUser();

    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/signin");
  };



  return (
    <header className="flex h-20 w-full items-center justify-between border-b border-[#e2e8f0] bg-white px-8 dark:border-gray-800 dark:bg-gray-900 transition-colors">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
        <input 
          type="text" 
          placeholder="Search for blogs, tags, or users..." 
          className="w-full rounded-full border border-[#e2e8f0] bg-[#f8f9ff] py-2.5 pl-12 pr-4 text-sm outline-none transition-all focus:border-[#6366f1] focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900"
        />
      </div>

      <div className="flex items-center gap-6">

        
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-[#64748b] transition-colors hover:text-[#1e293b] dark:text-gray-400 dark:hover:text-white"
          >
            <Bell size={20} />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#6366f1] text-[10px] font-bold text-white">
              3
            </span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-4 w-80 rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-xl z-50 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-3 text-sm font-bold text-[#1e293b] dark:text-white">Notifications</h3>
              <div className="space-y-3">
                <div className="flex gap-3 text-sm">
                  <div className="h-8 w-8 rounded-full bg-[#eef0ff] flex items-center justify-center text-[#6366f1] flex-shrink-0">🚀</div>
                  <div>
                    <p className="text-[#1e293b] font-medium dark:text-white">Welcome to Blogsy!</p>
                    <p className="text-xs text-[#64748b] dark:text-gray-400">Start writing your first story today.</p>
                  </div>
                </div>
                <div className="flex gap-3 text-sm">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">🔒</div>
                  <div>
                    <p className="text-[#1e293b] font-medium dark:text-white">Security Update</p>
                    <p className="text-xs text-[#64748b] dark:text-gray-400">Your profile has been secured.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex cursor-pointer items-center gap-3 pl-2"
          >
            <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-200">
              <img 
                src={`https://api.dicebear.com/7.x/notionists/svg?seed=${userName}`} 
                alt="Profile" 
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-sm font-semibold text-[#1e293b] dark:text-white">{userName}</span>
            <ChevronDown size={16} className="text-[#64748b] dark:text-gray-400" />
          </div>

          {showProfileMenu && (
            <div className="absolute right-0 mt-4 w-48 rounded-xl border border-[#e2e8f0] bg-white py-2 shadow-xl z-50 dark:border-gray-700 dark:bg-gray-800">
              <Link href="/dashboard/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-[#64748b] hover:bg-[#f8f9ff] hover:text-[#1e293b] dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">
                <UserCircle size={16} />
                My Profile
              </Link>
              <Link href={userId ? `/profile/${userId}` : "#"} className="flex items-center gap-2 px-4 py-2 text-sm text-[#64748b] hover:bg-[#f8f9ff] hover:text-[#1e293b] dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">
                <User size={16} />
                Public Profile
              </Link>
              <div className="my-1 border-t border-[#e2e8f0] dark:border-gray-700"></div>
              <button 
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
