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
