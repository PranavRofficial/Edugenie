import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  Clock,
  BookOpen,
  Award,
  ArrowRight,
  CheckCircle2,
  Circle,
  HelpCircle,
  Search,
  Zap,
  TrendingUp,
  BrainCircuit,
  FileText,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DashboardHome: React.FC = () => {
  const {
    profile,
    subjects,
    recentQuizzes,
    studyTasks,
    toggleTaskCompleted,
    setCurrentView,
    setActiveTutorPrompt,
    updateSubjectProgress,
  } = useApp();

  const [askInput, setAskInput] = useState('');

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!askInput.trim()) return;
    setActiveTutorPrompt(askInput.trim());
    setCurrentView('tutor');
  };

  const handleQuickQuestion = (q: string) => {
    setActiveTutorPrompt(q);
    setCurrentView('tutor');
  };

  const recommendedTopics = [
    { title: 'Photosynthesis & Calvin Cycle', subject: 'Biology / Chem', time: '15 min' },
    { title: 'Rotational Torque & Angular Momentum', subject: 'Physics', time: '20 min' },
    { title: 'Integration by Partial Fractions', subject: 'Mathematics', time: '25 min' },
    { title: 'Dijkstra Shortest Path Algorithm', subject: 'Computer Science', time: '15 min' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* 1. Greeting & Hero Ask Box */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white p-6 sm:p-8 shadow-xl overflow-hidden">
        {/* Glow circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl -z-0 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-violet-500/20 rounded-full blur-2xl -z-0 pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Google Gemini Learning Engine Active</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            Good Morning, {profile.name} 👋
          </h1>
          <p className="mt-2 text-sm sm:text-base text-indigo-100">
            What would you like to learn today? Ask EDUGENIE for explanations, practice problems, or instant summaries.
          </p>

          {/* AI Search / Ask Box */}
          <form onSubmit={handleAskSubmit} className="mt-6 relative">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={askInput}
                onChange={(e) => setAskInput(e.target.value)}
                placeholder="Ask EDUGENIE: 'Explain photosynthesis in simple terms' or 'Derive work-energy theorem'..."
                className="w-full pl-12 pr-32 py-4 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-sm font-medium shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-400/30 transition-all"
              />
              <button
                type="submit"
                className="absolute right-2.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask Gemini</span>
              </button>
            </div>
          </form>

          {/* Prompt chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-indigo-200 font-semibold text-[11px]">Quick Try:</span>
            {[
              'Explain photosynthesis simply',
              'What is Newton’s First Law?',
              'How does binary search work?',
              'Explain Le Chatelier’s principle',
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => handleQuickQuestion(chip)}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium border border-white/10 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Four Attractive Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Topics Completed */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Topics Completed
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{profile.topicsCompleted}</span>
            <span className="text-xs font-bold text-emerald-600">+4 this week</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-blue-600 h-1.5 rounded-full w-4/5" />
          </div>
        </div>

        {/* Quiz Average */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Quiz Average
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{profile.quizAverage}%</span>
            <span className="text-xs font-bold text-emerald-600">Top 10%</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full"
              style={{ width: `${profile.quizAverage}%` }}
            />
          </div>
        </div>

        {/* Study Time */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Study Time
            </span>
            <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{profile.studyHoursThisMonth}h</span>
            <span className="text-xs font-medium text-slate-500">this month</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-violet-600 h-1.5 rounded-full w-3/4" />
          </div>
        </div>

        {/* Learning Streak */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Learning Streak
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{profile.streakDays} Days</span>
            <span className="text-xs font-bold text-amber-600">On Fire 🔥</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-amber-500 h-1.5 rounded-full w-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* 3. Daily Learning Goal Progress Indicator */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 rounded-2xl p-5 border border-indigo-100/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Daily Focus Target: {profile.dailyMinutesCompleted} / {profile.dailyGoalMinutes} Minutes
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              You are only 25 minutes away from locking in today's 8th consecutive streak day!
            </p>
          </div>
        </div>

        <div className="w-full md:w-64 space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span>Daily Completion</span>
            <span className="text-indigo-600">
              {Math.round((profile.dailyMinutesCompleted / profile.dailyGoalMinutes) * 100)}%
            </span>
          </div>
          <div className="w-full bg-indigo-200/60 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(
                  100,
                  (profile.dailyMinutesCompleted / profile.dailyGoalMinutes) * 100
                )}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* 4. Continue Learning & Upcoming Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Continue Learning & My Subjects */}
        <div className="lg:col-span-2 space-y-6">
          {/* Continue Learning Spotlight */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-indigo-600" />
                <span>Continue Learning</span>
              </h2>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                Last Studied: Today
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  Mathematics • Grade 12
                </span>
                <h3 className="text-xl font-black">Integration & Definite Integrals</h3>
                <p className="text-xs text-slate-300 max-w-md">
                  Practice applying substitution methods and area under curves. 4 of 6 lesson modules completed.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-xs font-bold text-white bg-white/10 px-2.5 py-1 rounded-md">
                    Progress: 78%
                  </span>
                  <span className="text-xs text-indigo-200">14 of 18 Topics Done</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveTutorPrompt('Explain Definite Integrals by Substitution step-by-step with examples');
                  setCurrentView('tutor');
                }}
                className="px-5 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all shrink-0"
              >
                <span>Resume Lesson</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* My Subjects Grid */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">My Subjects</h2>
                <p className="text-xs text-slate-500">Track your syllabus mastery in real-time</p>
              </div>
              <button
                onClick={() => setCurrentView('subjects')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subjects.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all bg-slate-50/50 hover:bg-white flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-slate-900">{sub.name}</h4>
                      <span className="text-xs font-black text-indigo-600">
                        {sub.progressPercent}%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mb-3">
                      Current: {sub.currentTopic}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${sub.color}`}
                        style={{ width: `${sub.progressPercent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                      <span>{sub.topicsCompleted} of {sub.totalTopics} Topics</span>
                      <button
                        onClick={() => {
                          setActiveTutorPrompt(`Give me a lesson on ${sub.currentTopic} in ${sub.name}`);
                          setCurrentView('tutor');
                        }}
                        className="font-bold text-indigo-600 hover:underline"
                      >
                        Study →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Topics */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>AI Recommended Next Steps</span>
              </h2>
              <span className="text-[11px] text-slate-400">Personalized by Gemini</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recommendedTopics.map((rec, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setActiveTutorPrompt(`Explain ${rec.title} in simple terms with practice problems`);
                    setCurrentView('tutor');
                  }}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase">
                      {rec.subject}
                    </span>
                    <h5 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {rec.title}
                    </h5>
                    <span className="text-[10px] text-slate-400">⏱ {rec.time} review</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Upcoming Study Tasks & Recent Quiz Scores */}
        <div className="space-y-6">
          {/* Upcoming Study Tasks */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Upcoming Tasks</h3>
                <p className="text-xs text-slate-500">Check off tasks to build momentum</p>
              </div>
              <button
                onClick={() => setCurrentView('planner')}
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                Planner →
              </button>
            </div>

            <div className="space-y-2.5">
              {studyTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTaskCompleted(task.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    task.completed
                      ? 'bg-slate-50/80 border-slate-200 opacity-60'
                      : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xs'
                  }`}
                >
                  <button className="mt-0.5 text-indigo-600 shrink-0">
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 hover:text-indigo-600" />
                    )}
                  </button>

                  <div className="space-y-1 flex-1">
                    <span
                      className={`text-xs font-bold block ${
                        task.completed ? 'line-through text-slate-400' : 'text-slate-800'
                      }`}
                    >
                      {task.topic}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded">
                        {task.subject}
                      </span>
                      <span>•</span>
                      <span>{task.durationMinutes} min</span>
                      <span>•</span>
                      <span>{task.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Quiz Scores */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Recent Quizzes</h3>
                <p className="text-xs text-slate-500">Latest diagnostic scores</p>
              </div>
              <button
                onClick={() => setCurrentView('quiz')}
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                New Quiz +
              </button>
            </div>

            <div className="space-y-3">
              {recentQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex items-center justify-between"
                >
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{quiz.quizTitle}</h5>
                    <p className="text-[11px] text-slate-500">
                      {quiz.subject} • {quiz.date}
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-sm font-black px-2 py-0.5 rounded-lg border ${
                        quiz.percentage >= 80
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : quiz.percentage >= 60
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {quiz.percentage}%
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {quiz.score}/{quiz.totalQuestions}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Study Tools Card */}
          <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-6 text-white shadow-md">
            <h4 className="text-base font-black">Interactive AI Tools</h4>
            <p className="text-xs text-violet-100 mt-1">Jump directly into high-speed study workflows:</p>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                onClick={() => setCurrentView('flashcards')}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-2"
              >
                <Layers className="w-4 h-4 text-violet-200" />
                <span>Flashcards</span>
              </button>
              <button
                onClick={() => setCurrentView('materials')}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-violet-200" />
                <span>Upload PDF</span>
              </button>
              <button
                onClick={() => setCurrentView('quiz')}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4 text-violet-200" />
                <span>Generate Quiz</span>
              </button>
              <button
                onClick={() => setCurrentView('planner')}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-violet-200" />
                <span>Study Plan</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
