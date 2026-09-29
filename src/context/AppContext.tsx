import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  StudentProfile,
  SubjectItem,
  QuizResult,
  Flashcard,
  StudyTask,
  StudyDayPlan,
  Achievement,
  ChatMessage,
  StudyMaterialAnalysis,
} from '../types';

export type ActiveView =
  | 'landing'
  | 'dashboard'
  | 'tutor'
  | 'subjects'
  | 'quiz'
  | 'materials'
  | 'flashcards'
  | 'planner'
  | 'progress'
  | 'profile'
  | 'achievements'
  | 'settings';

interface AppContextType {
  currentView: ActiveView;
  setCurrentView: (view: ActiveView) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  profile: StudentProfile;
  updateProfile: (updated: Partial<StudentProfile>) => void;
  subjects: SubjectItem[];
  addSubject: (name: string, iconName?: string, color?: string) => void;
  updateSubjectProgress: (subjectId: string, delta: number) => void;
  recentQuizzes: QuizResult[];
  addQuizResult: (result: QuizResult) => void;
  flashcards: Flashcard[];
  setFlashcards: React.Dispatch<React.SetStateAction<Flashcard[]>>;
  addFlashcards: (cards: Flashcard[]) => void;
  markFlashcardStatus: (cardId: string, status: 'learning' | 'mastered') => void;
  studyTasks: StudyTask[];
  toggleTaskCompleted: (taskId: string) => void;
  addStudyTask: (task: Omit<StudyTask, 'id'>) => void;
  weeklySchedule: StudyDayPlan[];
  setWeeklySchedule: React.Dispatch<React.SetStateAction<StudyDayPlan[]>>;
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;
  chatHistory: ChatMessage[];
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setChatMessageFeedback: (id: string, feedback: 'up' | 'down') => void;
  clearChatHistory: () => void;
  savedMaterials: StudyMaterialAnalysis[];
  saveMaterialAnalysis: (analysis: StudyMaterialAnalysis) => void;
  activeTutorPrompt: string;
  setActiveTutorPrompt: (prompt: string) => void;
  triggerConfetti: () => void;
  resetToDemoData: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup' | 'forgot' | 'onboarding';
  setAuthModalMode: (mode: 'login' | 'signup' | 'forgot' | 'onboarding') => void;
}

const defaultProfile: StudentProfile = {
  id: 'usr_alex_12',
  name: 'Alex',
  email: 'alex.student@edugenie.ai',
  educationLevel: 'High School',
  grade: 'Grade 12',
  subjects: ['Mathematics', 'Physics', 'Chemistry', 'Computer Science'],
  learningGoals: 'Ace Board Exams & Prepare for Engineering Entrance',
  learningStyle: 'Visual & Concept-First (with Active Recall)',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  streakDays: 7,
  studyHoursThisMonth: 28.5,
  topicsCompleted: 42,
  quizAverage: 82,
  dailyGoalMinutes: 120,
  dailyMinutesCompleted: 95,
};

const defaultSubjects: SubjectItem[] = [
  {
    id: 'sub_math',
    name: 'Mathematics',
    iconName: 'Calculator',
    color: 'from-blue-600 to-indigo-600',
    progressPercent: 78,
    topicsCompleted: 14,
    totalTopics: 18,
    currentTopic: 'Integration & Definite Integrals',
    lastStudied: 'Today',
  },
  {
    id: 'sub_physics',
    name: 'Physics',
    iconName: 'Atom',
    color: 'from-amber-500 to-orange-600',
    progressPercent: 65,
    topicsCompleted: 11,
    totalTopics: 17,
    currentTopic: 'Electromagnetic Waves & Optics',
    lastStudied: 'Yesterday',
  },
  {
    id: 'sub_chemistry',
    name: 'Chemistry',
    iconName: 'FlaskConical',
    color: 'from-emerald-500 to-teal-600',
    progressPercent: 84,
    topicsCompleted: 16,
    totalTopics: 19,
    currentTopic: 'Coordination Compounds & Organic Reactions',
    lastStudied: '2 days ago',
  },
  {
    id: 'sub_cs',
    name: 'Computer Science',
    iconName: 'Code',
    color: 'from-violet-600 to-purple-700',
    progressPercent: 91,
    topicsCompleted: 19,
    totalTopics: 21,
    currentTopic: 'Graph Algorithms & Dynamic Programming',
    lastStudied: 'Today',
  },
];

