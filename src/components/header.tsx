import { geistSans } from "@/app/layout";

const Header = () => {
  return (
    <header className="flex items-center px-4 py-2 border-b dark:border-white/40">
      <h1 className={`${geistSans.className} text-3xl font-bold ml-4`}>
        Automator
      </h1>
    </header>
  );
};

export default Header;
