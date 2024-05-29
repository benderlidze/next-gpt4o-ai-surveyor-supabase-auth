import { createClient } from "@/utils/supabase/server";
import Header from "@/components/Header";
import { redirect } from "next/navigation";
import { Report } from "@/components/Report";
import { Nav } from "@/components/Nav";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <Nav />
      <div className=" flex-1 flex flex-col  max-w-4xl px-3">
        <Header />
        <Report />
      </div>
    </div>
  );
}
