import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Let me chat GPT that for you",
  description: "Teach someone how to use GPT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
