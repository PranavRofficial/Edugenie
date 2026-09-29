import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  ArrowRight,
  Sparkles,
  Calculator,
  Atom,
  FlaskConical,
  Code,
  FileCode,
  BookMarked,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MySubjects: React.FC = () => {
  const { subjects, addSubject, setCurrentView, setActiveTutorPrompt, triggerConfetti } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCategory, setNewSubjectCategory] = useState('Science');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;

    addSubject(newSubjectName.trim(), 'BookOpen', 'from-emerald-500 to-teal-600');
    triggerConfetti();
    setNewSubjectName('');
    setIsAddModalOpen(false);
  };

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator':
        return <Calculator className="w-6 h-6 text-white" />;
      case 'Atom':
        return <Atom className="w-6 h-6 text-white" />;
      case 'FlaskConical':
        return <FlaskConical className="w-6 h-6 text-white" />;
      case 'Code':
        return <Code className="w-6 h-6 text-white" />;
      default:
        return <BookOpen className="w-6 h-6 text-white" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/25">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Subjects</h1>
              <span className="text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                {subjects.length} Enrolled
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage your academic disciplines, monitor topic progression, and launch study sessions.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Subject</span>
        </button>
      </div>

      {/* Add Subject Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">Add New Subject</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject Name</label>
                <input
                  type="text"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  placeholder="e.g. Biology, English Literature, World History"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={newSubjectCategory}
                  onChange={(e) => setNewSubjectCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-600 bg-white"
                >
                  <option>Science & Technology</option>
                  <option>Mathematics & Logic</option>
                  <option>Languages & Literature</option>
                  <option>Social Studies & Humanities</option>
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-1/2 py-2.5 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-md"
                >
                  Add Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((sub) => (
          <div
            key={sub.id}
            className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${sub.color} flex items-center justify-center shadow-md`}
                  >
                    {getSubjectIcon(sub.iconName)}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{sub.name}</h3>
                    <p className="text-xs text-slate-500">Last studied: {sub.lastStudied}</p>
                  </div>
                </div>

                <span className="text-base font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl">
                  {sub.progressPercent}%
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 my-4 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Current Lesson Focus:
                </span>
                <p className="text-xs font-bold text-slate-800">{sub.currentTopic}</p>
              </div>

              <div className="space-y-1.5 mb-6">
                <div className="flex justify-between text-xs text-slate-500 font-semibold">
                  <span>Topics Mastered</span>
                  <span className="text-slate-800 font-bold">
                    {sub.topicsCompleted} / {sub.totalTopics}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full bg-gradient-to-r ${sub.color} transition-all duration-700`}
                    style={{ width: `${sub.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setActiveTutorPrompt(
                    `Give me a detailed tutorial on ${sub.currentTopic} in ${sub.name}`
                  );
                  setCurrentView('tutor');
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>Continue Learning</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setCurrentView('quiz');
                }}
                className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
              >
                Take Quiz
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
