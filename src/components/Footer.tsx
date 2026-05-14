import { Pen } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-white/10 bg-background/50 py-12 backdrop-blur-xl">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col gap-4">
            <span className="flex items-center gap-2 text-xl font-bold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                <Pen size={18} fill="currentColor" />
              </span>
              Blogsy
            </span>
            <p className="text-sm text-foreground/50">
              © {new Date().getFullYear()} Blogsy. Built with Next.js & Supabase.
            </p>
          </div>
          <div className="flex gap-8 text-sm text-foreground/50">
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary transition-colors">GitHub</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
