import DeployButton from "@/components/DeployButton";
import AuthButton from "@/components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import Header from "@/components/Header";
import { redirect } from "next/navigation";
import { Report } from "@/components/Report";

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
      <div className="w-full">
        {/* <div className="py-6 font-bold bg-purple-950 text-center">
          This is a protected page that you can only see as an authenticated
          user
        </div> */}
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
            <div>
              <img src="images/logo.png" alt="logo" className="max-h-12" />
            </div>
            <AuthButton />
          </div>
        </nav>
      </div>

      <div className=" flex-1 flex flex-col  max-w-4xl px-3">
        <Header />
        <Report />
      </div>

      <footer className="align-middle flex-row w-full border-t p-4 flex justify-between text-xs">
        <div className="flex-1">
          Built by the team behind{" "}
          <a
            className="font-bold"
            target="_blank"
            href="https://www.therequirementlist.com/"
          >
            The Requirement List
          </a>
        </div>
        <div className="flex-1 flex items-center text-center flex-col ">
          <div>Trusted by the leading property consultancies in the UK</div>
          <img src="images/logos.png" alt="" className="w-3/6" />
        </div>
        <div></div>
      </footer>
    </div>
  );
}
