"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Pen } from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-20 border-b border-white/10 bg-background/50 backdrop-blur-xl">
      <div className="container mx-auto flex h-full items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <Pen size={18} fill="currentColor" />
          </span>
          Blogsy
        </Link>

        <div className="flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`relative text-sm font-medium transition-colors hover:text-primary ${
                pathname === link.path ? "text-primary" : "text-foreground/70"
              }`}
            >
              {link.name}
              {pathname === link.path && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 h-0.5 w-full bg-primary"
                />
              )}
            </Link>
          ))}
          
          <Link
            href="/auth/signin"
            className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white transition-premium hover:opacity-90"
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
