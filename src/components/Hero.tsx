"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />
      
      <div className="container relative z-10 mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight md:text-7xl">
            Share your thoughts. <br />
            <span className="text-gradient">Inspire</span> the world.
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-foreground/70 md:text-xl">
            Blogsy is the modern space to write, connect, and grow your audience. Built with the speed of Next.js and the power of Supabase.
          </p>
          <div className="flex justify-center gap-4">
            <button className="rounded-full bg-primary px-8 py-4 font-bold text-white transition-premium hover:scale-105 hover:animate-glow">
              Explore Stories
            </button>
            <Link href="/write" className="rounded-full border border-white/10 bg-white/5 px-8 py-4 font-bold backdrop-blur-sm transition-premium hover:bg-white/10">
              Start Writing
            </Link>
          </div>
        </motion.div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />
    </section>
  );
};

export default Hero;
