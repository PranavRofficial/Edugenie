export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  educationLevel: string;
  grade: string;
  subjects: string[];
  learningGoals: string;
  learningStyle: string;
  avatarUrl: string;
  streakDays: number;
  studyHoursThisMonth: number;
  topicsCompleted: number;
  quizAverage: number;
  dailyGoalMinutes: number;
  dailyMinutesCompleted: number;
}

export interface SubjectItem {
  id: string;
  name: string;
  iconName: string;
  color: string;
  progressPercent: number;
  topicsCompleted: number;
  totalTopics: number;
  currentTopic: string;
  lastStudied: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  hint?: string;
  topic?: string;
}

export interface QuizResult {
  id: string;
  quizTitle: string;
  subject: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  score: number;
  totalQuestions: number;
  percentage: number;
  date: string;
  userAnswers: { [questionIndex: number]: number };
  weakTopics: string[];
  recommendedTopics: string[];
  questions: QuizQuestion[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  memoryTip?: string;
  subject: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  status?: 'new' | 'learning' | 'mastered';
}

export interface StudyTask {
  id: string;
  subject: string;
  topic: string;
  durationMinutes: number;
  type: 'Theory' | 'Practice' | 'Revision' | 'Quiz';
  completed: boolean;
  dueDate?: string;
}

export interface StudyDayPlan {
  day: string;
  focusTheme: string;
  tasks: StudyTask[];
}

export interface StudyPlan {
  id: string;
  title: string;
  examDate: string;
  weeklyGoal: string;
  aiAdvice: string;
  days: StudyDayPlan[];
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  description: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  unlockedAt?: string;
  category: 'streak' | 'quizzes' | 'topics' | 'study_time';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'edugenie';
  text: string;
  timestamp: string;
  mode?: string;
  isSimulated?: boolean;
  feedback?: 'up' | 'down' | null;
}

export interface StudyMaterialAnalysis {
  id: string;
  title: string;
  subject: string;
  uploadedAt: string;
  summary: string;
  keyConcepts: { title: string; description: string }[];
  importantDefinitions: { term: string; definition: string }[];
  importantQuestions: string[];
  flashcards: { front: string; back: string }[];
  chapters: { title: string; summary: string }[];
}
