import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "GatorResource | Find your next step",
  description: "Find campus support at San Francisco State. An independent student-built prototype."
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
