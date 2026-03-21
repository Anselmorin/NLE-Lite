import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "N·L·E — Neural Language Encoder",
  description: "Learn any language in 30 minutes with RSVP + binaural beats. By Online Mars LLC.",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased scanline grid-bg min-h-screen">
        <nav className="fixed top-0 left-0 right-0 z-40 border-b border-[var(--nle-border)] bg-[var(--nle-bg)]/80 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <img src="/nle-logo.png" alt="NLE" className="h-8 rounded" />
            </a>
            <div className="flex items-center gap-4 text-sm">
              <a href="/learn" className="text-[var(--nle-muted)] hover:text-blue-400 transition-colors">Learn</a>
              <a href="/dashboard" className="text-[var(--nle-muted)] hover:text-blue-400 transition-colors">Dashboard</a>
              <a href="/safety" className="text-[var(--nle-muted)] hover:text-blue-400 transition-colors">Safety</a>
              <a href="/about" className="text-[var(--nle-muted)] hover:text-blue-400 transition-colors">About</a>
            </div>
          </div>
        </nav>
        <main className="pt-14">{children}</main>
      </body>
    </html>
  );
}
