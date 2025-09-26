// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fokus",
  description: "Foca no que interessa.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body className={`${inter.className} min-h-screen`}>
        <header className="border-b border-zinc-800">
          <nav className="container flex h-14 items-center justify-between">
            <Link href="/" className="font-semibold">Fokus</Link>
            <div className="flex gap-4 text-sm">
              <Link href="/add">Adicionar</Link>
              <Link href="/library">Biblioteca</Link>
              <Link href="/sessions">Sessões</Link>
            </div>
          </nav>
        </header>
        <main className="container py-8">{children}</main>
      </body>
    </html>
  );
}
