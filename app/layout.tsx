import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
 

export const metadata: Metadata = {
  title: "Kanban Board",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
