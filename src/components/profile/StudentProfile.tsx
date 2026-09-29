import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Sparkles,
  Flame,
  Target,
  BookOpen,
  Award,
  Edit3,
  CheckCircle2,
  Clock,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StudentProfile: React.FC = () => {
  const { profile, updateProfile, achievements, triggerConfetti } = useApp();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [name, setName] = useState(profile.name);
  const [educationLevel, setEducationLevel] = useState(profile.educationLevel);
  const [grade, setGrade] = useState(profile.grade);
  const [learningGoals, setLearningGoals] = useState(profile.learningGoals);
  const [learningStyle, setLearningStyle] = useState(profile.learningStyle);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      educationLevel,
      grade,
      learningGoals,
      learningStyle,
    });
    triggerConfetti();
    setIsEditOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Profile Card Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-4 border-indigo-100 shadow-md"
              />
              <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white p-1.5 rounded-xl shadow-xs">
                <Flame className="w-4 h-4 fill-white" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {profile.name}
                </h1>
                <span className="text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                  Student
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {profile.grade} • {profile.educationLevel}
              </p>
              <p className="text-xs text-indigo-600 font-semibold">{profile.email}</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all shrink-0"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Highlight Stats Row */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase">Learning Streak</span>
            <div className="text-xl font-black text-amber-500 mt-0.5">🔥 {profile.streakDays} Days</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase">Topics Done</span>
            <div className="text-xl font-black text-slate-900 mt-0.5">{profile.topicsCompleted}</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase">Quiz Accuracy</span>
            <div className="text-xl font-black text-emerald-600 mt-0.5">{profile.quizAverage}%</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase">Study Hours</span>
            <div className="text-xl font-black text-indigo-600 mt-0.5">{profile.studyHoursThisMonth}h</div>
          </div>
        </div>
      </div>

      {/* Learning Goals & Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            <span>Academic Target & Goals</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {profile.learningGoals}
          </p>

          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Preferred Learning Style
            </span>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200/70 text-indigo-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>{profile.learningStyle}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>Active Curriculum Subjects</span>
          </h3>

          <div className="flex flex-wrap gap-2">
            {profile.subjects.map((sub) => (
              <span
                key={sub}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 font-bold text-xs text-slate-800 border border-slate-200"
              >
                {sub}
              </span>
            ))}
          </div>

          <div className="pt-2 text-xs text-slate-500">
            EDUGENIE uses these subjects to automatically customize quiz banks, flashcards, and daily revision tasks.
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Unlocked Milestones & Badges</span>
            </h3>
            <p className="text-xs text-slate-500">Gamified learning rewards earned along the journey</p>
          </div>
          <span className="text-xs font-bold text-indigo-600">
            {achievements.filter((a) => a.unlocked).length} of {achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border transition-all ${
                ach.unlocked
                  ? 'bg-amber-50/40 border-amber-200 shadow-2xs'
                  : 'bg-slate-50/60 border-slate-200 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">{ach.title.split(' ')[0]}</span>
                {ach.unlocked ? (
                  <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    Unlocked
                  </span>
                ) : (
                  <span className="text-[10px] font-bold uppercase text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                    Locked
                  </span>
                )}
              </div>

              <h4 className="text-xs font-bold text-slate-900">{ach.title}</h4>
              <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{ach.description}</p>

              <div className="mt-3 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full ${
                    ach.unlocked ? 'bg-amber-500' : 'bg-slate-400'
                  }`}
                  style={{ width: `${Math.min(100, (ach.progress / ach.maxProgress) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">Edit Student Profile</h3>
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Education Level</label>
                  <select
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none bg-white font-medium"
                  >
                    <option>Middle School</option>
                    <option>High School</option>
                    <option>Undergraduate</option>
                    <option>Graduate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Grade</label>
                  <input
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Learning Goals</label>
                <textarea
                  rows={2}
                  value={learningGoals}
                  onChange={(e) => setLearningGoals(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Learning Style</label>
                <select
                  value={learningStyle}
                  onChange={(e) => setLearningStyle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none bg-white font-medium"
                >
                  <option>Visual & Concept-First (with analogies)</option>
                  <option>Step-by-Step Problem Solving</option>
                  <option>Practice Problem Heavy</option>
                  <option>Concise Revision Notes</option>
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="w-1/2 py-2.5 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