const defaultQuizzes: QuizResult[] = [
  {
    id: 'res_1',
    quizTitle: 'Data Structures & Algorithms',
    subject: 'Computer Science',
    topic: 'Binary Search Trees & Heaps',
    difficulty: 'Medium',
    score: 5,
    totalQuestions: 5,
    percentage: 100,
    date: 'Yesterday',
    userAnswers: { 0: 0, 1: 2, 2: 1, 3: 3, 4: 0 },
    weakTopics: [],
    recommendedTopics: ['Graph Traversal (BFS & DFS)', 'Trie Structures'],
    questions: [],
  },
  {
    id: 'res_2',
    quizTitle: 'Thermodynamics & Kinetics',
    subject: 'Chemistry',
    topic: 'Equilibrium & Gibbs Free Energy',
    difficulty: 'Hard',
    score: 4,
    totalQuestions: 5,
    percentage: 80,
    date: '2 days ago',
    userAnswers: { 0: 0, 1: 1, 2: 0, 3: 2, 4: 1 },
    weakTopics: ['Entropy calculations for irreversible processes'],
    recommendedTopics: ['Le Chatelier Principle in Pressure Systems', 'Enthalpy of Formation'],
    questions: [],
  },
  {
    id: 'res_3',
    quizTitle: 'Newtonian Mechanics',
    subject: 'Physics',
    topic: 'Rotational Dynamics & Torque',
    difficulty: 'Medium',
    score: 3,
    totalQuestions: 5,
    percentage: 60,
    date: '4 days ago',
    userAnswers: { 0: 0, 1: 0, 2: 2, 3: 1, 4: 3 },
    weakTopics: ['Moment of Inertia of composite bodies', 'Conservation of Angular Momentum'],
    recommendedTopics: ['Rolling without slipping', 'Torque vs Angular Acceleration'],
    questions: [],
  },
];

const defaultFlashcards: Flashcard[] = [
  {
    id: 'fc_1',
    front: "What is Newton's First Law of Motion?",
    back: 'An object will remain at rest or in uniform straight-line motion at constant velocity unless acted upon by a net external force (Law of Inertia).',
    memoryTip: 'Lazy Objects: They keep doing what they were doing until pushed!',
    subject: 'Physics',
    difficulty: 'Easy',
    status: 'mastered',
  },
  {
    id: 'fc_2',
    front: "State Le Chatelier's Principle for chemical equilibria.",
    back: 'If a dynamic equilibrium is subjected to a disturbance in concentration, pressure, or temperature, the system counteracts the change to re-establish equilibrium.',
    memoryTip: 'Equilibrium seesaw: Push one side, and it shifts to compensate!',
    subject: 'Chemistry',
    difficulty: 'Medium',
    status: 'mastered',
  },
  {
    id: 'fc_3',
    front: 'What is the time complexity of searching in a balanced Binary Search Tree?',
    back: 'O(log n) average and worst-case for self-balancing BSTs like AVL or Red-Black trees, because each comparison cuts the search space in half.',
    memoryTip: 'Dividing in half at each step always results in log2(n) depth.',
    subject: 'Computer Science',
    difficulty: 'Medium',
    status: 'learning',
  },
  {
    id: 'fc_4',
    front: 'What is the Fundamental Theorem of Calculus (Part 1)?',
    back: 'If f is continuous on [a, b], then g(x) = ∫[a to x] f(t)dt is continuous and g\'(x) = f(x). Differentiation and integration are inverse operations.',
    memoryTip: 'Derivative of the integral undoes the accumulation.',
    subject: 'Mathematics',
    difficulty: 'Hard',
    status: 'learning',
  },
  {
    id: 'fc_5',
    front: 'What is Lenz’s Law in electromagnetic induction?',
    back: 'The direction of an induced electric current always opposes the change in magnetic flux that produced it (Conservation of Energy).',
    memoryTip: 'Electrons resist change: Nature dislikes sudden flux shifts!',
    subject: 'Physics',
    difficulty: 'Medium',
    status: 'learning',
  },
  {
    id: 'fc_6',
    front: 'What is the Henderson-Hasselbalch equation for buffer solutions?',
    back: 'pH = pKa + log([Conjugate Base] / [Weak Acid]). Used to calculate buffer solution pH and equilibrium shifts.',
    memoryTip: 'pH = pKa + log(Base / Acid). Remember B before A!',
    subject: 'Chemistry',
    difficulty: 'Hard',
    status: 'new',
  },
];

