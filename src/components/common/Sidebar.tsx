import React from 'react';
import {
  LayoutDashboard,
  Bot,
  BookOpen,
  HelpCircle,
  FileText,
  Layers,
  CalendarDays,
  LineChart,
  User,
  Award,
  Settings,
  Sparkles,
  Flame,
  Globe,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { useApp, ActiveView } from '../../context/AppContext';
import { Logo } from './Logo';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const { currentView, setCurrentView, profile, setIsAuthenticated } = useApp();

  const navItems = [
    { id: 'dashboard' as ActiveView, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tutor' as ActiveView, label: 'AI Tutor', icon: Bot, badge: 'Gemini' },
    { id: 'subjects' as ActiveView, label: 'My Subjects', icon: BookOpen, count: profile.subjects.length },
    { id: 'quiz' as ActiveView, label: 'AI Quiz', icon: HelpCircle },
    { id: 'materials' as ActiveView, label: 'Study Materials', icon: FileText },
    { id: 'flashcards' as ActiveView, label: 'Flashcards', icon: Layers },
    { id: 'planner' as ActiveView, label: 'Study Planner', icon: CalendarDays },
    { id: 'progress' as ActiveView, label: 'Progress', icon: LineChart },
    { id: 'achievements' as ActiveView, label: 'Achievements', icon: Award },
    { id: 'profile' as ActiveView, label: 'Profile', icon: User },
    { id: 'settings' as ActiveView, label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (viewId: ActiveView) => {
    setCurrentView(viewId);
    setIsMobileOpen(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('landing');
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <Logo size="md" showTagline onClick={() => handleNavClick('dashboard')} />
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gemini Engine Indicator */}
        <div className="mx-4 my-3 px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 border border-indigo-100/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-slate-700">Google Gemini AI</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-white/80 px-2 py-0.5 rounded shadow-2xs">
            Flash 3.8
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Student Mini Profile & Streak */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60">
          <div
            onClick={() => handleNavClick('profile')}
            className="flex items-center justify-between p-2 rounded-xl hover:bg-white hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-9 h-9 rounded-full object-cover border-2 border-indigo-200 shadow-2xs group-hover:border-indigo-500 transition-colors"
              />
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-slate-800 leading-snug group-hover:text-indigo-600">
                  {profile.name}
                </span>
                <span className="text-[11px] text-slate-500 leading-tight">
                  {profile.grade} • {profile.subjects.length} Subjects
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg border border-amber-200/80 shadow-2xs">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-xs font-black">{profile.streakDays}d</span>
            </div>
          </div>

          {/* Quick Landing & Logout Row */}
          <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500 px-1">
            <button
              onClick={() => setCurrentView('landing')}
              className="flex items-center gap-1.5 hover:text-indigo-600 font-medium transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              Landing Page
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 hover:text-rose-600 font-medium transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
