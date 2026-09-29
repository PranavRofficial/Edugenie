import React from 'react';
import {
  LayoutDashboard,
  Bot,
  HelpCircle,
  Layers,
  CalendarDays,
} from 'lucide-react';
import { useApp, ActiveView } from '../../context/AppContext';

export const MobileBottomNav: React.FC = () => {
  const { currentView, setCurrentView } = useApp();

  const items = [
    { id: 'dashboard' as ActiveView, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tutor' as ActiveView, label: 'Tutor', icon: Bot, isAi: true },
    { id: 'quiz' as ActiveView, label: 'Quiz', icon: HelpCircle },
    { id: 'flashcards' as ActiveView, label: 'Cards', icon: Layers },
    { id: 'planner' as ActiveView, label: 'Planner', icon: CalendarDays },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-2 flex items-center justify-around lg:hidden shadow-lg">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
              isActive
                ? 'text-indigo-600 font-extrabold'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <div className="relative">
              <Icon
                className={`w-5 h-5 ${
                  isActive ? 'text-indigo-600 scale-110' : 'text-slate-400'
                } transition-transform`}
              />
              {item.isAi && (
                <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
              )}
            </div>
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
