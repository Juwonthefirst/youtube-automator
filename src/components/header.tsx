import { geistSans } from "@/app/layout";
import { Upload, UploadCloud } from "lucide-react";
import Link from "next/link";

const Header = () => {
  return (
    <header className="flex items-center px-8 py-2 border-b border-black/40 dark:border-white/40 justify-between">
      <h1 className={`${geistSans.className} text-3xl font-bold`}>
        <Link href="/">Automator</Link>
      </h1>
      <nav className="flex gap-6 items-center">
        <Link
          className="hover:bg-black/10 dark:hover:bg-white/20 p-1.5 rounded-full"
          href="/upload/active"
        >
          <Upload />
        </Link>
        <Link
          href="/upload"
          className="flex gap-1 bg-black text-white dark:text-black items-center dark:bg-white font-medium rounded-md py-1 px-2 hover:ring-4 ring-black/10 dark:ring-white/20"
        >
          <UploadCloud size={18} /> Upload
        </Link>
      </nav>
    </header>
  );
};

export default Header;
