import { Inter, Crimson_Pro } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const crimson = Crimson_Pro({ subsets: ["latin"], variable: '--font-serif' });

export const metadata = {
  title: "Blogsy | Premium Cloud-Based Platform",
  description: "A state-of-the-art blog platform built with Next.js and Supabase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${crimson.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