const defaultAchievements: Achievement[] = [
  {
    id: 'ach_streak_7',
    title: '🔥 7-Day Streak',
    icon: 'Flame',
    description: 'Studied consistently for 7 consecutive days without skipping.',
    unlocked: true,
    progress: 7,
    maxProgress: 7,
    unlockedAt: 'Today',
    category: 'streak',
  },
  {
    id: 'ach_topics_10',
    title: '📚 10 Topics Completed',
    icon: 'BookOpenCheck',
    description: 'Completed comprehensive lessons across 10 distinct subject topics.',
    unlocked: true,
    progress: 42,
    maxProgress: 10,
    unlockedAt: 'Last week',
    category: 'topics',
  },
  {
    id: 'ach_quiz_master',
    title: '🧠 Quiz Master',
    icon: 'Award',
    description: 'Generated and completed 10 AI quizzes with Gemini.',
    unlocked: true,
    progress: 12,
    maxProgress: 10,
    unlockedAt: '3 days ago',
    category: 'quizzes',
  },
  {
    id: 'ach_score_90',
    title: '🎯 90% Quiz Score',
    icon: 'Target',
    description: 'Achieved an outstanding score of 90% or above in a challenge quiz.',
    unlocked: true,
    progress: 100,
    maxProgress: 90,
    unlockedAt: 'Yesterday',
    category: 'quizzes',
  },
  {
    id: 'ach_fast_learner',
    title: '🚀 Fast Learner',
    icon: 'Rocket',
    description: 'Mastered 5 new flashcard concepts within a single study session.',
    unlocked: true,
    progress: 5,
    maxProgress: 5,
    unlockedAt: '2 days ago',
    category: 'study_time',
  },
  {
    id: 'ach_streak_30',
    title: '🏆 30-Day Learning Streak',
    icon: 'Trophy',
    description: 'Build an unbreakable study habit by learning 30 days in a row.',
    unlocked: false,
    progress: 7,
    maxProgress: 30,
    category: 'streak',
  },
];

const defaultTasks: StudyTask[] = [
  {
    id: 'task_1',
    subject: 'Mathematics',
    topic: 'Definite Integrals by Substitution',
    durationMinutes: 45,
    type: 'Practice',
    completed: true,
    dueDate: 'Today',
  },
  {
    id: 'task_2',
    subject: 'Physics',
    topic: 'Electromagnetic Spectrum & Maxwell Equations',
    durationMinutes: 40,
    type: 'Theory',
    completed: true,
    dueDate: 'Today',
  },
  {
    id: 'task_3',
    subject: 'Chemistry',
    topic: 'Coordination Isomerism & Nomenclature',
    durationMinutes: 35,
    type: 'Revision',
    completed: false,
    dueDate: 'Today',
  },
  {
    id: 'task_4',
    subject: 'Computer Science',
    topic: 'Dijkstra Shortest Path Algorithm Drill',
    durationMinutes: 30,
    type: 'Quiz',
    completed: false,
    dueDate: 'Tomorrow',
  },
];

