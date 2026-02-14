"use client";

import { createClient } from "@/lib/supabase/client";
import {GoogleIcon} from "@/components/Svgs";

export default function LoginPage() {
  const handleLogin = async () => {
    const supabase = createClient();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${appUrl}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-card border border-border rounded-xl p-10 text-center max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-2">Smart Bookmark App</h1>
        <p className="text-muted mb-8 text-sm">
          Sign in
        </p>
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-black font-medium py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <GoogleIcon />
          Continue with Google
        </button>
      </div>
    </div>
  );
}


