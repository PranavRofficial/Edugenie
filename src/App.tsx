import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './components/landing/LandingPage';
import { Sidebar } from './components/common/Sidebar';
import { DashboardHeader } from './components/common/DashboardHeader';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { AuthModal } from './components/auth/AuthModal';

import { DashboardHome } from './components/dashboard/DashboardHome';
import { AiTutor } from './components/tutor/AiTutor';
import { MySubjects } from './components/subjects/MySubjects';
import { QuizGenerator } from './components/quiz/QuizGenerator';
import { StudyMaterialAnalyzer } from './components/materials/StudyMaterialAnalyzer';
import { FlashcardDeck } from './components/flashcards/FlashcardDeck';
import { StudyPlanner } from './components/planner/StudyPlanner';
import { ProgressAnalytics } from './components/progress/ProgressAnalytics';
import { StudentProfile } from './components/profile/StudentProfile';
import { AchievementsView } from './components/achievements/AchievementsView';
import { SettingsView } from './components/settings/SettingsView';

const MainAppContent: React.FC = () => {
  const { currentView } = useApp();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // If viewing the Landing Page
  if (currentView === 'landing') {
    return (
      <>
        <LandingPage />
        <AuthModal />
      </>
    );
  }

  // Dashboard Shell
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Sidebar */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Top Header */}
        <DashboardHeader onMenuToggle={() => setIsMobileSidebarOpen(true)} />

        {/* View Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          {currentView === 'dashboard' && <DashboardHome />}
          {currentView === 'tutor' && <AiTutor />}
          {currentView === 'subjects' && <MySubjects />}
          {currentView === 'quiz' && <QuizGenerator />}
          {currentView === 'materials' && <StudyMaterialAnalyzer />}
          {currentView === 'flashcards' && <FlashcardDeck />}
          {currentView === 'planner' && <StudyPlanner />}
          {currentView === 'progress' && <ProgressAnalytics />}
          {currentView === 'profile' && <StudentProfile />}
          {currentView === 'achievements' && <AchievementsView />}
          {currentView === 'settings' && <SettingsView />}
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>

      {/* Global Auth / Profile Modal */}
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
