"use client";

import { useEffect, useState } from "react";
import { getProgress, Progress } from "@/lib/storage";
import Link from "next/link";

export default function DashboardPage() {
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  if (!progress) return <div className="min-h-screen flex items-center justify-center text-[var(--nle-muted)]">Loading...</div>;

  const totalMinutes = Math.round(progress.totalStudyTimeSeconds / 60);
  const avgScore = progress.sessions.length > 0
    ? Math.round(progress.sessions.filter(s => s.quizTotal > 0).reduce((a, s) => a + (s.quizScore / s.quizTotal) * 100, 0) / Math.max(1, progress.sessions.filter(s => s.quizTotal > 0).length))
    : 0;
  const wordsPerMin = progress.totalStudyTimeSeconds > 0
    ? Math.round((progress.learnedWordIds.length / progress.totalStudyTimeSeconds) * 60)
    : 0;

  const recentSessions = [...progress.sessions].reverse().slice(0, 10);

  return (
    <div className="min-h-screen px-4 py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold glow-blue text-blue-400 mb-2">DASHBOARD</h1>
      <p className="text-[var(--nle-muted)] text-sm mb-8">Neural encoding progress tracker</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="panel border-glow p-5 text-center">
          <p className="text-3xl font-black text-blue-400">{progress.learnedWordIds.length}</p>
          <p className="text-xs text-[var(--nle-muted)] mt-1">Words Learned</p>
        </div>
        <div className="panel border-glow p-5 text-center">
          <p className="text-3xl font-black text-green-400">{progress.sessions.length}</p>
          <p className="text-xs text-[var(--nle-muted)] mt-1">Sessions</p>
        </div>
        <div className="panel border-glow p-5 text-center">
          <p className="text-3xl font-black text-purple-400">{totalMinutes}<span className="text-lg">m</span></p>
          <p className="text-xs text-[var(--nle-muted)] mt-1">Study Time</p>
        </div>
        <div className="panel border-glow p-5 text-center">
          <p className="text-3xl font-black text-cyan-400">{progress.currentStreak}🔥</p>
          <p className="text-xs text-[var(--nle-muted)] mt-1">Day Streak</p>
        </div>
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="panel p-4">
          <p className="text-sm text-[var(--nle-muted)]">Avg Quiz Score</p>
          <p className="text-2xl font-bold text-white">{avgScore}%</p>
        </div>
        <div className="panel p-4">
          <p className="text-sm text-[var(--nle-muted)]">Learning Speed</p>
          <p className="text-2xl font-bold text-white">{wordsPerMin} <span className="text-sm text-[var(--nle-muted)]">words/min</span></p>
        </div>
      </div>

      {/* Word progress bar */}
      <div className="panel p-5 mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-[var(--nle-muted)]">Vocabulary Progress</span>
          <span className="text-blue-400">{progress.learnedWordIds.length}/200</span>
        </div>
        <div className="h-3 bg-[var(--nle-border)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full relative progress-shine"
            style={{ width: `${(progress.learnedWordIds.length / 200) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-[var(--nle-muted)]">
          <span>Tier 1</span><span>Tier 2</span><span>Tier 3</span><span>Tier 4</span>
        </div>
      </div>

      {/* Recent sessions */}
      <div className="panel p-5">
        <h3 className="text-sm font-bold text-white mb-4">Recent Sessions</h3>
        {recentSessions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[var(--nle-muted)] mb-4">No sessions yet</p>
            <Link href="/learn" className="btn-primary text-sm px-6 py-2">Start First Session</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {recentSessions.map((s, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--nle-border)] last:border-0 text-sm">
                <div>
                  <p className="text-white">{new Date(s.date).toLocaleDateString()}</p>
                  <p className="text-xs text-[var(--nle-muted)]">{s.wordsShown} words · Tier {s.tier}</p>
                </div>
                <div className="text-right">
                  {s.quizTotal > 0 ? (
                    <p className={s.quizScore / s.quizTotal >= 0.8 ? 'text-green-400' : 'text-orange-400'}>
                      {Math.round((s.quizScore / s.quizTotal) * 100)}%
                    </p>
                  ) : (
                    <p className="text-[var(--nle-muted)]">No quiz</p>
                  )}
                  <p className="text-xs text-[var(--nle-muted)]">{Math.floor(s.durationSeconds / 60)}m {s.durationSeconds % 60}s</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
