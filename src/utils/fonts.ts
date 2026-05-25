import { Geist, Poppins } from "next/font/google";

export const poppins = Poppins({
  weight: ["400", "500", "700"],
});

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["700"],
});
