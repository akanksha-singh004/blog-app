import { AnimatedDots } from "@/components/AnimatedDots";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedDots />
      <div className="relative z-10 w-full flex justify-center">
        {children}
      </div>
    </div>
  );
}
