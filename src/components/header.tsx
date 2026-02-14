"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Header({ email }: { email: string }) {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-xl font-bold">Smart Bookmark App</h1>
        <p className="text-muted text-xs">{email}</p>
      </div>
      <button
        onClick={handleSignOut}
        className="text-muted hover:text-foreground text-sm transition-colors cursor-pointer"
      >
        Sign out
      </button>
    </header>
  );
}
