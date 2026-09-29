import React from 'react';
import {
  LineChart,
  TrendingUp,
  Sparkles,
  Award,
  Clock,
  Flame,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  ChevronRight,
  BarChart3,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProgressAnalytics: React.FC = () => {
  const { profile, subjects, recentQuizzes, setCurrentView, setActiveTutorPrompt } = useApp();

  const overallProgress = Math.round(
    subjects.reduce((sum, s) => sum + s.progressPercent, 0) / subjects.length
  );

  const strongTopics = [
    { title: 'Graph Traversal & Binary Trees', subject: 'Computer Science', mastery: '95%' },
    { title: 'Limits & Differential Calculus', subject: 'Mathematics', mastery: '88%' },
    { title: 'Coordination Compounds', subject: 'Chemistry', mastery: '85%' },
  ];

  const weakTopics = [
    { title: 'Rotational Inertia of Composite Bodies', subject: 'Physics', mastery: '55%' },
    { title: 'Entropy in Irreversible Cycles', subject: 'Chemistry', mastery: '60%' },
    { title: 'Integration by Partial Fractions', subject: 'Mathematics', mastery: '68%' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/25">
            <LineChart className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Progress Analytics & Insights
              </h1>
              <span className="text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                Gemini Analytics
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Real-time diagnostic mastery metrics, study habit statistics, and active gap analysis.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setActiveTutorPrompt('Give me a detailed analysis of my strengths, weaknesses, and a 3-day recovery plan.');
            setCurrentView('tutor');
          }}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask Gemini for Full Diagnostic</span>
        </button>
      </div>

      {/* AI Generated Insight Card */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini Learning Insight of the Week</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              “Your performance in Chemistry has improved by 14% this week. Consider revising Organic Reaction Pathways next.”
            </h3>
            <p className="text-xs text-indigo-200 leading-relaxed">
              Based on your last 3 quizzes and flashcard recalls, your recall speed on coordination chemistry is at an all-time high. A quick 25-minute practice session on electrophilic additions will push your Chemistry mastery above 90%!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => {
                setActiveTutorPrompt('Explain Organic Reaction Pathways and give me 3 practice problems');
                setCurrentView('tutor');
              }}
              className="px-5 py-3 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <span>Revise with AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Overall Mastery</span>
          <div className="mt-2 text-3xl font-black text-indigo-600">{overallProgress}%</div>
          <p className="text-[11px] text-slate-400 mt-1">Across 4 curriculum subjects</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Quiz Accuracy</span>
          <div className="mt-2 text-3xl font-black text-emerald-600">{profile.quizAverage}%</div>
          <p className="text-[11px] text-slate-400 mt-1">Average on last {recentQuizzes.length} tests</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Study Hours</span>
          <div className="mt-2 text-3xl font-black text-violet-600">{profile.studyHoursThisMonth}h</div>
          <p className="text-[11px] text-slate-400 mt-1">Active time logged this month</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Learning Streak</span>
          <div className="mt-2 text-3xl font-black text-amber-500 flex items-center gap-1.5">
            <Flame className="w-6 h-6 fill-amber-500" />
            <span>{profile.streakDays} Days</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Consistency percentile: 94%</p>
        </div>
      </div>

      {/* Subject-Wise Mastery Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900">Subject-Wise Mastery Progression</h3>
            <p className="text-xs text-slate-500">Curriculum syllabus coverage and diagnostic confidence</p>
          </div>
          <span className="text-xs font-bold text-indigo-600">4 Subjects Active</span>
        </div>

        <div className="space-y-5">
          {subjects.map((sub) => (
            <div key={sub.id} className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black">{sub.name}</span>
                  <span className="text-slate-400 font-normal">
                    ({sub.topicsCompleted} of {sub.totalTopics} topics)
                  </span>
                </div>
                <span className="text-indigo-600 font-black text-sm">{sub.progressPercent}%</span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full bg-gradient-to-r ${sub.color} transition-all duration-700`}
                  style={{ width: `${sub.progressPercent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strong Topics vs Weak Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strong Topics */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base font-black text-slate-900">Strong Topics (High Mastery)</h3>
          </div>

          <div className="space-y-3">
            {strongTopics.map((st, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-emerald-950">{st.title}</h4>
                  <span className="text-[10px] font-semibold text-emerald-700">{st.subject}</span>
                </div>
                <span className="text-xs font-black text-emerald-700 bg-white px-2 py-1 rounded-lg shadow-2xs">
                  {st.mastery}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Topics */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-black text-slate-900">Priority Revision Gaps</h3>
          </div>

          <div className="space-y-3">
            {weakTopics.map((wt, i) => (
              <div
                key={i}
                onClick={() => {
                  setActiveTutorPrompt(`Please explain ${wt.title} and give me step-by-step practice problems`);
                  setCurrentView('tutor');
                }}
                className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/80 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {wt.title}
                  </h4>
                  <span className="text-[10px] font-semibold text-amber-700">{wt.subject}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-rose-600 bg-white px-2 py-1 rounded-lg shadow-2xs">
                    {wt.mastery}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
