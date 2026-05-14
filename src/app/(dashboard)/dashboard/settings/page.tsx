"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { UserCog, Save, Mail, Globe, AtSign, Settings as SettingsIcon, Bell, Monitor } from "lucide-react";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    email: "",
    display_name: "",
    bio: "",
    website: "",
    twitter_handle: "",
    email_notifications: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile({
          email: user.email || "",
          display_name: data.display_name || user.email?.split('@')[0] || "",
          bio: data.bio || "",
          website: data.website || "",
          twitter_handle: data.twitter_handle || "",
          email_notifications: data.email_notifications !== false
        });
      } else {
        setProfile(prev => ({ ...prev, email: user.email || "" }));
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setProfile(prev => ({ ...prev, [name]: checked }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ 
        display_name: profile.display_name,
        bio: profile.bio,
        website: profile.website,
        twitter_handle: profile.twitter_handle,
        email_notifications: profile.email_notifications
      })
      .eq("id", user.id);

    if (error) {
      setMessage({ type: "error", text: "Error saving settings: " + error.message });
    } else {
      setMessage({ type: "success", text: "Settings saved successfully!" });
    }
    
    setSaving(false);
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  if (loading) return <div className="p-8 text-[#64748b]">Loading your settings...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/20">
          <SettingsIcon size={20} />
        </div>
        <h1 className="text-2xl font-bold text-[#1e293b]">Account Settings</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Profile Information Section */}
        <div className="rounded-2xl border border-[#e2e8f0] bg-white overflow-hidden shadow-sm">
          <div className="border-b border-[#e2e8f0] bg-[#f8f9ff] px-8 py-5">
            <h2 className="flex items-center gap-2 text-lg font-bold text-[#1e293b]">
              <UserCog size={20} className="text-[#6366f1]" />
              Public Profile
            </h2>
            <p className="text-sm text-[#64748b]">Manage the information that displays on your public blog posts.</p>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1e293b]">Login Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={16} />
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full rounded-xl border border-[#e2e8f0] bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-500 cursor-not-allowed"
                  />
                </div>
                <p className="mt-1.5 text-xs text-[#94a3b8]">Your email cannot be changed here.</p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1e293b]">Display Name</label>
                <input
                  type="text"
                  name="display_name"
                  value={profile.display_name}
                  onChange={handleChange}
                  placeholder="How you appear to others"
                  className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8f9ff] px-4 py-3 text-sm outline-none transition-all focus:border-[#6366f1] focus:bg-white focus:ring-2 focus:ring-[#6366f1]/10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1e293b]">Short Bio</label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                placeholder="Write a few sentences about yourself..."
                rows={3}
                className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8f9ff] px-4 py-3 text-sm outline-none transition-all focus:border-[#6366f1] focus:bg-white focus:ring-2 focus:ring-[#6366f1]/10"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1e293b]">Personal Website</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={16} />
                  <input
                    type="url"
                    name="website"
                    value={profile.website}
                    onChange={handleChange}
                    placeholder="https://yourwebsite.com"
                    className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8f9ff] py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-[#6366f1] focus:bg-white focus:ring-2 focus:ring-[#6366f1]/10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1e293b]">Twitter Handle</label>
                <div className="relative">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={16} />
                  <input
                    type="text"
                    name="twitter_handle"
                    value={profile.twitter_handle}
                    onChange={handleChange}
                    placeholder="@username"
                    className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8f9ff] py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-[#6366f1] focus:bg-white focus:ring-2 focus:ring-[#6366f1]/10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* App Settings Section */}
        <div className="rounded-2xl border border-[#e2e8f0] bg-white overflow-hidden shadow-sm">
          <div className="border-b border-[#e2e8f0] bg-[#f8f9ff] px-8 py-5">
            <h2 className="flex items-center gap-2 text-lg font-bold text-[#1e293b]">
              <Monitor size={20} className="text-[#6366f1]" />
              App Preferences
            </h2>
            <p className="text-sm text-[#64748b]">Customize your Blogsy dashboard experience.</p>
          </div>

          <div className="p-8 space-y-8">


            {/* Notifications Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef0ff] text-[#6366f1]">
                  <Bell size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1e293b]">Email Notifications</h3>
                  <p className="text-xs text-[#64748b] mt-1">Receive alerts when someone comments or likes your posts.</p>
                </div>
              </div>
              
              <label className="relative inline-flex cursor-pointer items-center">
                <input 
                  type="checkbox" 
                  name="email_notifications"
                  checked={profile.email_notifications}
                  onChange={handleChange}
                  className="peer sr-only" 
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#6366f1] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between rounded-2xl bg-[#1e293b] p-6 shadow-xl">
          <div className="flex-1">
            {message.text && (
              <p className={`text-sm font-medium ${message.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                {message.text}
              </p>
            )}
            {!message.text && <p className="text-sm text-gray-400">Don't forget to save your changes.</p>}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-[#6366f1] px-8 py-3 text-sm font-bold text-white transition-all hover:bg-[#4f46e5] disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? "Saving Changes..." : "Save All Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
