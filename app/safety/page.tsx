"use client";

export default function SafetyPage() {
  return (
    <div className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold glow-blue text-blue-400 mb-2">SAFETY INFORMATION</h1>
      <p className="text-[var(--nle-muted)] text-sm mb-8">Your safety is our #1 priority</p>

      <div className="space-y-6">
        <section className="panel p-6">
          <h2 className="text-lg font-bold text-white mb-3">⚡ Photosensitivity Warning</h2>
          <p className="text-sm text-[var(--nle-muted)] leading-relaxed">
            NLE uses Rapid Serial Visual Presentation (RSVP) which displays words in quick succession. 
            While our system is designed to be safe, people with photosensitive epilepsy or a history 
            of seizures should consult a doctor before using this application.
          </p>
        </section>

        <section className="panel p-6">
          <h2 className="text-lg font-bold text-white mb-3">🛡️ Built-in Safety Systems</h2>
          <div className="space-y-4 text-sm text-[var(--nle-muted)]">
            <div className="flex gap-3">
              <span className="text-green-400 mt-0.5">✓</span>
              <div>
                <p className="text-white font-medium">Speed Cap: 8 words/second maximum</p>
                <p>Well below the 14 Hz seizure threshold. Under-18 conservative limit at 10 Hz.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-green-400 mt-0.5">✓</span>
              <div>
                <p className="text-white font-medium">No Red Flashing</p>
                <p>Red light at certain frequencies is a known seizure trigger. NLE uses only blues, greens, purples, and soft whites — never red.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-green-400 mt-0.5">✓</span>
              <div>
                <p className="text-white font-medium">15-Minute Session Limit</p>
                <p>Sessions automatically end after 15 minutes to prevent eye strain and fatigue.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-green-400 mt-0.5">✓</span>
              <div>
                <p className="text-white font-medium">Mandatory Micro-Breaks</p>
                <p>Every 5 minutes, the system pauses for 5 seconds with a calming screen to rest your eyes.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-green-400 mt-0.5">✓</span>
              <div>
                <p className="text-white font-medium">Panic Stop (ESC / STOP button)</p>
                <p>Press ESC or the STOP button at any time to immediately halt the session.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-green-400 mt-0.5">✓</span>
              <div>
                <p className="text-white font-medium">Low Contrast Design</p>
                <p>No pure black-to-white flashing. We use dark gray backgrounds with soft colored text to minimize contrast.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-green-400 mt-0.5">✓</span>
              <div>
                <p className="text-white font-medium">Post-Session Wellness Check</p>
                <p>After every session, we ask how you feel. If something&apos;s off, take a longer break.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="panel p-6">
          <h2 className="text-lg font-bold text-white mb-3">🎧 Binaural Beats</h2>
          <p className="text-sm text-[var(--nle-muted)] leading-relaxed mb-3">
            NLE uses binaural beats (200 Hz left ear, 206 Hz right ear = 6 Hz theta difference) 
            played at low volume. Theta waves (4-8 Hz) are associated with relaxed focus and memory encoding.
          </p>
          <p className="text-sm text-[var(--nle-muted)] leading-relaxed">
            Use headphones for the binaural effect. The audio is optional and can be toggled off. 
            If you experience any discomfort, turn it off immediately.
          </p>
        </section>

        <section className="panel p-6">
          <h2 className="text-lg font-bold text-white mb-3">📋 Recommended Usage</h2>
          <ul className="text-sm text-[var(--nle-muted)] space-y-2">
            <li>• Start at low speed (1-2 words/sec) and increase gradually</li>
            <li>• Take breaks between sessions (at least 10 minutes)</li>
            <li>• Use in a well-lit room</li>
            <li>• Stop immediately if you feel dizzy, nauseous, or see spots</li>
            <li>• Maximum 3 sessions per day recommended</li>
            <li>• Keep headphone volume low when using binaural beats</li>
          </ul>
        </section>

        <section className="panel p-6">
          <h2 className="text-lg font-bold text-white mb-3">🔬 The Science</h2>
          <p className="text-sm text-[var(--nle-muted)] leading-relaxed">
            RSVP is a well-studied technique in cognitive psychology for rapid information processing. 
            Combined with theta-frequency binaural beats, which research suggests may enhance memory 
            encoding, NLE creates an optimized learning environment. However, individual results vary 
            and this is an experimental learning tool.
          </p>
        </section>
      </div>

      <footer className="text-center text-xs text-[var(--nle-muted)] mt-8 pb-8">
        Questions? © 2026 Online Mars LLC
      </footer>
    </div>
  );
}
