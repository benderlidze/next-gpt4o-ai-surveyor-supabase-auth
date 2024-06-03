import AuthButton from "@/components/AuthButton";

export const Nav = () => {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
        <div>
          <img src="images/logo.png" alt="logo" className="max-h-12" />
        </div>
        {/* <AuthButton /> */}
      </div>
    </nav>
  );
};
