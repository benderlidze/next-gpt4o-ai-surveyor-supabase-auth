"use client";
import { createClient } from "@/utils/supabase/client";

export const LoginGithub = () => {
  const loginWithGitHub = () => {
    const supabase = createClient();
    supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <button
      onClick={loginWithGitHub}
      className="bg-black text-white px-4 py-2 rounded"
    >
      Login with GitHub
    </button>
  );
};
