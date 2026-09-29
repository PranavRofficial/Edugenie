import React, { useState } from 'react';
import {
  Settings,
  Database,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Server,
  Key,
  FolderTree,
  Code2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const { profile, resetToDemoData, subjects, recentQuizzes, flashcards, studyTasks } = useApp();

  const [activeTab, setActiveTab] = useState<'general' | 'firestore' | 'gemini'>('general');

  const firestoreCollections = [
    {
      name: 'users',
      purpose: 'Stores student profile, education level, grade, streak, and preferences',
      fields: ['id', 'name', 'email', 'grade', 'educationLevel', 'streakDays', 'learningStyle'],
      count: 1,
    },
    {
      name: 'subjects',
      purpose: 'Enrolled academic subjects with individual syllabus completion metrics',
      fields: ['id', 'userId', 'name', 'progressPercent', 'topicsCompleted', 'totalTopics'],
      count: subjects.length,
    },
    {
      name: 'topics',
      purpose: 'Individual lesson modules, concepts, and difficulty levels',
      fields: ['id', 'subjectId', 'title', 'curriculumStandard', 'isMastered'],
      count: 42,
    },
    {
      name: 'study_materials',
      purpose: 'Uploaded lecture notes, PDFs, textbook chapters, and AI summaries',
      fields: ['id', 'userId', 'title', 'summary', 'keyConcepts', 'definitions', 'uploadedAt'],
      count: 2,
    },
    {
      name: 'quizzes',
      purpose: 'AI generated question banks with options, correct indices, and hints',
      fields: ['id', 'subject', 'topic', 'difficulty', 'questions[]', 'generatedBy'],
      count: 5,
    },
    {
      name: 'quiz_results',
      purpose: 'Historical test attempts, user answers, scores, and detected weak topics',
      fields: ['id', 'userId', 'quizId', 'score', 'percentage', 'weakTopics[]', 'date'],
      count: recentQuizzes.length,
    },
    {
      name: 'flashcards',
      purpose: 'Active recall cards with front concepts, back answers, and memory mnemonics',
      fields: ['id', 'userId', 'subject', 'front', 'back', 'memoryTip', 'status'],
      count: flashcards.length,
    },
    {
      name: 'study_plans',
      purpose: 'Weekly study schedules, exam targets, and daily focus themes',
      fields: ['id', 'userId', 'examDate', 'weeklyGoal', 'aiAdvice', 'days[]'],
      count: 1,
    },
    {
      name: 'progress',
      purpose: 'Aggregated analytics, study hours logs, and accuracy trends over time',
      fields: ['id', 'userId', 'studyHoursThisMonth', 'quizAverage', 'streakDays'],
      count: 1,
    },
    {
      name: 'achievements',
      purpose: 'Gamification badge unlocks, progress meters, and reward timestamps',
      fields: ['id', 'userId', 'badgeId', 'unlocked', 'progress', 'maxProgress'],
      count: 6,
    },
    {
      name: 'chat_history',
      purpose: 'Encrypted Q&A exchanges between student and EDUGENIE Gemini tutor',
      fields: ['id', 'userId', 'sender', 'text', 'mode', 'timestamp', 'feedback'],
      count: 12,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/25">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Settings & System Architecture
              </h1>
              <span className="text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                v1.0.0 Prototype
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage student preferences, inspect Firebase Firestore collections schema, and verify Gemini AI connectivity.
            </p>
          </div>
        </div>

        <button
          onClick={resetToDemoData}
          className="px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs flex items-center gap-2 transition-colors shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'general'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          General & Preferences
        </button>

        <button
          onClick={() => setActiveTab('firestore')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'firestore'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Firebase Firestore Architecture (11 Collections)</span>
        </button>

        <button
          onClick={() => setActiveTab('gemini')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'gemini'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Gemini AI Integration Layer</span>
        </button>
      </div>

      {/* 1. GENERAL TAB */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900">Student Account Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-bold uppercase text-[10px]">
                  Logged In As
                </span>
                <span className="font-bold text-slate-800 text-sm">{profile.name}</span>
                <span className="text-slate-500 block">{profile.email}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-bold uppercase text-[10px]">
                  Curriculum Level
                </span>
                <span className="font-bold text-slate-800 text-sm">
                  {profile.educationLevel} • {profile.grade}
                </span>
                <span className="text-slate-500 block">{profile.subjects.length} Active Subjects</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900">Application Identity & Guidelines</h3>
            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>
                <strong>EDUGENIE</strong> is an AI-powered personal learning assistant designed for students to master concepts through active recall, adaptive testing, and personalized study schedules.
              </p>
              <p>
                Tagline: <em>“Learn Smarter. Learn Faster.”</em>
              </p>
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>All API credentials run exclusively server-side via Express proxy routes.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. FIRESTORE TAB */}
      {activeTab === 'firestore' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Database className="w-4 h-4" />
              <span>Firebase Firestore Document Model</span>
            </div>
            <h3 className="text-xl font-black">
              Production Schema Blueprint for EDUGENIE
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              The application is architected to map directly to Firebase Firestore collections. Student data, quiz results, generated flashcards, and weekly study plans are structured with secure user-isolated boundaries (<code className="text-indigo-200">users/[userId]/*</code>).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {firestoreCollections.map((col) => (
              <div
                key={col.name}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderTree className="w-4 h-4 text-indigo-600" />
                    <span className="font-mono font-bold text-xs text-slate-900">
                      /{col.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                    {col.count} active doc{col.count === 1 ? '' : 's'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{col.purpose}</p>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Document Schema Keys:
                  </span>
                  <div className="flex flex-wrap gap-1 font-mono text-[10px] text-slate-600">
                    {col.fields.map((f) => (
                      <span key={f} className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200/70">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. GEMINI AI TAB */}
      {activeTab === 'gemini' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Google Gemini AI Engine</h3>
                <p className="text-xs text-slate-500">
                  Model: <code className="text-indigo-600 font-bold">gemini-3.8-flash</code> via @google/genai SDK
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Architecture</span>
                <p className="font-bold text-slate-800">Server-Side Proxy</p>
                <p className="text-slate-500 text-[11px]">API Key is strictly confidential and never exposed in browser bundles.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Telemetry</span>
                <p className="font-bold text-slate-800">aistudio-build</p>
                <p className="text-slate-500 text-[11px]">User-Agent header configured according to Gemini API SDK guidelines.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Fallback Protection</span>
                <p className="font-bold text-emerald-600">Zero-Downtime Resilience</p>
                <p className="text-slate-500 text-[11px]">High-yield pedagogical fallbacks ensure student flow is never interrupted.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 text-xs font-mono space-y-1 overflow-x-auto">
              <div className="text-indigo-400 font-bold">// Server-side SDK Initialization</div>
              <div>import &#123; GoogleGenAI &#125; from "@google/genai";</div>
              <div>const ai = new GoogleGenAI(&#123;</div>
              <div>&nbsp;&nbsp;apiKey: process.env.GEMINI_API_KEY,</div>
              <div>&nbsp;&nbsp;httpOptions: &#123; headers: &#123; 'User-Agent': 'aistudio-build' &#125; &#125;</div>
              <div>&#125;);</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
