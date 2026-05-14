"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User, Mail, Calendar, UserCircle, FileText, Save, Camera } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    email: "",
    display_name: "",
    age: "",
    gender: "",
    bio: "",
    avatar_url: ""
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
          display_name: data.display_name || "",
          age: data.age?.toString() || "",
          gender: data.gender || "",
          bio: data.bio || "",
          avatar_url: data.avatar_url || ""
        });
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
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
        age: profile.age ? parseInt(profile.age) : null,
        gender: profile.gender,
        bio: profile.bio
      })
      .eq("id", user.id);

    if (error) {
      setMessage({ type: "error", text: "Error saving profile: " + error.message });
    } else {
      setMessage({ type: "success", text: "Profile updated successfully!" });
    }
    
    setSaving(false);
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  if (loading) return <div className="p-8 text-[#64748b]">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/20">
          <UserCircle size={20} />
        </div>
        <h1 className="text-2xl font-bold text-[#1e293b]">My Profile</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-8 shadow-sm">
          {/* Avatar Section */}
          <div className="mb-10 flex flex-col items-center gap-4 border-b border-[#e2e8f0] pb-10 md:flex-row">
            <div className="relative group">
              <div className="h-24 w-24 overflow-hidden rounded-2xl bg-[#f8f9ff] border-2 border-dashed border-[#cbd5e1] flex items-center justify-center">
                {profile.display_name ? (
                  <img 
                    src={`https://api.dicebear.com/7.x/notionists/svg?seed=${profile.display_name}`} 
                    alt="Avatar" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User size={40} className="text-[#cbd5e1]" />
                )}
              </div>
              <button type="button" className="absolute -bottom-2 -right-2 rounded-lg bg-white p-1.5 shadow-md border border-[#e2e8f0] text-[#6366f1] hover:bg-[#6366f1] hover:text-white transition-all">
                <Camera size={14} />
              </button>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-lg font-bold text-[#1e293b]">Profile Picture</h2>
              <p className="text-sm text-[#64748b]">Upload a custom photo or use our generated avatar.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="col-span-full">
              <label className="mb-2 block text-sm font-semibold text-[#1e293b]">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8f9ff]/50 py-3 pl-12 pr-4 text-sm text-[#94a3b8] cursor-not-allowed"
                />
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1e293b]">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
                <input
                  type="text"
                  name="display_name"
                  value={profile.display_name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8f9ff] py-3 pl-12 pr-4 text-sm outline-none transition-all focus:border-[#6366f1] focus:bg-white"
                  required
                />
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1e293b]">Age</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
                <input
                  type="number"
                  name="age"
                  value={profile.age}
                  onChange={handleChange}
                  placeholder="e.g. 25"
                  className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8f9ff] py-3 pl-12 pr-4 text-sm outline-none transition-all focus:border-[#6366f1] focus:bg-white"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1e293b]">Gender</label>
              <select
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8f9ff] px-4 py-3 text-sm outline-none transition-all focus:border-[#6366f1] focus:bg-white"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            {/* About / Bio */}
            <div className="col-span-full">
              <label className="mb-2 block text-sm font-semibold text-[#1e293b]">About Note</label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 text-[#94a3b8]" size={18} />
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8f9ff] py-3 pl-12 pr-4 text-sm outline-none transition-all focus:border-[#6366f1] focus:bg-white"
                />
              </div>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-between border-t border-[#e2e8f0] pt-8">
            <div className="flex-1">
              {message.text && (
                <p className={`text-sm font-medium ${message.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                  {message.text}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-[#6366f1] px-8 py-3 font-bold text-white shadow-lg shadow-[#6366f1]/20 transition-all hover:bg-[#4f46e5] disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
