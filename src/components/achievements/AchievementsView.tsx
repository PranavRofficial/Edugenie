import React from 'react';
import {
  Award,
  Flame,
  BookOpenCheck,
  Target,
  Rocket,
  Trophy,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AchievementsView: React.FC = () => {
  const { achievements, triggerConfetti } = useApp();

  const getBadgeIcon = (id: string) => {
    switch (id) {
      case 'ach_streak_7':
        return <Flame className="w-7 h-7 text-amber-500 fill-amber-500" />;
      case 'ach_topics_10':
        return <BookOpenCheck className="w-7 h-7 text-blue-500" />;
      case 'ach_quiz_master':
        return <Award className="w-7 h-7 text-violet-500" />;
      case 'ach_score_90':
        return <Target className="w-7 h-7 text-emerald-500" />;
      case 'ach_fast_learner':
        return <Rocket className="w-7 h-7 text-rose-500" />;
      case 'ach_streak_30':
        return <Trophy className="w-7 h-7 text-yellow-500" />;
      default:
        return <Award className="w-7 h-7 text-indigo-500" />;
    }
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/25">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Achievements & Badges
              </h1>
              <span className="text-[10px] font-bold uppercase bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                Gamification
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Celebrate your learning milestones, build study habits, and unlock exclusive rewards.
            </p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-black text-amber-900">
            {unlockedCount} / {achievements.length} Badges Unlocked
          </span>
        </div>
      </div>

      {/* Grid of Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((ach) => {
          const isUnlocked = ach.unlocked;
          const progressPercent = Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100));

          return (
            <div
              key={ach.id}
              onClick={() => {
                if (isUnlocked) triggerConfetti();
              }}
              className={`rounded-3xl p-6 border transition-all relative overflow-hidden flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-white border-amber-200 shadow-sm hover:shadow-md cursor-pointer group'
                  : 'bg-slate-50/80 border-slate-200 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform ${
                      isUnlocked
                        ? 'bg-amber-50 shadow-inner group-hover:scale-110'
                        : 'bg-slate-200'
                    }`}
                  >
                    {getBadgeIcon(ach.id)}
                  </div>

                  {isUnlocked ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <Unlock className="w-3 h-3" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase text-slate-500 bg-slate-200 px-2.5 py-1 rounded-full">
                      <Lock className="w-3 h-3" />
                      <span>Locked</span>
                    </span>
                  )}
                </div>

                <h3 className="text-base font-black text-slate-900 mb-1.5">{ach.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{ach.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold text-slate-500">
                  <span>Progress</span>
                  <span className={isUnlocked ? 'text-amber-600 font-black' : 'text-slate-600'}>
                    {ach.progress} / {ach.maxProgress}
                  </span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isUnlocked ? 'bg-amber-500' : 'bg-slate-400'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {isUnlocked && ach.unlockedAt && (
                  <span className="text-[10px] text-slate-400 block pt-1">
                    Unlocked: {ach.unlockedAt}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
