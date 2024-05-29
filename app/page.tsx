import { createClient } from "@/utils/supabase/server";
import Header from "@/components/Header";
import { GenerateReportButton } from "@/components/GenerateReportButton";
import { Nav } from "@/components/Nav";

export default async function Index() {
  const canInitSupabaseClient = () => {
    // This function is just for the interactive tutorial.
    // Feel free to remove it once you have Supabase connected.
    try {
      createClient();
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <Nav />

      <div className="animate-in flex-1 flex flex-col gap-10 opacity-0 max-w-4xl px-3">
        <Header />
        <main className="flex-1 flex flex-col gap-6">
          <div className="flex flex-col ">
            <GenerateReportButton />
          </div>
          <div className="flex flex-row gap-6">
            <div className="flex flex-col items-center">
              Uploaded image
              <img
                src="images/example.png"
                alt="example"
                className="border rounded-lg"
              />
            </div>
            <div className="flex flex-col items-center">
              Instant AI report
              <img
                src="images/report.gif"
                alt="example"
                className="border rounded-lg"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
