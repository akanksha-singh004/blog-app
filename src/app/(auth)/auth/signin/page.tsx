"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, Pen, User } from "lucide-react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex w-full max-w-[1000px] overflow-hidden rounded-3xl bg-white shadow-2xl">
      {/* Left Side - Illustration and Text */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-[#eef0ff] p-12 lg:flex">
        <div className="z-10">
          <div className="flex items-center gap-2 mb-12">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6366f1] text-white">
              <Pen size={20} fill="currentColor" />
            </div>
            <span className="text-2xl font-bold text-[#1e293b]">Blogsy</span>
          </div>

          <h1 className="mb-6 text-4xl font-serif leading-tight text-[#1e293b]">
            Share your thoughts. <br />
            <span className="text-[#6366f1]">Inspire</span> the world.
          </h1>
          <p className="max-w-[300px] text-sm leading-relaxed text-[#64748b]">
            Blogsy is the modern space to write, connect, and grow your audience.
          </p>
        </div>

        <div className="relative z-10 mt-12 overflow-hidden rounded-2xl shadow-lg border border-white/20">
          <Image
            src="/images/login-illustration.png"
            alt="Cozy desk setup"
            width={500}
            height={400}
            className="w-full object-cover"
          />
        </div>
        
        {/* Background blobs for depth */}
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#6366f1]/10 blur-3xl" />
        <div className="absolute top-1/2 -right-10 h-32 w-32 rounded-full bg-[#6366f1]/5 blur-2xl" />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full flex-col justify-center px-8 py-16 lg:w-1/2 lg:px-16">
        <div className="mb-10">
          <h2 className="mb-2 text-3xl font-bold text-[#1e293b]">Welcome back 👋</h2>
          <p className="text-sm text-[#64748b]">Login to continue to Blogsy</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[#e2e8f0] bg-white py-3.5 pl-12 pr-4 text-sm outline-none transition-all focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/10"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[#e2e8f0] bg-white py-3.5 pl-12 pr-12 text-sm outline-none transition-all focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/10"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link href="#" className="text-xs font-semibold text-[#6366f1] hover:underline">
              Forgot password?
            </Link>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#6366f1] py-4 font-bold text-white shadow-lg shadow-[#6366f1]/30 transition-all hover:bg-[#4f46e5] active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="relative my-10 flex items-center justify-center">
          <div className="h-px w-full bg-[#e2e8f0]" />
          <span className="absolute bg-white px-4 text-xs font-medium text-[#94a3b8]">
            or continue with
          </span>
        </div>

        <div className="flex gap-4">
          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="flex flex-1 items-center justify-center gap-3 rounded-xl border border-[#e2e8f0] py-3.5 text-sm font-semibold text-[#1e293b] transition-all hover:bg-[#f8f9ff]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.273 0 3.191 2.691 1.091 6.627l4.175 3.138z"
              />
              <path
                fill="#34A853"
                d="M16.04 18.013c-1.09.696-2.473 1.077-4.04 1.077a7.077 7.077 0 0 1-6.734-4.855L1.09 17.373C3.19 21.309 7.273 24 12 24c3.055 0 5.782-1.018 7.909-2.745l-3.869-3.242z"
              />
              <path
                fill="#4285F4"
                d="M19.909 21.255C22.4 19.227 24 16.036 24 12c0-.773-.091-1.564-.273-2.318H12v4.709h6.745c-.318 1.582-1.255 2.873-2.582 3.745l3.746 3.119z"
              />
              <path
                fill="#FBBC05"
                d="M5.266 14.235l-4.175 3.138A11.91 11.91 0 0 1 0 12c0-1.927.455-3.745 1.255-5.373l4.01 3.138a7.065 7.065 0 0 0 0 4.47z"
              />
            </svg>
            Google
          </button>
          <button className="flex flex-1 items-center justify-center gap-3 rounded-xl border border-[#e2e8f0] py-3.5 text-sm font-semibold text-[#1e293b] transition-all hover:bg-[#f8f9ff]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            GitHub
          </button>
        </div>

        <p className="mt-10 text-center text-sm text-[#64748b]">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="font-bold text-[#6366f1] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
