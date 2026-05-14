"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User, Mail, Lock, Eye, EyeOff, Pen } from "lucide-react";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/auth/signin?message=Check your email to confirm your account");
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
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
            Join our community. <br />
            <span className="text-[#6366f1]">Start</span> your journey.
          </h1>
          <p className="max-w-[300px] text-sm leading-relaxed text-[#64748b]">
            Create an account to start sharing your thoughts with the world today.
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
        
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#6366f1]/10 blur-3xl" />
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="flex w-full flex-col justify-center px-8 py-16 lg:w-1/2 lg:px-16">
        <div className="mb-10">
          <h2 className="mb-2 text-3xl font-bold text-[#1e293b]">Create account ✨</h2>
          <p className="text-sm text-[#64748b]">Sign up to start your Blogsy experience</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
              Display Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-xl border border-[#e2e8f0] bg-white py-3.5 pl-12 pr-4 text-sm outline-none transition-all focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/10"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

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
                placeholder="Create a password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#6366f1] py-4 font-bold text-white shadow-lg shadow-[#6366f1]/30 transition-all hover:bg-[#4f46e5] active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-[#64748b]">
          Already have an account?{" "}
          <Link href="/auth/signin" className="font-bold text-[#6366f1] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
