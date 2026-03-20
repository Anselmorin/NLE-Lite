"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProgress } from "@/lib/storage";

export default function Home() {
  const [wordsLearned, setWordsLearned] = useState(0);

  useEffect(() => {
    const p = getProgress();
    setWordsLearned(p.learnedWordIds.length);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Hero */}
      <div className="text-center relative z-10 max-w-2xl">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-6xl sm:text-8xl font-black tracking-[0.4em] glow-blue text-blue-400 mb-2">
            N·L·E
          </h1>
          <p className="text-sm sm:text-base tracking-[0.5em] text-[var(--nle-muted)] uppercase">
            Neural Language Encoder
          </p>
        </div>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl font-semibold text-white/90 mb-2">
          Learn any language in 30 minutes
        </p>
        <p className="text-xs text-[var(--nle-muted)] mb-10">
          *results may vary · powered by RSVP + binaural beats
        </p>

        {/* Encoding visual */}
        <div className="panel border-glow p-6 mb-10 text-left font-mono text-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs">SYSTEM READY</span>
          </div>
          <div className="space-y-2 text-[var(--nle-muted)]">
            <p>╔══════════════════════════════════════╗</p>
            <p>║ <span className="text-blue-400">RSVP ENGINE</span>    ▓▓▓▓▓▓▓▓░░ <span className="text-green-400">ONLINE</span>  ║</p>
            <p>║ <span className="text-purple-400">THETA WAVES</span>   ▓▓▓▓▓▓▓▓░░ <span className="text-green-400">6 Hz</span>    ║</p>
            <p>║ <span className="text-cyan-400">VOCAB MODULE</span>   ▓▓▓▓▓▓▓▓░░ <span className="text-green-400">200 WDS</span>  ║</p>
            <p>║ <span className="text-yellow-400">SAFETY SYS</span>    ▓▓▓▓▓▓▓▓▓▓ <span className="text-green-400">ACTIVE</span>  ║</p>
            <p>╚══════════════════════════════════════╝</p>
          </div>
          {wordsLearned > 0 && (
            <p className="mt-3 text-green-400 text-xs">
              ► {wordsLearned} words encoded to memory
            </p>
          )}
        </div>

        {/* CTA */}
        <Link
          href="/learn"
          className="inline-block btn-primary text-lg px-10 py-4 pulse-glow rounded-lg font-bold tracking-wider"
        >
          ▶ START ENCODING
        </Link>

        {/* Quick links */}
        <div className="flex gap-6 justify-center mt-8 text-sm text-[var(--nle-muted)]">
          <Link href="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link>
          <Link href="/about" className="hover:text-blue-400 transition-colors">How it works</Link>
          <Link href="/safety" className="hover:text-blue-400 transition-colors">Safety info</Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-center text-xs text-[var(--nle-muted)]">
        Invented by Ansel Morin © 2026
      </footer>
    </div>
  );
}
