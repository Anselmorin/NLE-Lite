"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { vocabulary, Word, POS_COLORS, getWordsByTiers } from "@/lib/vocabulary";
import { startBinauralBeats, stopBinauralBeats, speakSpanish } from "@/lib/audio";
import { getProgress, acceptDisclaimer, addSession } from "@/lib/storage";

type Phase = "setup" | "disclaimer" | "running" | "microbreak" | "wellness" | "complete";
type DisplayPhase = "spanish" | "english" | "both" | "example";

const MAX_SESSION_SECONDS = 15 * 60; // 15 minutes
const MICROBREAK_INTERVAL = 5 * 60; // 5 minutes
const MICROBREAK_DURATION = 5; // seconds
const MAX_SPEED = 12;
const DEFAULT_SPEED = 4;

export default function LearnPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("setup");
  const [selectedTiers, setSelectedTiers] = useState<number[]>([1]);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [binauralOn, setBinauralOn] = useState(true);
  const [pronounceOn, setPronounceOn] = useState(true);

  // Running state
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayPhase, setDisplayPhase] = useState<DisplayPhase>("spanish");
  const [timeRemaining, setTimeRemaining] = useState(MAX_SESSION_SECONDS);
  const [sessionStartTime, setSessionStartTime] = useState(0);
  const [microbreakCountdown, setMicrobreakCountdown] = useState(MICROBREAK_DURATION);
  const [nextBreakAt, setNextBreakAt] = useState(MICROBREAK_INTERVAL);
  const [wellnessRating, setWellnessRating] = useState(0);
  const [wordsShown, setWordsShown] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionElapsed = useRef(0);

  // Check disclaimer
  useEffect(() => {
    const p = getProgress();
    if (!p.disclaimerAccepted) {
      setPhase("disclaimer");
    }
  }, []);

  const stopSession = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (wordTimerRef.current) clearInterval(wordTimerRef.current);
    stopBinauralBeats();
    window.speechSynthesis?.cancel();
  }, []);

  // Panic button: ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && (phase === "running" || phase === "microbreak")) {
        stopSession();
        setPhase("wellness");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, stopSession]);

  // Session timer
  useEffect(() => {
    if (phase !== "running") return;

    timerRef.current = setInterval(() => {
      sessionElapsed.current += 1;
      const remaining = MAX_SESSION_SECONDS - sessionElapsed.current;
      setTimeRemaining(remaining);

      // Check microbreak
      if (sessionElapsed.current > 0 && sessionElapsed.current % MICROBREAK_INTERVAL === 0) {
        if (wordTimerRef.current) clearInterval(wordTimerRef.current);
        setPhase("microbreak");
        setMicrobreakCountdown(MICROBREAK_DURATION);
      }

      // Time's up
      if (remaining <= 0) {
        stopSession();
        setPhase("wellness");
      }
    }, 1000);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, stopSession]);

  // Microbreak countdown
  useEffect(() => {
    if (phase !== "microbreak") return;
    const interval = setInterval(() => {
      setMicrobreakCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setPhase("running");
          startWordCycle();
          return MICROBREAK_DURATION;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  // Word cycling — shows words in learning batches of 5
  // Each word gets: spanish (with audio) → english → both together → next word
  // After every 5 words, reviews all 5 before moving on
  const batchRef = useRef(0);
  const batchPhaseRef = useRef<'learn' | 'review'>('learn');
  const reviewIndexRef = useRef(0);

  const startWordCycle = useCallback(() => {
    if (wordTimerRef.current) clearInterval(wordTimerRef.current);

    const clampedSpeed = Math.min(speed, MAX_SPEED);
    // At speed 4 (default): 500ms per phase. At speed 12: ~165ms
    const phaseMs = 2000 / clampedSpeed;

    let phaseIndex = 0;
    // Learning sequence: spanish → both (quick pair, no example — keeps it fast)
    const learnPhases: DisplayPhase[] = ["spanish", "both"];
    // Review sequence: just spanish → both (faster recall test)
    const reviewPhases: DisplayPhase[] = ["spanish", "both"];

    wordTimerRef.current = setInterval(() => {
      const isReview = batchPhaseRef.current === 'review';
      const phases = isReview ? reviewPhases : learnPhases;
      const currentPhase = phases[phaseIndex % phases.length];
      setDisplayPhase(currentPhase);

      if (currentPhase === "spanish") {
        setWordsShown(prev => prev + 1);
      }

      phaseIndex++;
      if (phaseIndex % phases.length === 0) {
        if (isReview) {
          // Move through review batch
          reviewIndexRef.current++;
          const batchStart = batchRef.current * 10;
          const batchEnd = Math.min(batchStart + 10, words.length);
          if (reviewIndexRef.current >= (batchEnd - batchStart)) {
            // Review done — next batch
            batchRef.current++;
            batchPhaseRef.current = 'learn';
            reviewIndexRef.current = 0;
            const nextStart = batchRef.current * 10;
            if (nextStart >= words.length) {
              batchRef.current = 0; // loop back
            }
            setCurrentIndex(batchRef.current * 10);
          } else {
            setCurrentIndex(batchStart + reviewIndexRef.current);
          }
        } else {
          // Move to next word in learning batch
          const batchStart = batchRef.current * 10;
          const batchEnd = Math.min(batchStart + 10, words.length);
          setCurrentIndex(prev => {
            const next = prev + 1;
            if (next >= batchEnd) {
              // Batch complete — start review
              batchPhaseRef.current = 'review';
              reviewIndexRef.current = 0;
              phaseIndex = 0;
              return batchStart; // go back to start of batch for review
            }
            return next;
          });
        }
      }
    }, phaseMs);
  }, [speed, words.length]);

  // Pronounce current word
  useEffect(() => {
    if (phase === "running" && displayPhase === "spanish" && pronounceOn && words[currentIndex]) {
      speakSpanish(words[currentIndex].spanish);
    }
  }, [currentIndex, displayPhase, phase, pronounceOn, words]);

  const handleStart = () => {
    const selectedWords = getWordsByTiers(selectedTiers);
    // Shuffle
    const shuffled = [...selectedWords].sort(() => Math.random() - 0.5);
    setWords(shuffled);
    setCurrentIndex(0);
    setDisplayPhase("spanish");
    setTimeRemaining(MAX_SESSION_SECONDS);
    sessionElapsed.current = 0;
    setWordsShown(0);
    setSessionStartTime(Date.now());

    if (binauralOn) startBinauralBeats();
    setPhase("running");
    
    // Start word cycle after a tick
    setTimeout(() => startWordCycle(), 100);
  };

  // Restart word cycle when phase goes back to running
  useEffect(() => {
    if (phase === "running" && words.length > 0) {
      startWordCycle();
    }
    return () => { if (wordTimerRef.current) clearInterval(wordTimerRef.current); };
  }, [phase, startWordCycle, words.length]);

  const handleStop = () => {
    stopSession();
    setPhase("wellness");
  };

  const handleWellness = (rating: number) => {
    setWellnessRating(rating);
    const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
    addSession({
      date: new Date().toISOString(),
      wordsShown,
      quizScore: 0,
      quizTotal: 0,
      durationSeconds: elapsed,
      tier: selectedTiers[0] || 1,
      wellnessRating: rating,
    });

    // Store session words for quiz
    if (typeof window !== 'undefined') {
      const shownWords = words.slice(0, Math.min(currentIndex + 1, words.length));
      sessionStorage.setItem('nle-quiz-words', JSON.stringify(shownWords));
    }
    setPhase("complete");
  };

  const handleAcceptDisclaimer = () => {
    acceptDisclaimer();
    setPhase("setup");
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const currentWord = words[currentIndex];
  const progress = words.length > 0 ? ((currentIndex + 1) / words.length) * 100 : 0;

  // ── DISCLAIMER ──
  if (phase === "disclaimer") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="panel border-glow max-w-lg p-8 text-center">
          <div className="text-3xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-4">Safety Disclaimer</h2>
          <div className="text-sm text-[var(--nle-muted)] space-y-3 text-left mb-6">
            <p>NLE uses <strong className="text-white">Rapid Serial Visual Presentation (RSVP)</strong> which displays words quickly on screen.</p>
            <p><strong className="text-white">If you have photosensitive epilepsy or are prone to seizures</strong>, please consult a doctor before using this application.</p>
            <p>Safety features built in:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Maximum speed capped at 8 words/sec (well under seizure thresholds)</li>
              <li>No red or high-contrast flashing</li>
              <li>15-minute maximum sessions</li>
              <li>Mandatory breaks every 5 minutes</li>
              <li>Panic stop button (ESC key or STOP button)</li>
            </ul>
            <p>If you feel dizzy, nauseous, or uncomfortable at any time, <strong className="text-white">press ESC immediately</strong> to stop.</p>
          </div>
          <button onClick={handleAcceptDisclaimer} className="btn-primary w-full">
            I Understand — Continue
          </button>
          <a href="/safety" className="block mt-3 text-xs text-blue-400 hover:underline">
            Read full safety information →
          </a>
        </div>
      </div>
    );
  }

  // ── SETUP ──
  if (phase === "setup") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="panel border-glow max-w-md w-full p-8">
          <h2 className="text-2xl font-bold text-center glow-blue text-blue-400 mb-6">
            CONFIGURE ENCODING
          </h2>

          {/* Tier selection */}
          <div className="mb-6">
            <label className="text-sm text-[var(--nle-muted)] mb-2 block">Word Tiers</label>
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map(tier => (
                <button
                  key={tier}
                  onClick={() => {
                    setSelectedTiers(prev =>
                      prev.includes(tier) ? prev.filter(t => t !== tier) : [...prev, tier]
                    );
                  }}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                    selectedTiers.includes(tier)
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-[var(--nle-border)] text-[var(--nle-muted)] hover:border-blue-500/50'
                  }`}
                >
                  Tier {tier}
                  <span className="block text-xs opacity-60">
                    {tier === 1 ? "Top 50" : tier === 2 ? "51-100" : tier === 3 ? "101-150" : "151-200"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Speed */}
          <div className="mb-6">
            <label className="text-sm text-[var(--nle-muted)] mb-2 flex justify-between">
              <span>Speed</span>
              <span className="text-blue-400">{speed} words/sec</span>
            </label>
            <input
              type="range"
              min={1}
              max={MAX_SPEED}
              value={speed}
              onChange={e => setSpeed(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-[var(--nle-muted)] mt-1">
              <span>Slow</span>
              <span>Fast (max 12)</span>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3 mb-8">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Binaural Beats (6 Hz theta) <span className="text-xs text-[var(--nle-muted)]">🎧 headphones required</span></span>
              <button
                onClick={() => setBinauralOn(!binauralOn)}
                className={`w-12 h-6 rounded-full transition-colors ${binauralOn ? 'bg-blue-500' : 'bg-gray-600'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform mx-0.5 ${binauralOn ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Pronunciation</span>
              <button
                onClick={() => setPronounceOn(!pronounceOn)}
                className={`w-12 h-6 rounded-full transition-colors ${pronounceOn ? 'bg-blue-500' : 'bg-gray-600'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform mx-0.5 ${pronounceOn ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </label>
          </div>

          <button
            onClick={handleStart}
            disabled={selectedTiers.length === 0}
            className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ▶ BEGIN ENCODING
          </button>
          <p className="text-center text-xs text-[var(--nle-muted)] mt-3">
            Press ESC anytime to stop · 15 min max session
          </p>
        </div>
      </div>
    );
  }

  // ── MICROBREAK ──
  if (phase === "microbreak") {
    return (
      <div className="min-h-screen micro-break flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">🧠</div>
          <h2 className="text-2xl font-bold text-blue-300 mb-2">Micro-Break</h2>
          <p className="text-[var(--nle-muted)] mb-4">Rest your eyes. Take a breath.</p>
          <p className="text-4xl font-mono text-blue-400 glow-blue">{microbreakCountdown}</p>
          <p className="text-xs text-[var(--nle-muted)] mt-4">Resuming automatically...</p>
        </div>
      </div>
    );
  }

  // ── WELLNESS CHECK ──
  if (phase === "wellness") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="panel border-glow max-w-sm p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Session Complete</h2>
          <p className="text-[var(--nle-muted)] mb-6">How do you feel?</p>
          <div className="flex gap-3 justify-center mb-6">
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                onClick={() => handleWellness(n)}
                className="w-12 h-12 rounded-lg border border-[var(--nle-border)] text-lg hover:border-blue-500 hover:bg-blue-500/10 transition-all"
              >
                {n === 1 ? '😵' : n === 2 ? '😐' : n === 3 ? '🙂' : n === 4 ? '😊' : '🤩'}
              </button>
            ))}
          </div>
          <p className="text-xs text-[var(--nle-muted)]">1 = not great · 5 = amazing</p>
        </div>
      </div>
    );
  }

  // ── COMPLETE ──
  if (phase === "complete") {
    const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="panel border-glow max-w-sm p-8 text-center">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-green-400 glow-green mb-4">ENCODING COMPLETE</h2>
          <div className="space-y-2 text-sm text-[var(--nle-muted)] mb-6">
            <p>Words shown: <span className="text-white">{wordsShown}</span></p>
            <p>Time: <span className="text-white">{formatTime(elapsed)}</span></p>
            <p>Wellness: <span className="text-white">{['😵','😐','🙂','😊','🤩'][wellnessRating-1]}</span></p>
          </div>
          <div className="space-y-3">
            <button onClick={() => router.push('/quiz')} className="btn-primary w-full">
              Take Quiz →
            </button>
            <button onClick={() => setPhase('setup')} className="w-full py-2 text-sm text-[var(--nle-muted)] hover:text-white transition-colors">
              Start New Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── RUNNING (RSVP) ──
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Top bar */}
      <div className="fixed top-14 left-0 right-0 z-30 bg-[var(--nle-bg)]/90 backdrop-blur-sm border-b border-[var(--nle-border)]">
        {/* Progress bar */}
        <div className="h-1 bg-[var(--nle-border)]">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 relative progress-shine"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between px-4 py-2 text-xs">
          <div className="flex items-center gap-4">
            <span className="text-[var(--nle-muted)]">
              <span className="text-blue-400">{currentIndex + 1}</span>/{words.length}
            </span>
            <span className="text-[var(--nle-muted)]">
              Speed: <span className="text-blue-400">{speed}/s</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className={`font-mono ${timeRemaining < 60 ? 'text-orange-400' : 'text-green-400'}`}>
              {formatTime(timeRemaining)}
            </span>
            {/* STOP button */}
            <button
              onClick={handleStop}
              className="btn-danger text-xs px-3 py-1 rounded"
            >
              ■ STOP
            </button>
          </div>
        </div>
      </div>

      {/* RSVP Display */}
      <div className="flex-1 flex items-center justify-center pt-28 pb-20">
        {currentWord && (
          <div className="text-center px-4">
            {displayPhase === "spanish" && (
              <div>
                <p className="rsvp-word" style={{ color: POS_COLORS[currentWord.pos] }}>
                  {currentWord.spanish}
                </p>
                <p className="text-sm text-[var(--nle-muted)] mt-2 font-mono">
                  /{currentWord.phonetic}/
                </p>
              </div>
            )}
            {displayPhase === "english" && (
              <div>
                <p className="rsvp-word text-white/90">
                  {currentWord.english}
                </p>
                <p className="text-sm text-[var(--nle-muted)] mt-2">
                  {currentWord.pos}
                </p>
              </div>
            )}
            {displayPhase === "both" && (
              <div>
                <p className="rsvp-word" style={{ color: POS_COLORS[currentWord.pos] }}>
                  {currentWord.spanish}
                </p>
                <p className="text-2xl sm:text-3xl text-white/70 mt-3">
                  {currentWord.english}
                </p>
                <p className="text-sm text-[var(--nle-muted)] mt-2 font-mono">
                  /{currentWord.phonetic}/
                </p>
              </div>
            )}
            {displayPhase === "example" && (
              <p className="text-xl sm:text-2xl text-[var(--nle-muted)] italic max-w-lg">
                &ldquo;{currentWord.example}&rdquo;
              </p>
            )}
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-[var(--nle-bg)]/90 backdrop-blur-sm border-t border-[var(--nle-border)] px-4 py-3">
        <div className="flex items-center justify-center gap-6 text-xs text-[var(--nle-muted)]">
          <button
            onClick={() => { binauralOn ? stopBinauralBeats() : startBinauralBeats(); setBinauralOn(!binauralOn); }}
            className={`px-3 py-1 rounded border ${binauralOn ? 'border-purple-500 text-purple-400' : 'border-[var(--nle-border)]'}`}
          >
            {binauralOn ? '🎧 θ ON' : '🎧 θ OFF'}
          </button>
          <button
            onClick={() => setPronounceOn(!pronounceOn)}
            className={`px-3 py-1 rounded border ${pronounceOn ? 'border-green-500 text-green-400' : 'border-[var(--nle-border)]'}`}
          >
            {pronounceOn ? '🔊 ON' : '🔇 OFF'}
          </button>
          <span>Press <kbd className="px-1 bg-[var(--nle-surface)] rounded">ESC</kbd> to stop</span>
        </div>
      </div>
    </div>
  );
}
