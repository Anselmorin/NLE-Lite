"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Word, vocabulary, POS_COLORS } from "@/lib/vocabulary";
import { addSession, getProgress, markWordsLearned } from "@/lib/storage";

interface QuizQuestion {
  word: Word;
  options: string[];
  correctIndex: number;
}

function generateQuiz(words: Word[], count: number = 10): QuizQuestion[] {
  const shuffled = [...words].sort(() => Math.random() - 0.5).slice(0, count);
  return shuffled.map(word => {
    // Get 3 wrong answers from vocabulary
    const wrong = vocabulary
      .filter(w => w.id !== word.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.english);
    
    const options = [...wrong, word.english].sort(() => Math.random() - 0.5);
    return {
      word,
      options,
      correctIndex: options.indexOf(word.english),
    };
  });
}

export default function QuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [complete, setComplete] = useState(false);
  const [startTime] = useState(Date.now());
  const [correctWordIds, setCorrectWordIds] = useState<number[]>([]);

  useEffect(() => {
    // Get words from session or default to tier 1
    let quizWords: Word[];
    try {
      const stored = sessionStorage.getItem('nle-quiz-words');
      if (stored) {
        quizWords = JSON.parse(stored);
      } else {
        quizWords = vocabulary.filter(w => w.tier === 1);
      }
    } catch {
      quizWords = vocabulary.filter(w => w.tier === 1);
    }
    
    setQuestions(generateQuiz(quizWords, Math.min(10, quizWords.length)));
  }, []);

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);
    
    if (index === questions[currentQ].correctIndex) {
      setScore(s => s + 1);
      setCorrectWordIds(prev => [...prev, questions[currentQ].word.id]);
    }
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= questions.length) {
      // Quiz complete
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      
      // Mark words as learned if score > 80%
      if (score / questions.length >= 0.8) {
        markWordsLearned(correctWordIds);
      }
      
      // Update last session with quiz results
      const progress = getProgress();
      if (progress.sessions.length > 0) {
        const last = progress.sessions[progress.sessions.length - 1];
        last.quizScore = score + (selected === questions[currentQ]?.correctIndex ? 1 : 0);
        last.quizTotal = questions.length;
      }
      
      setComplete(true);
      return;
    }
    
    setCurrentQ(q => q + 1);
    setSelected(null);
    setShowResult(false);
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--nle-muted)]">Loading quiz...</p>
      </div>
    );
  }

  if (complete) {
    const finalScore = score;
    const pct = Math.round((finalScore / questions.length) * 100);
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const wordsPerMin = elapsed > 0 ? Math.round((finalScore / elapsed) * 60) : 0;

    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="panel border-glow max-w-md w-full p-8 text-center">
          <div className="text-5xl mb-4">{pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '💪'}</div>
          <h2 className="text-2xl font-bold text-white mb-2">Quiz Results</h2>
          
          <div className="text-6xl font-black my-6">
            <span className={pct >= 80 ? 'text-green-400 glow-green' : pct >= 60 ? 'text-yellow-400' : 'text-orange-400'}>
              {pct}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
            <div className="panel p-3">
              <p className="text-[var(--nle-muted)]">Score</p>
              <p className="text-lg font-bold text-white">{finalScore}/{questions.length}</p>
            </div>
            <div className="panel p-3">
              <p className="text-[var(--nle-muted)]">Time</p>
              <p className="text-lg font-bold text-white">{Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, '0')}</p>
            </div>
            <div className="panel p-3">
              <p className="text-[var(--nle-muted)]">Words/min</p>
              <p className="text-lg font-bold text-blue-400">{wordsPerMin}</p>
            </div>
            <div className="panel p-3">
              <p className="text-[var(--nle-muted)]">Retained</p>
              <p className="text-lg font-bold text-green-400">{finalScore} words</p>
            </div>
          </div>

          {pct >= 80 && (
            <p className="text-sm text-green-400 mb-4">
              ✨ Words marked as learned! Great encoding!
            </p>
          )}

          <div className="space-y-3">
            <button onClick={() => router.push('/learn')} className="btn-primary w-full">
              Encode More Words
            </button>
            <button onClick={() => router.push('/dashboard')} className="w-full py-2 text-sm text-[var(--nle-muted)] hover:text-white">
              View Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Progress */}
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between text-xs text-[var(--nle-muted)] mb-2">
          <span>Question {currentQ + 1}/{questions.length}</span>
          <span>Score: {score}/{currentQ + (showResult ? 1 : 0)}</span>
        </div>
        <div className="h-1 bg-[var(--nle-border)] rounded-full">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="panel border-glow max-w-md w-full p-8">
        {/* Word */}
        <div className="text-center mb-8">
          <p className="text-xs text-[var(--nle-muted)] mb-2 uppercase tracking-wider">{q.word.pos}</p>
          <p className="text-4xl font-bold" style={{ color: POS_COLORS[q.word.pos] }}>
            {q.word.spanish}
          </p>
          <p className="text-sm text-[var(--nle-muted)] mt-1 font-mono">/{q.word.phonetic}/</p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {q.options.map((opt, i) => {
            let style = "border-[var(--nle-border)] hover:border-blue-500/50";
            if (showResult) {
              if (i === q.correctIndex) style = "border-green-500 bg-green-500/10 text-green-400";
              else if (i === selected) style = "border-orange-500 bg-orange-500/10 text-orange-400";
            } else if (i === selected) {
              style = "border-blue-500 bg-blue-500/10";
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className={`w-full p-4 rounded-lg border text-left transition-all ${style}`}
              >
                <span className="text-xs text-[var(--nle-muted)] mr-2">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className="mt-6">
            <p className="text-sm text-[var(--nle-muted)] italic mb-4">
              &ldquo;{q.word.example}&rdquo;
            </p>
            <button onClick={nextQuestion} className="btn-primary w-full">
              {currentQ + 1 >= questions.length ? 'See Results' : 'Next →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