const defaultSchedule: StudyDayPlan[] = [
  {
    day: 'Monday',
    focusTheme: 'Calculus & Mechanics Mastery',
    tasks: [
      { id: 'sc_m1', subject: 'Mathematics', topic: 'Calculus Integration Drills', durationMinutes: 45, type: 'Practice', completed: true },
      { id: 'sc_m2', subject: 'Physics', topic: 'Kinematics & Projectile Motion', durationMinutes: 45, type: 'Theory', completed: true },
    ],
  },
  {
    day: 'Tuesday',
    focusTheme: 'Organic Reactions & Data Structures',
    tasks: [
      { id: 'sc_t1', subject: 'Chemistry', topic: 'Aldehydes & Ketones Mechanism', durationMinutes: 45, type: 'Practice', completed: true },
      { id: 'sc_t2', subject: 'Computer Science', topic: 'Binary Search Trees & Heaps', durationMinutes: 40, type: 'Theory', completed: false },
    ],
  },
  {
    day: 'Wednesday',
    focusTheme: 'Electromagnetism Deep-Dive',
    tasks: [
      { id: 'sc_w1', subject: 'Physics', topic: 'Magnetic Dipole & Faraday Law', durationMinutes: 45, type: 'Theory', completed: false },
      { id: 'sc_w2', subject: 'Mathematics', topic: 'Probability Distributions', durationMinutes: 40, type: 'Practice', completed: false },
    ],
  },
  {
    day: 'Thursday',
    focusTheme: 'Coordination Chemistry & Algorithmic Problem Solving',
    tasks: [
      { id: 'sc_th1', subject: 'Chemistry', topic: 'Crystal Field Theory (CFT)', durationMinutes: 45, type: 'Practice', completed: false },
      { id: 'sc_th2', subject: 'Computer Science', topic: 'Dynamic Programming Patterns', durationMinutes: 45, type: 'Practice', completed: false },
    ],
  },
  {
    day: 'Friday',
    focusTheme: 'High-Yield Mock Questions & Speed Drills',
    tasks: [
      { id: 'sc_f1', subject: 'Mathematics', topic: 'Vectors & 3D Geometry Quiz', durationMinutes: 40, type: 'Quiz', completed: false },
      { id: 'sc_f2', subject: 'Physics', topic: 'Wave Optics Interference Review', durationMinutes: 40, type: 'Revision', completed: false },
    ],
  },
  {
    day: 'Saturday',
    focusTheme: 'Full Mock Test & Synthesis',
    tasks: [
      { id: 'sc_s1', subject: 'All Subjects', topic: 'Full-length Mock Exam with Timer', durationMinutes: 90, type: 'Quiz', completed: false },
    ],
  },
  {
    day: 'Sunday',
    focusTheme: 'Active Recall & Spaced Repetition',
    tasks: [
      { id: 'sc_su1', subject: 'All Subjects', topic: 'Review Weak Topic Flashcards & Mistake Log', durationMinutes: 45, type: 'Revision', completed: false },
    ],
  },
];

