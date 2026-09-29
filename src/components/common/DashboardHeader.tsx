import React from 'react';
import { Menu, Flame, Sparkles, Bell, Search, User, Globe } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DashboardHeaderProps {
  onMenuToggle: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onMenuToggle }) => {
  const { profile, currentView, setCurrentView, setActiveTutorPrompt } = useApp();

  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Student Dashboard';
      case 'tutor':
        return 'Ask EDUGENIE – AI Tutor';
      case 'subjects':
        return 'My Subjects';
      case 'quiz':
        return 'AI Quiz Generator';
      case 'materials':
        return 'Study Material Analyzer';
      case 'flashcards':
        return 'AI Flashcards';
      case 'planner':
        return 'Personalized Study Planner';
      case 'progress':
        return 'Progress Analytics';
      case 'profile':
        return 'Student Profile';
      case 'achievements':
        return 'Achievements & Rewards';
      case 'settings':
        return 'Settings & Firestore Architecture';
      default:
        return 'EDUGENIE';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      {/* Left: Mobile hamburger & current page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            {getPageTitle()}
          </h2>
          <p className="text-[11px] text-slate-500 hidden sm:block">
            {profile.name} • {profile.grade}
          </p>
        </div>
      </div>

      {/* Right: Quick actions, streak, avatar */}
      <div className="flex items-center gap-3">
        {/* Quick Landing Page link */}
        <button
          onClick={() => setCurrentView('landing')}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Landing Page</span>
        </button>

        {/* Learning Streak Pill */}
        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 text-amber-700 px-3 py-1.5 rounded-xl shadow-2xs font-extrabold text-xs">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>{profile.streakDays}d Streak</span>
        </div>

        {/* AI Tutor shortcut */}
        {currentView !== 'tutor' && (
          <button
            onClick={() => setCurrentView('tutor')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/70 text-xs font-bold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        )}

        {/* Avatar */}
        <div
          onClick={() => setCurrentView('profile')}
          className="relative cursor-pointer group"
          title="View Student Profile"
        >
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-9 h-9 rounded-full object-cover border-2 border-indigo-200 group-hover:border-indigo-600 transition-colors shadow-2xs"
          />
        </div>
      </div>
    </header>
  );
};
