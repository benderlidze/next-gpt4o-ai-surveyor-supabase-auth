"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export const GenerateReportButton = () => {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<User | null>();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    checkUser();
  }, []);

  const handleGenerateClick = () => {
    // if (!user) {
    //   return router.push("/login");
    // }
    return router.push("/report");
  };

  return (
    <button
      onClick={handleGenerateClick}
      // className="max-w-4xl py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
    >
      {/* {(user && `Generate a report`) || `Login to generate a report`} */}
      Generate a report
    </button>
  );
};
