"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold glow-blue text-blue-400 mb-2">HOW IT WORKS</h1>
      <p className="text-[var(--nle-muted)] text-sm mb-8">The science behind Neural Language Encoding</p>

      <div className="space-y-6">
        {/* The Problem */}
        <section className="panel p-6">
          <h2 className="text-lg font-bold text-white mb-3">🌍 The Problem</h2>
          <p className="text-sm text-[var(--nle-muted)] leading-relaxed">
            Learning a language traditionally takes <span className="text-white font-medium">600–2,200+ hours</span> of 
            study. Millions of people need new languages for work, travel, and communication but don&apos;t 
            have years to dedicate. What if we could compress that timeline dramatically?
          </p>
        </section>

        {/* The Solution */}
        <section className="panel p-6">
          <h2 className="text-lg font-bold text-white mb-3">⚡ The NLE Approach</h2>
          <p className="text-sm text-[var(--nle-muted)] leading-relaxed mb-4">
            NLE combines two proven cognitive techniques — <span className="text-blue-400">Rapid Serial Visual Presentation (RSVP)</span> and 
            <span className="text-purple-400"> theta-frequency binaural beats</span> — to create an optimized 
            encoding environment that bypasses traditional rote memorization.
          </p>
          <p className="text-sm text-[var(--nle-muted)] leading-relaxed">
            Instead of spending months with flashcards, NLE streams vocabulary, grammar patterns, and 
            pronunciation data directly through your visual cortex at speeds your subconscious can process 
            — while binaural beats guide your brain into an optimal learning state.
          </p>
        </section>

        {/* The 4-Step Process */}
        <section className="panel p-6">
          <h2 className="text-lg font-bold text-white mb-4">🧠 The Encoding Process</h2>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">1</div>
              <div>
                <p className="text-white font-medium mb-1">Calibration</p>
                <p className="text-sm text-[var(--nle-muted)]">
                  The system calibrates to your reading speed and comfort level. Start slow, 
                  increase as you get comfortable. Your baseline is saved for future sessions.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">2</div>
              <div>
                <p className="text-white font-medium mb-1">Entrainment</p>
                <p className="text-sm text-[var(--nle-muted)]">
                  Binaural beats (200 Hz + 206 Hz = 6 Hz theta difference) guide your brainwaves 
                  to the theta state (4–8 Hz) — the zone associated with deep focus and memory formation.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">3</div>
              <div>
                <p className="text-white font-medium mb-1">Encoding</p>
                <p className="text-sm text-[var(--nle-muted)]">
                  Words flash in rapid succession — vocabulary paired with translations, color-coded 
                  by category. Your visual cortex processes information far faster than conscious reading. 
                  The RSVP engine handles vocabulary, grammar structures, and common phrases.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 font-bold">4</div>
              <div>
                <p className="text-white font-medium mb-1">Verification</p>
                <p className="text-sm text-[var(--nle-muted)]">
                  After encoding, a quick quiz tests retention. Track your progress on the dashboard 
                  and see which words stuck. Repeat sessions to strengthen neural pathways.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Science */}
        <section className="panel p-6">
          <h2 className="text-lg font-bold text-white mb-3">🔬 The Science</h2>
          <div className="space-y-3 text-sm text-[var(--nle-muted)]">
            <div className="flex gap-3">
              <span className="text-blue-400 mt-0.5">▸</span>
              <div>
                <p className="text-white font-medium">Rapid Serial Visual Presentation (RSVP)</p>
                <p>A well-studied cognitive technique where information is displayed one item at a time in rapid succession. Research shows the brain can process visual data at speeds far beyond conscious reading ability.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-purple-400 mt-0.5">▸</span>
              <div>
                <p className="text-white font-medium">Binaural Beat Entrainment</p>
                <p>When two slightly different frequencies are played in each ear, the brain perceives a third &quot;beat&quot; frequency. Theta-range beats (4–8 Hz) are associated with enhanced memory encoding and relaxed focus.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-cyan-400 mt-0.5">▸</span>
              <div>
                <p className="text-white font-medium">Visual Cortex → Language Pathway</p>
                <p>The visual cortex has direct connections to language processing areas (Broca&apos;s and Wernicke&apos;s areas). RSVP exploits this pathway for rapid vocabulary acquisition.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-green-400 mt-0.5">▸</span>
              <div>
                <p className="text-white font-medium">Synaptic Plasticity</p>
                <p>During theta brain states, synaptic plasticity increases — meaning new neural connections form more readily. This is the biological basis for why theta states enhance learning.</p>
              </div>
            </div>
          </div>
        </section>

        {/* The Vision */}
        <section className="panel p-6 border-glow">
          <h2 className="text-lg font-bold text-white mb-3">🚀 The Vision</h2>
          <p className="text-sm text-[var(--nle-muted)] leading-relaxed mb-3">
            This web app is a <span className="text-white">proof of concept</span>. The full NLE vision is a 
            hardware device — a precision visor with high-refresh micro-displays, eye tracking, and EEG 
            sensors that can encode an entire language in a single 30-minute session.
          </p>
          <p className="text-sm text-[var(--nle-muted)] leading-relaxed">
            The web version demonstrates the core principles: RSVP encoding + binaural entrainment + 
            spaced repetition verification. The hardware version would add direct neural feedback and 
            speeds impossible on consumer displays.
          </p>
        </section>

        {/* CTA */}
        <div className="text-center py-4">
          <Link
            href="/learn"
            className="inline-block btn-primary text-base px-8 py-3 pulse-glow rounded-lg font-bold tracking-wider"
          >
            ▶ TRY IT NOW
          </Link>
          <div className="flex gap-6 justify-center mt-4 text-sm text-[var(--nle-muted)]">
            <Link href="/safety" className="hover:text-blue-400 transition-colors">Safety info</Link>
            <Link href="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link>
          </div>
        </div>
      </div>

      <footer className="text-center text-xs text-[var(--nle-muted)] mt-8 pb-8">
        © 2026 Online Mars LLC
      </footer>
    </div>
  );
}