const initialChatHistory: ChatMessage[] = [
  {
    id: 'msg_welcome',
    sender: 'edugenie',
    text: `Hello **Alex**! 👋 I'm **EDUGENIE**, your personal learning assistant powered by **Google Gemini**.

How can I help you learn smarter and faster today? You can:
- Ask me to explain any difficult concept (try asking *"Explain photosynthesis in simple terms"*).
- Generate a tailored quiz for your subjects.
- Break down complex formulas, code, or scientific diagrams.
- Request step-by-step problem derivations!`,
    timestamp: '9:00 AM',
  },
  {
    id: 'msg_sample_user',
    sender: 'user',
    text: 'Explain photosynthesis in simple terms.',
    timestamp: '9:02 AM',
  },
  {
    id: 'msg_sample_ai',
    sender: 'edugenie',
    text: `### 🌱 What is Photosynthesis?

**Photosynthesis** is the incredible biochemical process through which green plants, algae, and some bacteria convert light energy into chemical energy stored in glucose sugar.

---

### 🔑 Key Concepts
1. **The Chemical Formula**:
   $$6CO_2 + 6H_2O + \\text{Sunlight} \\longrightarrow C_6H_{12}O_6 + 6O_2$$
   *(Carbon Dioxide + Water + Light energy yields Glucose + Oxygen)*
2. **Chlorophyll**: The vibrant green pigment inside plant **chloroplasts** that catches blue and red wavelengths of light.
3. **Two Distinct Phases**:
   - **Light Reactions (Thylakoids)**: Water molecules are split ($H_2O \\rightarrow 2H^+ + \\frac{1}{2}O_2$), generating ATP and NADPH.
   - **Calvin Cycle (Stroma)**: The enzyme **RuBisCO** fixes carbon dioxide into sugar.

---

### 💡 Everyday Analogy
Think of a **Solar Bakery**:
- The **Leaves** are solar panels absorbing energy.
- The **Oven** is the chloroplast.
- The **Ingredients** are atmospheric carbon dioxide and ground water.
- The **Fresh Bread** is glucose feeding the plant's cells, and the pleasant aroma vented into the atmosphere is clean oxygen for us to breathe!

---

### 📌 Critical Exam Points
- Oxygen emitted during photosynthesis originates **strictly from the photolysis of water**, NOT from $CO_2$!
- The 3 limiting factors are **light intensity**, **carbon dioxide concentration**, and **temperature**.

---

🤔 **Quick Active-Recall Question:** *If a plant's stomata close tightly on a scorching afternoon to prevent water loss, which stage of photosynthesis halts first and why?*`,
    timestamp: '9:03 AM',
  },
];

