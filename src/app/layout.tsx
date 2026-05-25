import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";
import FileUploadContext from "@/components/file-upload-controller";
import { poppins } from "@/utils/fonts";

export const metadata: Metadata = {
  title: "Automator",
  description: "Automate your Youtube channel",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col dark:bg-neutral-950 dark:text-white">
        <FileUploadContext>
          <Header />
          <main className="bg-neutral-50 dark:bg-neutral-950 flex-1 noisy-background px-6 lg:px-8 py-4">
            {children}
          </main>
          {modal}
        </FileUploadContext>
      </body>
    </html>
  );
}
