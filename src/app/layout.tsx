import type { Metadata } from "next";
import { Geist, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import FileUploadContext from "@/components/file-upload-controller";

const poppins = Poppins({
  weight: ["400", "500", "700"],
});

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "Automator",
  description: "Automate your Youtube channel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col dark:bg-neutral-950 dark:text-white">
        <FileUploadContext>
          <Header />
          <main className="bg-neutral-50 dark:bg-neutral-950 flex-1 noisy-background px-6 lg:px-8 py-4">
            {children}
          </main>
        </FileUploadContext>
      </body>
    </html>
  );
}
