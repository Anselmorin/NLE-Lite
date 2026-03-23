"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { categories, getWordsByCategories, Word } from "@/lib/vocabulary";
import { startBinauralBeats, stopBinauralBeats, speakSpanish } from "@/lib/audio";

const SPANISH_EMOJI: Record<string, string> = {
  perro: '🐕', gato: '🐱', pollo: '🐔', pescado: '🐟',
  sol: '☀️', luna: '🌙', estrella: '⭐', nube: '☁️',
  agua: '💧', café: '☕', leche: '🥛', manzana: '🍎',
  pan: '🍞', arroz: '🍚', huevo: '🥚', queso: '🧀', helado: '🍦',
  padre: '👨', madre: '👩', hermano: '👦', hermana: '👧', bebé: '👶',
  casa: '🏠', mesa: '🪑', cama: '🛏️', puerta: '🚪',
  camisa: '👔', zapato: '👟', sombrero: '🎩', vestido: '👗',
  rojo: '🔴', azul: '🔵', verde: '🟢', amarillo: '🟡',
  cabeza: '🗣️', mano: '✋', corazón: '❤️', ojo: '👁️',
  libro: '📖', lápiz: '✏️', escuela: '🏫', música: '🎵',
  carro: '🚗', teléfono: '📱', dinero: '💰', llave: '🔑',
  dormir: '😴', comer: '🍽️', correr: '🏃', bailar: '💃', nadar: '🏊',
  árbol: '🌳', flor: '🌺', playa: '🏖️', mar: '🌊', montaña: '⛰️',
  carne: '🥩', hamburguesa: '🍔', cerveza: '🍺', jugo: '🧃',
  hijo: '👦', hija: '👧', familia: '👨‍👩‍👧', amigo: '🤝',
  cocina: '🍳', jardín: '🌻', ventana: '🪟', silla: '🪑',
  pantalón: '👖', chaqueta: '🧥', ropa: '👚',
};

type Phase = "pick" | "ready" | "encoding" | "quiz" | "results";

