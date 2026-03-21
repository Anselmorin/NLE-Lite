export interface SessionResult {
  date: string;
  wordsShown: number;
  quizScore: number;
  quizTotal: number;
  durationSeconds: number;
  tier: number;
  wellnessRating: number;
}

export interface Progress {
  sessions: SessionResult[];
  learnedWordIds: number[]; // words with >80% quiz score
  totalStudyTimeSeconds: number;
  currentStreak: number;
  lastSessionDate: string | null;
  disclaimerAccepted: boolean;
}

const STORAGE_KEY = 'nle-progress';

const defaultProgress: Progress = {
  sessions: [],
  learnedWordIds: [],
  totalStudyTimeSeconds: 0,
  currentStreak: 0,
  lastSessionDate: null,
  disclaimerAccepted: false,
};

export function getProgress(): Progress {
  if (typeof window === 'undefined') return defaultProgress;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;
    return { ...defaultProgress, ...JSON.parse(raw) };
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: Progress) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function addSession(result: SessionResult) {
  const progress = getProgress();
  progress.sessions.push(result);
  progress.totalStudyTimeSeconds += result.durationSeconds;
  
  // Update streak
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (progress.lastSessionDate === yesterday || progress.lastSessionDate === today) {
    if (progress.lastSessionDate !== today) progress.currentStreak++;
  } else {
    progress.currentStreak = 1;
  }
  progress.lastSessionDate = today;

  // Update learned words (>80% on quiz)
  if (result.quizTotal > 0 && result.quizScore / result.quizTotal >= 0.8) {
    // Mark words as learned (simplified - just track count based on tier words)
  }

  saveProgress(progress);
  return progress;
}

export function acceptDisclaimer() {
  const progress = getProgress();
  progress.disclaimerAccepted = true;
  saveProgress(progress);
}

export function markWordsLearned(wordIds: number[]) {
  const progress = getProgress();
  const set = new Set(progress.learnedWordIds);
  wordIds.forEach(id => set.add(id));
  progress.learnedWordIds = Array.from(set);
  saveProgress(progress);
  return progress;
}

// ── SPACED REPETITION (SM-2) ──

export interface WordScore {
  wordId: number;
  correct: number;
  incorrect: number;
  streak: number;
  lastSeen: number;
  nextReview: number;
  ease: number;
  interval: number; // current interval in ms
}

const WORD_SCORES_KEY = 'nle-word-scores';
const DAY_MS = 24 * 60 * 60 * 1000;

function getAllWordScores(): Record<number, WordScore> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(WORD_SCORES_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveAllWordScores(scores: Record<number, WordScore>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(WORD_SCORES_KEY, JSON.stringify(scores));
}

export function getWordScore(wordId: number): WordScore {
  const scores = getAllWordScores();
  return scores[wordId] || {
    wordId,
    correct: 0,
    incorrect: 0,
    streak: 0,
    lastSeen: 0,
    nextReview: 0,
    ease: 2.5,
    interval: DAY_MS,
  };
}

export function updateWordScore(wordId: number, correct: boolean): void {
  const scores = getAllWordScores();
  const s = scores[wordId] || {
    wordId,
    correct: 0,
    incorrect: 0,
    streak: 0,
    lastSeen: 0,
    nextReview: 0,
    ease: 2.5,
    interval: DAY_MS,
  };

  const now = Date.now();
  s.lastSeen = now;

  if (correct) {
    s.correct++;
    s.streak++;
    s.ease = Math.min(3.0, s.ease + 0.1);
    s.interval = s.streak === 1 ? DAY_MS : s.interval * s.ease;
    s.nextReview = now + s.interval;
  } else {
    s.incorrect++;
    s.streak = 0;
    s.ease = Math.max(1.3, s.ease - 0.2);
    s.interval = DAY_MS;
    s.nextReview = now + DAY_MS;
  }

  scores[wordId] = s;
  saveAllWordScores(scores);
}

import { vocabulary, Word, getWordsByCategories } from '@/lib/vocabulary';

export function getWordsForReview(categoryIds?: string[]): Word[] {
  const scores = getAllWordScores();
  const now = Date.now();
  const pool = categoryIds ? getWordsByCategories(categoryIds) : vocabulary;

  return pool
    .filter(w => {
      const s = scores[w.id];
      return s && s.lastSeen > 0 && s.nextReview <= now;
    })
    .sort((a, b) => {
      const sa = scores[a.id];
      const sb = scores[b.id];
      return (sa.nextReview - now) - (sb.nextReview - now); // most overdue first
    });
}

export function getWeakWords(limit: number = 20): Word[] {
  const scores = getAllWordScores();
  return vocabulary
    .filter(w => scores[w.id] && scores[w.id].lastSeen > 0)
    .sort((a, b) => {
      const sa = scores[a.id];
      const sb = scores[b.id];
      // Sort by ease ascending, then incorrect descending
      if (sa.ease !== sb.ease) return sa.ease - sb.ease;
      return sb.incorrect - sa.incorrect;
    })
    .slice(0, limit);
}

export function getWordStats(): { total: number; mastered: number; learning: number; new: number } {
  const scores = getAllWordScores();
  let mastered = 0;
  let learning = 0;

  for (const w of vocabulary) {
    const s = scores[w.id];
    if (!s || s.lastSeen === 0) continue;
    if (s.ease > 2.5 && s.streak > 3) {
      mastered++;
    } else {
      learning++;
    }
  }

  return {
    total: vocabulary.length,
    mastered,
    learning,
    new: vocabulary.length - mastered - learning,
  };
}

export function getNextReviewTime(): number | null {
  const scores = getAllWordScores();
  const now = Date.now();
  let earliest: number | null = null;

  for (const w of vocabulary) {
    const s = scores[w.id];
    if (!s || s.lastSeen === 0) continue;
    if (s.nextReview > now) {
      if (earliest === null || s.nextReview < earliest) {
        earliest = s.nextReview;
      }
    }
  }
  return earliest;
}

export type WordStatus = 'new' | 'review' | 'weak';

export function getWordStatus(wordId: number): WordStatus {
  const scores = getAllWordScores();
  const s = scores[wordId];
  if (!s || s.lastSeen === 0) return 'new';
  const now = Date.now();
  if (s.ease < 2.0 || s.incorrect > s.correct) return 'weak';
  if (s.nextReview <= now) return 'review';
  return 'review'; // seen before = reviewing
}
