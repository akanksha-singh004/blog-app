import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-height-[calc(100vh-120px)] pt-20">
        {children}
      </main>
      <Footer />
    </>
  );
}
