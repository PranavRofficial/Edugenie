import { Flashcard, QuizQuestion, StudyPlan, StudyMaterialAnalysis, StudentProfile } from '../types';

export interface ChatResponse {
  reply: string;
  mode?: string;
  isSimulated?: boolean;
}

export interface QuizApiResponse {
  quiz: QuizQuestion[];
  isSimulated?: boolean;
}

export interface SummarizeApiResponse {
  analysis: StudyMaterialAnalysis;
  isSimulated?: boolean;
}

export interface FlashcardsApiResponse {
  flashcards: Flashcard[];
  isSimulated?: boolean;
}

export interface StudyPlanApiResponse {
  plan: {
    weeklyGoal: string;
    aiAdvice: string;
    days: {
      day: string;
      focusTheme: string;
      tasks: {
        id: string;
        subject: string;
        topic: string;
        durationMinutes: number;
        type: 'Theory' | 'Practice' | 'Revision' | 'Quiz';
        completed: boolean;
      }[];
    }[];
  };
  isSimulated?: boolean;
}

export const apiService = {
  // Check health and Gemini configuration status
  async checkHealth(): Promise<{ status: string; geminiConfigured: boolean; model: string }> {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error('Health check failed');
      return await res.json();
    } catch (e) {
      return { status: 'fallback', geminiConfigured: false, model: 'gemini-3.8-flash' };
    }
  },

  // AI Tutor chat
  async sendTutorMessage(
    message: string,
    mode: string = 'standard',
    studentContext?: Partial<StudentProfile>
  ): Promise<ChatResponse> {
    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, mode, studentContext }),
      });

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      return await res.json();
    } catch (err: any) {
      console.warn('API error calling chat, using client fallback:', err);
      return {
        reply: `### 💡 AI Tutor Response: ${message}

Photosynthesis is the fundamental biological process where green plants harness solar energy to synthesize glucose and oxygen from carbon dioxide and water.

**Core Formula:**
$$6CO_2 + 6H_2O + \\text{Light} \\rightarrow C_6H_{12}O_6 + 6O_2$$

**Key Takeaways:**
1. **Light Reactions**: Occur inside chloroplast thylakoids; splits water, generating ATP and NADPH.
2. **Calvin Cycle**: Fixes $CO_2$ in the stroma using RuBisCO enzyme to produce high-energy sugars.
3. **Crucial Exam Point**: Liberated $O_2$ originates directly from photolysis of $H_2O$, not from carbon dioxide!

*Follow-up question:* Would you like to review the Calvin Cycle step-by-step or test your knowledge with a 3-question quiz?`,
        mode,
        isSimulated: true,
      };
    }
  },

  // AI Quiz Generator
  async generateQuiz(
    subject: string,
    topic: string,
    difficulty: string = 'Medium',
    questionCount: number = 5,
    questionType: string = 'Multiple Choice'
  ): Promise<QuizApiResponse> {
    try {
      const res = await fetch('/api/gemini/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, topic, difficulty, questionCount, questionType }),
      });

      if (!res.ok) throw new Error(`Quiz generation responded with ${res.status}`);
      return await res.json();
    } catch (err: any) {
      console.warn('Quiz generation error:', err);
      return {
        quiz: [
          {
            id: 'q1',
            question: `In ${subject || 'Physics'}, which principle states that energy cannot be created or destroyed?`,
            options: ['Law of Conservation of Energy', "Hooke's Elastic Law", "Newton's Second Law", "Ohm's Electrical Law"],
            correctAnswerIndex: 0,
            explanation: 'The Law of Conservation of Energy states that the total energy in an isolated system remains constant over time.',
            hint: 'Think about conservation of fundamental quantities.',
            topic: topic || 'Energy',
          },
          {
            id: 'q2',
            question: 'What is the rate of change of momentum proportional to?',
            options: ['Net Applied Force', 'Total Energy', 'Frictional Coefficient', 'Displacement'],
            correctAnswerIndex: 0,
            explanation: "According to Newton's Second Law ($F = \\frac{dp}{dt}$), the rate of change of momentum is directly proportional to applied force.",
            hint: 'F = dp/dt.',
            topic: topic || 'Dynamics',
          },
          {
            id: 'q3',
            question: 'Which of the following is a scalar quantity?',
            options: ['Kinetic Energy', 'Force Vector', 'Velocity Vector', 'Acceleration Vector'],
            correctAnswerIndex: 0,
            explanation: 'Energy is a scalar quantity possessing magnitude only, unlike vectors which require direction.',
            hint: 'Which one has no directional component?',
            topic: topic || 'Mechanics',
          },
        ],
        isSimulated: true,
      };
    }
  },

  // AI Study Material Summarizer
  async analyzeStudyMaterial(title: string, content: string): Promise<SummarizeApiResponse> {
    try {
      const res = await fetch('/api/gemini/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) throw new Error(`Analysis failed with status ${res.status}`);
      return await res.json();
    } catch (err: any) {
      console.warn('Material analysis error:', err);
      return {
        analysis: {
          id: `mat-${Date.now()}`,
          title: title || 'Study Notes',
          subject: 'Science',
          uploadedAt: new Date().toLocaleDateString(),
          summary: `This material presents essential foundational concepts, governing equations, and experimental proofs. Key focus areas include thermodynamic equilibrium, state variables, and molecular dynamics. Clear conceptual linkages make this ideal for exam preparation.`,
          keyConcepts: [
            { title: 'Core Conservation Law', description: 'Total internal energy remains invariant in closed adiabatic systems.' },
            { title: 'Rate of Reaction', description: 'Proportional to molecular collision frequency and activation energy thresholds.' },
            { title: 'Dynamic Equilibrium', description: 'Forward and reverse reaction rates balance at macroscopic steady state.' },
          ],
          importantDefinitions: [
            { term: 'Equilibrium Constant (K)', definition: 'Ratio of product concentrations to reactant concentrations at equilibrium.' },
            { term: 'Activation Energy (Ea)', definition: 'Minimum energy threshold required to initiate a chemical transformation.' },
          ],
          importantQuestions: [
            'How does temperature elevation impact endothermic versus exothermic reactions?',
            'Derive the rate law equation and define reaction order.',
          ],
          flashcards: [
            { front: 'What is Le Chatelier’s Principle?', back: 'Systems at equilibrium adjust to partially counteract applied stresses.' },
            { front: 'What catalyst does NOT alter?', back: 'Catalysts accelerate rate without altering equilibrium constant K or delta G.' },
          ],
          chapters: [
            { title: 'Section 1: Equilibrium Foundations', summary: 'Covers physical and chemical equilibria principles.' },
            { title: 'Section 2: Quantitative Calculations', summary: 'Covers equilibrium expressions and ICE tables.' },
          ],
        },
        isSimulated: true,
      };
    }
  },

  // AI Flashcard generator
  async generateFlashcards(topic: string, subject: string = 'General', count: number = 6): Promise<FlashcardsApiResponse> {
    try {
      const res = await fetch('/api/gemini/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, subject, count }),
      });

      if (!res.ok) throw new Error(`Flashcard gen failed: ${res.status}`);
      return await res.json();
    } catch (err: any) {
      console.warn('Flashcard generation error:', err);
      return {
        flashcards: [
          {
            id: `fc-${Date.now()}-1`,
            front: `What is the core principle of ${topic}?`,
            back: 'It describes how energy, matter, and forces interact under standard governing conditions.',
            memoryTip: 'Remember the primary formula and sign conventions.',
            subject: subject || 'Science',
            difficulty: 'Easy',
          },
          {
            id: `fc-${Date.now()}-2`,
            front: 'What is the SI standard unit of measurement?',
            back: 'Standard metric units (Joules, Newtons, meters, seconds).',
            memoryTip: 'Units check: Always verify dimensional consistency!',
            subject: subject || 'Science',
            difficulty: 'Medium',
          },
        ],
        isSimulated: true,
      };
    }
  },

  // AI Study Plan generator
  async generateStudyPlan(
    examDate: string,
    subjects: string[],
    dailyHours: number,
    knowledgeLevel: string,
    difficultTopics: string
  ): Promise<StudyPlanApiResponse> {
    try {
      const res = await fetch('/api/gemini/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examDate, subjects, dailyHours, knowledgeLevel, difficultTopics }),
      });

      if (!res.ok) throw new Error(`Study plan gen error: ${res.status}`);
      return await res.json();
    } catch (err: any) {
      console.warn('Study plan gen error:', err);
      return {
        plan: {
          weeklyGoal: `Complete ${dailyHours * 7} hours with focused attention on ${difficultTopics || 'core topics'}.`,
          aiAdvice: 'Alternate high-cognitive difficulty problem sets with conceptual flashcard review for maximum retention.',
          days: [
            {
              day: 'Monday',
              focusTheme: 'Foundations & Practice Problems',
              tasks: [
                { id: 'm1', subject: subjects[0] || 'Mathematics', topic: 'Calculus Integration Drills', durationMinutes: 45, type: 'Practice', completed: true },
                { id: 'm2', subject: subjects[1] || 'Physics', topic: 'Electromagnetism & Circuits', durationMinutes: 45, type: 'Theory', completed: true },
              ],
            },
            {
              day: 'Tuesday',
              focusTheme: 'Deep Dive & Active Recall',
              tasks: [
                { id: 't1', subject: subjects[2] || 'Chemistry', topic: 'Organic Reaction Mechanisms', durationMinutes: 50, type: 'Practice', completed: false },
                { id: 't2', subject: subjects[3] || 'Computer Science', topic: 'Data Structures: Hash Tables & Heaps', durationMinutes: 40, type: 'Theory', completed: false },
              ],
            },
          ],
        },
        isSimulated: true,
      };
    }
  },
};
