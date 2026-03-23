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
        <div className="mb-8 flex flex-col items-center">
          <img src="/nle-logo.png" alt="NLE" className="h-24 sm:h-32 mb-4" />
          <p className="text-sm sm:text-base tracking-[0.5em] text-[var(--nle-muted)] uppercase">
            Neural Language Encoder
          </p>
        </div>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl font-semibold text-white/90 mb-2">
          Accelerated language learning through neural encoding
        </p>
        <div className="inline-block px-3 py-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-xs font-medium tracking-wider mb-4">
          BETA
        </div>
        <p className="text-xs text-[var(--nle-muted)] mb-10">
          RSVP + binaural beats · experimental learning tool · currently in beta
        </p>

        {/* Encoding visual */}
        <div className="panel border-glow p-5 mb-10 max-w-sm mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-mono tracking-wider">SYSTEM READY</span>
          </div>
          <div className="space-y-3">
            {[
              { label: "RSVP ENGINE", color: "blue", pct: 70, status: "ONLINE", statusColor: "green" },
              { label: "THETA WAVES", color: "purple", pct: 70, status: "6 Hz", statusColor: "green" },
              { label: "VOCAB MODULE", color: "cyan", pct: 70, status: "200 WDS", statusColor: "green" },
              { label: "SAFETY SYS", color: "yellow", pct: 100, status: "ACTIVE", statusColor: "green" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-xs font-mono text-${item.color}-400`}>{item.label}</span>
                  <span className={`text-xs font-mono text-${item.statusColor}-400`}>{item.status}</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full bg-${item.color}-400/60 rounded-full`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          {wordsLearned > 0 && (
            <p className="mt-4 text-green-400 text-xs font-mono">
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
        <Link
          href="/demo"
          className="inline-block mt-6 text-sm px-6 py-3 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-500/10 transition-all font-medium tracking-wider"
        >
          ⚡ QUICK DEMO — 60 seconds
        </Link>

        <div className="flex gap-6 justify-center mt-8 text-sm text-[var(--nle-muted)]">
          <Link href="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link>
          <Link href="/about" className="hover:text-blue-400 transition-colors">How it works</Link>
          <Link href="/safety" className="hover:text-blue-400 transition-colors">Safety info</Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-center text-xs text-[var(--nle-muted)]">
        © 2026 Online Mars LLC
      </footer>
    </div>
  );
}