export default function DemoPage() {
  const [phase, setPhase] = useState<Phase>("pick");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [demoWords, setDemoWords] = useState<Word[]>([]);
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [displayState, setDisplayState] = useState<"spanish" | "english" | "both">("spanish");
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [quizAnswered, setQuizAnswered] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const allWordsRef = useRef<Word[]>([]);

  // Pick 5 random words from category
  const selectCategory = (catId: string) => {
    setSelectedCategory(catId);
    const words = getWordsByCategories([catId]);
    allWordsRef.current = words;
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setDemoWords(shuffled.slice(0, 5));
    setPhase("ready");
  };

  // Countdown then start encoding
  const startEncoding = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setPhase("encoding");
          setCurrentWordIdx(0);
          setDisplayState("spanish");
          startBinauralBeats();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Encoding sequence: spanish (1.5s) → english (1s) → both (0.5s) → next
  useEffect(() => {
    if (phase !== "encoding") return;
    if (currentWordIdx >= demoWords.length) {
      stopBinauralBeats();
      startQuiz();
      return;
    }

    const word = demoWords[currentWordIdx];

    // Speak the spanish word
    if (displayState === "spanish") {
      speakSpanish(word.spanish);
    }

    const durations: Record<string, number> = {
      spanish: 1500,
      english: 1000,
      both: 800,
    };

    timerRef.current = setTimeout(() => {
      if (displayState === "spanish") setDisplayState("english");
      else if (displayState === "english") setDisplayState("both");
      else {
        setCurrentWordIdx(prev => prev + 1);
        setDisplayState("spanish");
      }
    }, durations[displayState]);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [phase, currentWordIdx, displayState, demoWords]);

  // Generate quiz
  const startQuiz = () => {
    setQuizIdx(0);
    setScore(0);
    setQuizAnswered(null);
    generateOptions(0);
    setPhase("quiz");
  };

  const generateOptions = (idx: number) => {
    const correct = demoWords[idx].english;
    // Get 3 wrong answers from the full category word list
    const wrongs = allWordsRef.current
      .filter(w => w.english !== correct)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.english);
    const opts = [...wrongs, correct].sort(() => Math.random() - 0.5);
    setQuizOptions(opts);
  };

  const answerQuiz = (answer: string) => {
    if (quizAnswered !== null) return;
    const correct = answer === demoWords[quizIdx].english;
    if (correct) setScore(prev => prev + 1);
    setQuizAnswered(correct);

    setTimeout(() => {
      const next = quizIdx + 1;
      if (next >= demoWords.length) {
        setPhase("results");
      } else {
        setQuizIdx(next);
        setQuizAnswered(null);
        generateOptions(next);
      }
    }, 1200);
  };

  const restart = () => {
    setPhase("pick");
    setSelectedCategory(null);
    setDemoWords([]);
    setCurrentWordIdx(0);
    setScore(0);
    setQuizIdx(0);
    setQuizAnswered(null);
  };

  // Best categories for demo (ones with strong emoji/visual words)
  const demoCats = categories.filter(c =>
    ["food", "family", "nature", "colors", "body", "house", "clothes", "actions"].includes(c.id)
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* PHASE: Pick Category */}
      {phase === "pick" && (
        <div className="text-center relative z-10 max-w-xl">
          <img src="/nle-logo.png" alt="NLE" className="h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Quick Demo</h1>
          <p className="text-sm text-[var(--nle-muted)] mb-8">
            Pick a category. We&apos;ll encode 5 words, then quiz you.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {demoCats.map(cat => (
              <button
                key={cat.id}
                onClick={() => selectCategory(cat.id)}
                className="panel p-4 text-left hover:border-blue-500/40 transition-all cursor-pointer group"
              >
                <span className="text-2xl">{cat.emoji}</span>
                <p className="text-white font-medium mt-2 group-hover:text-blue-400 transition-colors">{cat.name}</p>
              </button>
            ))}
          </div>
          <p className="text-xs text-[var(--nle-muted)] mt-6">Takes under 60 seconds</p>
        </div>
      )}

      {/* PHASE: Ready / Countdown */}
      {phase === "ready" && (
        <div className="text-center relative z-10">
          <p className="text-sm text-[var(--nle-muted)] mb-4 tracking-widest uppercase">
            {categories.find(c => c.id === selectedCategory)?.emoji}{" "}
            {categories.find(c => c.id === selectedCategory)?.name}
          </p>
          <h2 className="text-xl font-semibold text-white mb-2">5 words. Watch closely.</h2>
          <p className="text-sm text-[var(--nle-muted)] mb-8">
            You&apos;ll see each word in Spanish, then English, then both together.
            <br />Use headphones for binaural beats.
          </p>
          <button
            onClick={startEncoding}
            className="btn-primary text-lg px-10 py-4 pulse-glow rounded-lg font-bold tracking-wider"
          >
            ▶ START
          </button>
        </div>
      )}

      {/* Countdown overlay */}
      {phase === "ready" && countdown < 3 && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <span className="text-8xl font-bold text-blue-400 animate-pulse">{countdown}</span>
        </div>
      )}

      {/* PHASE: Encoding */}
      {phase === "encoding" && currentWordIdx < demoWords.length && (
        <div className="fixed inset-0 bg-[#0a0a0f] flex items-center justify-center z-50">
          {/* Giant faint peripheral emoji */}
          {SPANISH_EMOJI[demoWords[currentWordIdx].spanish] && (
            <div className="absolute text-[240px] opacity-10 blur-[3px] select-none pointer-events-none transition-all duration-500">
              {SPANISH_EMOJI[demoWords[currentWordIdx].spanish]}
            </div>
          )}

          {/* Progress dots — top */}
          <div className="absolute top-8 flex gap-3 justify-center">
            {demoWords.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${
                  i < currentWordIdx ? "bg-green-400" :
                  i === currentWordIdx ? "bg-blue-400 scale-125" :
                  "bg-white/20"
                }`}
              />
            ))}
          </div>

          {/* Single word display */}
          <div className="relative z-10 text-center">
            {displayState === "spanish" && (
              <p className="text-6xl font-bold text-blue-400">{demoWords[currentWordIdx].spanish}</p>
            )}
            {displayState === "english" && (
              <p className="text-6xl font-bold text-green-400">{demoWords[currentWordIdx].english}</p>
            )}
            {displayState === "both" && (
              <p className="text-5xl font-bold text-purple-400">{demoWords[currentWordIdx].english}</p>
            )}
          </div>

          {/* Word counter — bottom */}
          <p className="absolute bottom-8 text-xs text-[var(--nle-muted)]">
            {currentWordIdx + 1} / {demoWords.length}
          </p>
        </div>
      )}

      {/* PHASE: Quiz */}
      {phase === "quiz" && (
        <div className="text-center relative z-10 max-w-md w-full">
          {/* Progress dots */}
          <div className="flex gap-3 justify-center mb-6">
            {demoWords.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < quizIdx ? "bg-green-400" :
                  i === quizIdx ? "bg-yellow-400 scale-125" :
                  "bg-white/20"
                }`}
              />
            ))}
          </div>

          <p className="text-sm text-[var(--nle-muted)] mb-2 tracking-widest uppercase">What does this mean?</p>
          <p className="text-4xl font-bold text-blue-400 mb-8">{demoWords[quizIdx].spanish}</p>

          <div className="grid grid-cols-2 gap-3">
            {quizOptions.map((opt, i) => {
              let style = "panel p-4 text-center cursor-pointer hover:border-blue-500/40 transition-all";
              if (quizAnswered !== null) {
                if (opt === demoWords[quizIdx].english) {
                  style = "panel p-4 text-center border-green-500/60 bg-green-500/10";
                } else if (quizAnswered === false) {
                  style = "panel p-4 text-center opacity-40";
                }
              }
              return (
                <button
                  key={i}
                  onClick={() => answerQuiz(opt)}
                  className={style}
                  disabled={quizAnswered !== null}
                >
                  <span className="text-white font-medium">{opt}</span>
                </button>
              );
            })}
          </div>

          <p className="text-xs text-[var(--nle-muted)] mt-6">{quizIdx + 1} / {demoWords.length}</p>
        </div>
      )}

      {/* PHASE: Results */}
      {phase === "results" && (
        <div className="text-center relative z-10 max-w-md">
          <div className="text-6xl mb-4">
            {score === 5 ? "🧠" : score >= 3 ? "⚡" : "🔄"}
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {score} / 5
          </h2>
          <p className="text-lg text-[var(--nle-muted)] mb-2">
            {score === 5 ? "Perfect. Full retention." :
             score >= 4 ? "Almost perfect. Strong encoding." :
             score >= 3 ? "Good recall. One more pass would lock it in." :
             "Try again — repetition strengthens the pathways."}
          </p>
          <p className="text-xs text-[var(--nle-muted)] mb-8">
            {score >= 3 ? "That was ~15 seconds of encoding." : "Neural pathways need repetition to solidify."}
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={restart}
              className="btn-primary px-6 py-3 rounded-lg font-bold tracking-wider"
            >
              TRY ANOTHER
            </button>
            <a
              href="/learn"
              className="panel px-6 py-3 rounded-lg font-bold tracking-wider text-white hover:border-blue-500/40 transition-all inline-block"
            >
              FULL SESSION →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
