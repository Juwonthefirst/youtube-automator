import { geistSans } from "@/app/layout";

const Header = () => {
  return (
    <header className="flex justify-center items-center px-4 py-2 border-b dark:border-white/80">
      <h1 className={`${geistSans.className} text-3xl font-bold`}>Automator</h1>
    </header>
  );
};

export default Header;
