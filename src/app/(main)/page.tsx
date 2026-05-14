import { redirect } from "next/navigation";

export default function Home() {
  // Redirect root directly to sign-in page as requested
  redirect("/auth/signin");
}
