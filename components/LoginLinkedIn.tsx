"use client";
import { createClient } from "@/utils/supabase/client";

export const LoginLinkedIn = () => {
  const loginWithLinkedID = () => {
    const supabase = createClient();
    supabase.auth.signInWithOAuth({
      provider: "linkedin_oidc",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <button
      onClick={loginWithLinkedID}
      className="bg-black text-white px-4 py-2 rounded"
    >
      Login with LinkedIn
    </button>
  );
};