const defaultSavedMaterials: StudyMaterialAnalysis[] = [
  {
    id: 'mat_demo_1',
    title: 'Cellular Respiration & Bioenergetics',
    subject: 'Biology / Chemistry',
    uploadedAt: 'Sep 26, 2026',
    summary: 'A structured overview of cellular respiration covering Glycolysis, the Krebs cycle, and Oxidative Phosphorylation. Highlighting net ATP yield (30-32 ATP per glucose) and electron transport chain mechanics.',
    keyConcepts: [
      { title: 'Glycolysis', description: 'Anaerobic breakdown of 1 glucose into 2 pyruvate molecules in the cytoplasm, yielding net 2 ATP + 2 NADH.' },
      { title: 'Citric Acid Cycle', description: 'Matrix cycle producing carbon dioxide, GTP/ATP, and reduced coenzymes NADH & FADH2.' },
      { title: 'Chemiosmosis', description: 'Proton gradient across the inner mitochondrial membrane driving ATP synthase phosphorylation.' },
    ],
    importantDefinitions: [
      { term: 'ATP Synthase', definition: 'Molecular rotary motor enzyme synthesizing ATP from ADP and inorganic phosphate.' },
      { term: 'Terminal Electron Acceptor', definition: 'Molecular oxygen (O2), which accepts electrons and protons to produce H2O.' },
    ],
    importantQuestions: [
      'Compare net ATP generation in aerobic respiration vs lactic acid fermentation.',
      'Explain the proton motive force generated during electron transport.',
    ],
    flashcards: [
      { front: 'Where does Glycolysis take place in eukaryotic cells?', back: 'In the Cytoplasm (Cytosol), requiring no oxygen.' },
      { front: 'What is the final electron acceptor in the electron transport chain?', back: 'Molecular Oxygen (O2), forming water.' },
    ],
    chapters: [
      { title: 'Chapter 1: Anaerobic Energy Yield', summary: 'Covers substrate-level phosphorylation and glycolysis reactions.' },
      { title: 'Chapter 2: The Mitochondrial Engine', summary: 'Details pyruvate oxidation and the Krebs cycle.' },
      { title: 'Chapter 3: Oxidative Phosphorylation', summary: 'Explains cytochrome complexes and ATP synthase mechanics.' },
    ],
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation & Auth
  const [currentView, setCurrentView] = useState<ActiveView>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'forgot' | 'onboarding'>('login');

  // Student Profile
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('edugenie_profile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  // Subjects
  const [subjects, setSubjects] = useState<SubjectItem[]>(() => {
    const saved = localStorage.getItem('edugenie_subjects');
    return saved ? JSON.parse(saved) : defaultSubjects;
  });

  // Quizzes
  const [recentQuizzes, setRecentQuizzes] = useState<QuizResult[]>(() => {
    const saved = localStorage.getItem('edugenie_quizzes');
    return saved ? JSON.parse(saved) : defaultQuizzes;
  });

  // Flashcards
  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    const saved = localStorage.getItem('edugenie_flashcards');
    return saved ? JSON.parse(saved) : defaultFlashcards;
  });

  // Tasks
  const [studyTasks, setStudyTasks] = useState<StudyTask[]>(() => {
    const saved = localStorage.getItem('edugenie_tasks');
    return saved ? JSON.parse(saved) : defaultTasks;
  });

  // Weekly Schedule
  const [weeklySchedule, setWeeklySchedule] = useState<StudyDayPlan[]>(() => {
    const saved = localStorage.getItem('edugenie_schedule');
    return saved ? JSON.parse(saved) : defaultSchedule;
  });

  // Achievements
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('edugenie_achievements');
    return saved ? JSON.parse(saved) : defaultAchievements;
  });

  // Chat
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('edugenie_chat');
    return saved ? JSON.parse(saved) : initialChatHistory;
  });

  // Materials
  const [savedMaterials, setSavedMaterials] = useState<StudyMaterialAnalysis[]>(() => {
    const saved = localStorage.getItem('edugenie_materials');
    return saved ? JSON.parse(saved) : defaultSavedMaterials;
  });

  // Quick tutor prompt from dashboard search
  const [activeTutorPrompt, setActiveTutorPrompt] = useState<string>('');

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('edugenie_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('edugenie_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('edugenie_quizzes', JSON.stringify(recentQuizzes));
  }, [recentQuizzes]);

  useEffect(() => {
    localStorage.setItem('edugenie_flashcards', JSON.stringify(flashcards));
  }, [flashcards]);

  useEffect(() => {
    localStorage.setItem('edugenie_tasks', JSON.stringify(studyTasks));
  }, [studyTasks]);

  useEffect(() => {
    localStorage.setItem('edugenie_schedule', JSON.stringify(weeklySchedule));
  }, [weeklySchedule]);

  useEffect(() => {
    localStorage.setItem('edugenie_achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('edugenie_chat', JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem('edugenie_materials', JSON.stringify(savedMaterials));
  }, [savedMaterials]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#3b82f6'],
      });
    } catch (e) {
      // Ignore if unavailable
    }
  };

  const updateProfile = (updated: Partial<StudentProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const addSubject = (name: string, iconName: string = 'BookOpen', color: string = 'from-indigo-600 to-blue-600') => {
    const newSubject: SubjectItem = {
      id: `sub_${Date.now()}`,
      name,
      iconName,
      color,
      progressPercent: 10,
      topicsCompleted: 1,
      totalTopics: 12,
      currentTopic: 'Fundamental Concepts & Introduction',
      lastStudied: 'Just now',
    };
    setSubjects((prev) => [...prev, newSubject]);
    updateProfile({ subjects: [...profile.subjects, name] });
  };

  const updateSubjectProgress = (subjectId: string, delta: number) => {
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id === subjectId) {
          const newPct = Math.min(100, Math.max(0, sub.progressPercent + delta));
          return { ...sub, progressPercent: newPct };
        }
        return sub;
      })
    );
  };

  const addQuizResult = (result: QuizResult) => {
    setRecentQuizzes((prev) => [result, ...prev]);

    // Recalculate average
    const all = [result, ...recentQuizzes];
    const avg = Math.round(all.reduce((acc, q) => acc + q.percentage, 0) / all.length);
    updateProfile({ quizAverage: avg });

    if (result.percentage >= 90) {
      triggerConfetti();
      unlockAchievement('ach_score_90');
    }
  };

  const addFlashcards = (newCards: Flashcard[]) => {
    setFlashcards((prev) => [...newCards, ...prev]);
  };

  const markFlashcardStatus = (cardId: string, status: 'learning' | 'mastered') => {
    setFlashcards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, status } : c))
    );
  };

  const toggleTaskCompleted = (taskId: string) => {
    setStudyTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextState = !t.completed;
          if (nextState) {
            triggerConfetti();
          }
          return { ...t, completed: nextState };
        }
        return t;
      })
    );

    // Also toggle in weeklySchedule
    setWeeklySchedule((prev) =>
      prev.map((day) => ({
        ...day,
        tasks: day.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
      }))
    );
  };

  const addStudyTask = (task: Omit<StudyTask, 'id'>) => {
    const newTask: StudyTask = {
      ...task,
      id: `task_${Date.now()}`,
    };
    setStudyTasks((prev) => [newTask, ...prev]);
  };

  const unlockAchievement = (id: string) => {
    setAchievements((prev) =>
      prev.map((ach) => (ach.id === id ? { ...ach, unlocked: true, progress: ach.maxProgress, unlockedAt: 'Just now' } : ach))
    );
  };

  const addChatMessage = (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const fullMsg: ChatMessage = {
      ...msg,
      id: `msg_${Date.now()}`,
      timestamp: timeStr,
    };
    setChatHistory((prev) => [...prev, fullMsg]);
  };

  const setChatMessageFeedback = (id: string, feedback: 'up' | 'down') => {
    setChatHistory((prev) =>
      prev.map((m) => (m.id === id ? { ...m, feedback } : m))
    );
  };

  const clearChatHistory = () => {
    setChatHistory(initialChatHistory);
  };

  const saveMaterialAnalysis = (analysis: StudyMaterialAnalysis) => {
    setSavedMaterials((prev) => [analysis, ...prev]);
  };

  const resetToDemoData = () => {
    localStorage.clear();
    setProfile(defaultProfile);
    setSubjects(defaultSubjects);
    setRecentQuizzes(defaultQuizzes);
    setFlashcards(defaultFlashcards);
    setStudyTasks(defaultTasks);
    setWeeklySchedule(defaultSchedule);
    setAchievements(defaultAchievements);
    setChatHistory(initialChatHistory);
    setSavedMaterials(defaultSavedMaterials);
    triggerConfetti();
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        isAuthenticated,
        setIsAuthenticated,
        profile,
        updateProfile,
        subjects,
        addSubject,
        updateSubjectProgress,
        recentQuizzes,
        addQuizResult,
        flashcards,
        setFlashcards,
        addFlashcards,
        markFlashcardStatus,
        studyTasks,
        toggleTaskCompleted,
        addStudyTask,
        weeklySchedule,
        setWeeklySchedule,
        achievements,
        unlockAchievement,
        chatHistory,
        addChatMessage,
        setChatMessageFeedback,
        clearChatHistory,
        savedMaterials,
        saveMaterialAnalysis,
        activeTutorPrompt,
        setActiveTutorPrompt,
        triggerConfetti,
        resetToDemoData,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
