import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize Google GenAI client if GEMINI_API_KEY is available
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!apiKey,
    model: 'gemini-3.8-flash',
    timestamp: new Date().toISOString(),
  });
});

// Helper for fallback generation
function extractCleanText(text: string | undefined): string {
  if (!text) return '';
  return text.trim();
}

// 1. AI Tutor Chat Endpoint
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  const { message, mode, studentContext, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // System instruction tailored for student tutoring
  const systemInstruction = `You are EDUGENIE, an encouraging, highly knowledgeable AI personal learning assistant powered by Google Gemini.
Your student context:
Name: ${studentContext?.name || 'Alex'}
Grade/Level: ${studentContext?.grade || 'Grade 12'}
Subjects: ${studentContext?.subjects?.join(', ') || 'Mathematics, Physics, Chemistry, Computer Science'}
Learning Style: ${studentContext?.learningStyle || 'Visual & Concept-First'}

Style guidelines:
- Always be encouraging, crystal-clear, and academically accurate.
- Use clean Markdown with headers, bullet points, and code blocks or bold math terms where helpful.
- When requested with a specific mode (${mode || 'standard'}), follow that style strictly:
  - 'explain_simply': Break it down with an everyday analogy and 0 jargon, then 3 key takeaways.
  - 'give_example': Provide 2 real-world, intuitive examples demonstrating the concept in action.
  - 'summarize': Give a bulleted quick-revision summary with must-remember formulas or facts.
  - 'quiz_me': Ask 2 thoughtful conceptual questions to test their understanding, followed by hints hidden under spoiler or listed below.
  - 'practice_questions': Provide 2 practice problems with step-by-step solutions.
  - 'step_by_step': Break down the concept or problem into numbered sequential steps.
- At the end of every answer, offer 1 engaging follow-up question or next step to encourage active learning.`;

  if (!ai) {
    // High quality intelligent simulated response if API key is not yet set
    const fallbackResponse = generateTutorFallback(message, mode);
    return res.json({
      reply: fallbackResponse,
      mode: mode || 'standard',
      isSimulated: true,
    });
  }

  try {
    const prompt = `Student query: "${message}"\nMode: ${mode || 'standard'}\nPlease provide a well-structured educational response.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = extractCleanText(response.text) || generateTutorFallback(message, mode);
    return res.json({
      reply,
      mode: mode || 'standard',
      isSimulated: false,
    });
  } catch (error: any) {
    console.error('Gemini Chat error:', error?.message);
    const fallbackResponse = generateTutorFallback(message, mode);
    return res.json({
      reply: fallbackResponse,
      errorNotice: 'Using fallback response due to temporary API limit',
      isSimulated: true,
    });
  }
});

// 2. AI Quiz Generator Endpoint
app.post('/api/gemini/quiz', async (req: Request, res: Response) => {
  const { subject, topic, difficulty = 'Medium', questionCount = 5, questionType = 'Multiple Choice' } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  if (!ai) {
    return res.json({
      quiz: generateFallbackQuiz(subject, topic, difficulty, questionCount, questionType),
      isSimulated: true,
    });
  }

  try {
    const prompt = `Create a high-quality educational quiz for high-school/college students.
Subject: ${subject || 'Science'}
Topic: ${topic}
Difficulty: ${difficulty}
Total Questions: ${questionCount}
Question Type: ${questionType}

Return a valid JSON array of question objects adhering to this schema:
[
  {
    "id": "q1",
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswerIndex": 0,
    "explanation": "Clear explanation of why this is correct and why other options are wrong.",
    "hint": "Helpful conceptual hint without giving away the answer directly",
    "topic": "${topic}"
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctAnswerIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
              hint: { type: Type.STRING },
              topic: { type: Type.STRING },
            },
            required: ['id', 'question', 'options', 'correctAnswerIndex', 'explanation', 'topic'],
          },
        },
      },
    });

    let quizData: any[] = [];
    try {
      quizData = JSON.parse(response.text || '[]');
    } catch {
      quizData = [];
    }

    if (!quizData || quizData.length === 0) {
      quizData = generateFallbackQuiz(subject, topic, difficulty, questionCount, questionType);
    }

    return res.json({
      quiz: quizData,
      isSimulated: false,
    });
  } catch (error: any) {
    console.error('Gemini Quiz error:', error?.message);
    return res.json({
      quiz: generateFallbackQuiz(subject, topic, difficulty, questionCount, questionType),
      isSimulated: true,
    });
  }
});

// 3. AI Study Material Summarizer Endpoint
app.post('/api/gemini/summarize', async (req: Request, res: Response) => {
  const { title, content, mode } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  if (!ai) {
    return res.json({
      analysis: generateFallbackAnalysis(title, content),
      isSimulated: true,
    });
  }

  try {
    const prompt = `Analyze the following student study material titled "${title || 'Study Material'}":
Content:
"""
${content.slice(0, 10000)}
"""

Provide a comprehensive structured analysis in JSON with:
1. summary (clear 2-3 paragraph overview)
2. keyConcepts (list of 4-6 fundamental concepts with short explanations)
3. importantDefinitions (list of 4-6 key terms and definitions)
4. importantQuestions (list of 4-5 high-yield exam questions)
5. flashcards (list of 4-6 cards with front concept/question and back answer)
6. chapters (list of 3-4 sections with title and 2-sentence summary)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyConcepts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
              },
            },
            importantDefinitions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  definition: { type: Type.STRING },
                },
              },
            },
            importantQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  front: { type: Type.STRING },
                  back: { type: Type.STRING },
                },
              },
            },
            chapters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  summary: { type: Type.STRING },
                },
              },
            },
          },
          required: ['summary', 'keyConcepts', 'importantDefinitions', 'importantQuestions', 'flashcards'],
        },
      },
    });

    let analysis: any = {};
    try {
      analysis = JSON.parse(response.text || '{}');
    } catch {
      analysis = generateFallbackAnalysis(title, content);
    }

    return res.json({
      analysis,
      isSimulated: false,
    });
  } catch (error: any) {
    console.error('Gemini Summarize error:', error?.message);
    return res.json({
      analysis: generateFallbackAnalysis(title, content),
      isSimulated: true,
    });
  }
});

// 4. AI Flashcard Generator Endpoint
app.post('/api/gemini/flashcards', async (req: Request, res: Response) => {
  const { topic, subject, count = 6 } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  if (!ai) {
    return res.json({
      flashcards: generateFallbackFlashcards(subject, topic, count),
      isSimulated: true,
    });
  }

  try {
    const prompt = `Generate ${count} high-yield, memory-retaining flashcards for the topic: "${topic}" in Subject: "${subject || 'General'}".
Each card must have:
- id: string
- front: A sharp, clear question or core concept
- back: Concise, intuitive explanation with the key takeaway
- memoryTip: A quick mnemonic or visual memory anchor
- subject: "${subject || 'General'}"
- difficulty: 'Easy' | 'Medium' | 'Hard'`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              front: { type: Type.STRING },
              back: { type: Type.STRING },
              memoryTip: { type: Type.STRING },
              subject: { type: Type.STRING },
              difficulty: { type: Type.STRING },
            },
            required: ['id', 'front', 'back', 'memoryTip'],
          },
        },
      },
    });

    let cards: any[] = [];
    try {
      cards = JSON.parse(response.text || '[]');
    } catch {
      cards = [];
    }

    if (!cards || cards.length === 0) {
      cards = generateFallbackFlashcards(subject, topic, count);
    }

    return res.json({
      flashcards: cards,
      isSimulated: false,
    });
  } catch (error: any) {
    console.error('Gemini Flashcards error:', error?.message);
    return res.json({
      flashcards: generateFallbackFlashcards(subject, topic, count),
      isSimulated: true,
    });
  }
});

// 5. AI Study Planner Endpoint
app.post('/api/gemini/study-plan', async (req: Request, res: Response) => {
  const { examDate, subjects, dailyHours, knowledgeLevel, difficultTopics } = req.body;

  if (!subjects || subjects.length === 0) {
    return res.status(400).json({ error: 'Subjects are required' });
  }

  if (!ai) {
    return res.json({
      plan: generateFallbackStudyPlan(subjects, dailyHours, difficultTopics),
      isSimulated: true,
    });
  }

  try {
    const prompt = `Create an intelligent, balanced weekly study schedule for a student preparing for exams on ${examDate || 'in 4 weeks'}.
Subjects: ${subjects.join(', ')}
Daily Study Availability: ${dailyHours || 3} hours/day
Knowledge Level: ${knowledgeLevel || 'Intermediate'}
Challenging / Priority Topics: ${difficultTopics || 'None specified'}

Return a 7-day schedule (Monday to Sunday) in JSON format.
Each day should contain:
- day: string (e.g. "Monday", "Tuesday", etc.)
- focusTheme: short motivational daily focus
- tasks: array of task objects:
  - id: unique string
  - subject: subject name
  - topic: specific subtopic
  - durationMinutes: integer minutes
  - type: 'Theory' | 'Practice' | 'Revision' | 'Quiz'
  - completed: false`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            weeklyGoal: { type: Type.STRING },
            aiAdvice: { type: Type.STRING },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  focusTheme: { type: Type.STRING },
                  tasks: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        subject: { type: Type.STRING },
                        topic: { type: Type.STRING },
                        durationMinutes: { type: Type.INTEGER },
                        type: { type: Type.STRING },
                        completed: { type: Type.BOOLEAN },
                      },
                      required: ['id', 'subject', 'topic', 'durationMinutes', 'type'],
                    },
                  },
                },
                required: ['day', 'tasks'],
              },
            },
          },
          required: ['weeklyGoal', 'days', 'aiAdvice'],
        },
      },
    });

    let plan: any = {};
    try {
      plan = JSON.parse(response.text || '{}');
    } catch {
      plan = generateFallbackStudyPlan(subjects, dailyHours, difficultTopics);
    }

    return res.json({
      plan,
      isSimulated: false,
    });
  } catch (error: any) {
    console.error('Gemini Study Plan error:', error?.message);
    return res.json({
      plan: generateFallbackStudyPlan(subjects, dailyHours, difficultTopics),
      isSimulated: true,
    });
  }
});

// Fallback Generators
function generateTutorFallback(message: string, mode?: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('photosynthesis')) {
    return `### 🌱 What is Photosynthesis?

**Photosynthesis** is the miraculous biochemical process by which green plants, algae, and cyanobacteria convert light energy into chemical energy stored in glucose sugars.

---

### 🔑 Key Concepts
1. **The Formula**: 
   $$6CO_2 + 6H_2O + \\text{Light} \\rightarrow C_6H_{12}O_6 + 6O_2$$
2. **Chlorophyll**: The green pigment located inside chloroplast thylakoids that absorbs blue and red wavelengths of sunlight.
3. **Two Major Stages**:
   - **Light-Dependent Reactions**: Occur in the thylakoid membrane, splitting $H_2O$ and generating ATP + NADPH.
   - **Calvin Cycle (Light-Independent)**: Occur in the stroma, fixing carbon dioxide into high-energy glucose molecules.

---

### 💡 Real-World Analogy
Imagine a solar-powered bakery:
- The **Solar Panels** are the chlorophyll leaves collecting sun energy.
- The **Water & Air** are flour and water.
- The **Fresh Bread** coming out is glucose sugar feeding the plant, while the bakery vents fresh oxygen into the air for us to breathe!

---

### 📌 Important Points for Exams
- Oxygen released during photosynthesis comes strictly from the **photolysis of water**, NOT from carbon dioxide!
- Factors affecting rate: Light intensity, Carbon dioxide concentration, and Temperature.

---

🤔 **Follow-up Question for You:** *What would happen to the Calvin cycle if a plant is kept in total darkness for 48 hours?*`;
  }

  return `### 💡 Understanding: ${message}

Here is a clear, structured breakdown from **EDUGENIE**:

#### 1. Core Concept
Every complex concept is best understood by breaking it down into fundamental principles. At its heart, this topic deals with how systems interact, balance forces, or transform information.

#### 2. Key Components
- **Foundation**: Master the baseline definitions and core laws first.
- **Mechanism**: Observe how inputs translate directly into measurable outputs.
- **Application**: Practice solving problems under varied constraints.

#### 3. Intuitive Example
Think of this like building with modular blocks: once you grasp the behavior of a single unit, scaling up to intricate structures becomes straightforward and logical.

#### 4. Quick Revision Tip
Create a flashcard summarizing the single most important rule or formula related to this concept!

---
✨ **Next Step:** *Would you like me to generate 3 quick practice questions or give a step-by-step mathematical example?*`;
}

function generateFallbackQuiz(subject: string, topic: string, difficulty: string, count: number, type: string) {
  const t = topic.toLowerCase();
  if (t.includes('photo') || t.includes('bio') || subject.toLowerCase().includes('bio')) {
    return [
      {
        id: 'q1',
        question: 'Where do the light-dependent reactions of photosynthesis take place inside plant cells?',
        options: ['Thylakoid Membrane', 'Stroma', 'Mitochondrial Matrix', 'Cell Wall'],
        correctAnswerIndex: 0,
        explanation: 'Light-dependent reactions occur within the thylakoid membranes where chlorophyll pigments are organized into photosystems I and II.',
        hint: 'Think about where the green chlorophyll pigment stacks (grana) are situated.',
        topic: topic || 'Photosynthesis',
      },
      {
        id: 'q2',
        question: 'What is the primary source of oxygen gas ($O_2$) released during photosynthesis?',
        options: ['Splitting of Carbon Dioxide ($CO_2$)', 'Photolysis of Water ($H_2O$)', 'Degradation of Glucose', 'Cellular Respiration'],
        correctAnswerIndex: 1,
        explanation: 'Experiments by Ruben and Kamen using oxygen-18 isotopes proved that liberated oxygen originates from splitting water molecules ($H_2O$).',
        hint: 'Recall what molecule is split by light energy to yield electrons and protons.',
        topic: topic || 'Photosynthesis',
      },
      {
        id: 'q3',
        question: 'Which enzyme is responsible for catalyzing the first major step of carbon fixation in the Calvin cycle?',
        options: ['ATP Synthase', 'RuBisCO', 'DNA Polymerase', 'Amylase'],
        correctAnswerIndex: 1,
        explanation: 'RuBisCO (Ribulose-1,5-bisphosphate carboxylase-oxygenase) is considered one of the most abundant enzymes on Earth and fixes $CO_2$ onto RuBP.',
        hint: 'Its acronym begins with Ru and ends with CO.',
        topic: topic || 'Photosynthesis',
      },
      {
        id: 'q4',
        question: 'Which wavelengths of visible light are most strongly absorbed by Chlorophyll a?',
        options: ['Green and Yellow', 'Blue and Red', 'Infrared and Ultraviolet', 'Yellow and Orange'],
        correctAnswerIndex: 1,
        explanation: 'Chlorophyll reflects green light (which is why leaves appear green) and maximally absorbs blue (~430nm) and red (~660nm) light.',
        hint: 'Leaves appear green because they reflect green light, so what colors do they absorb?',
        topic: topic || 'Photosynthesis',
      },
      {
        id: 'q5',
        question: 'What are the two high-energy energy-carrier products of the light reactions used in the Calvin cycle?',
        options: ['NADH and FADH2', 'ATP and NADPH', 'Glucose and Pyruvate', 'ADP and NADP+'],
        correctAnswerIndex: 1,
        explanation: 'ATP provides phosphate bond energy and NADPH provides reducing electrons to synthesize glucose in the stroma.',
        hint: 'One is the universal cell energy coin; the other carries high-energy hydrogen electrons with a P in its name.',
        topic: topic || 'Photosynthesis',
      },
    ].slice(0, count);
  }

  // General physics / math fallback
  return [
    {
      id: 'q1',
      question: `Which fundamental principle governs the behavior of ${topic || 'motion'} in classical mechanics?`,
      options: ["Newton's First Law of Inertia", "Boyle's Gas Law", "Coulomb's Electrostatic Law", "Heisenberg's Uncertainty Principle"],
      correctAnswerIndex: 0,
      explanation: "An object will remain at rest or move in a straight line at constant velocity unless acted upon by a net external resultant force.",
      hint: "Named after Sir Isaac Newton's groundbreaking 1687 work.",
      topic: topic || 'Physics',
    },
    {
      id: 'q2',
      question: `When analyzing work done by a conservative force in a closed path, what is the net change in mechanical energy?`,
      options: ['Always Positive', 'Zero', 'Depends on temperature', 'Infinite'],
      correctAnswerIndex: 1,
      explanation: 'For any conservative force (like gravity or spring force), round-trip work is zero and mechanical energy is strictly conserved.',
      hint: 'Conservative forces preserve total energy during closed loops.',
      topic: topic || 'Physics',
    },
    {
      id: 'q3',
      question: `What is the SI unit of momentum?`,
      options: ['Joule (J)', 'Newton (N)', 'kg·m/s', 'Watt (W)'],
      correctAnswerIndex: 2,
      explanation: 'Momentum is mass times velocity ($p = mv$), yielding kilogram meters per second ($kg \\cdot m/s$).',
      hint: 'Multiply mass units (kg) by velocity units (m/s).',
      topic: topic || 'Physics',
    },
    {
      id: 'q4',
      question: `What happens to the kinetic energy of an object if its speed is doubled?`,
      options: ['It doubles (2x)', 'It quadruples (4x)', 'It stays identical', 'It halves (0.5x)'],
      correctAnswerIndex: 1,
      explanation: 'Because kinetic energy is $KE = \\frac{1}{2}mv^2$, doubling velocity results in $2^2 = 4$ times the kinetic energy.',
      hint: 'Notice the exponent on velocity in the kinetic energy formula.',
      topic: topic || 'Physics',
    },
    {
      id: 'q5',
      question: `Which scalar quantity represents the rate at which work is done over time?`,
      options: ['Power', 'Torque', 'Acceleration', 'Impulse'],
      correctAnswerIndex: 0,
      explanation: 'Power ($P = W / t$) measures the speed of energy transfer, with 1 Watt equaling 1 Joule per second.',
      hint: 'Measured in Watts or Horsepower.',
      topic: topic || 'Physics',
    },
  ].slice(0, count);
}

function generateFallbackAnalysis(title: string, content: string) {
  return {
    summary: `This material covers the foundational theory, practical formulations, and core mechanisms of ${title || 'the chosen topic'}. The document systematically explains how key variables interlock, providing concrete definitions and mathematical relationships that commonly appear in examinations. Students are guided from introductory concepts into applied problem-solving techniques.`,
    keyConcepts: [
      {
        title: 'Core Governing Law',
        description: 'Defines the foundational boundary conditions and conservation laws that dictate system behavior.',
      },
      {
        title: 'Mathematical Formulation',
        description: 'Key proportionalities and algebraic formulas used to predict quantitative results under standard lab conditions.',
      },
      {
        title: 'Equilibrium & Transition States',
        description: 'How steady states are established and how external perturbations shift the operational equilibrium.',
      },
      {
        title: 'Practical Application',
        description: 'Real-world technological and biological implementations demonstrating the theory in modern industry.',
      },
    ],
    importantDefinitions: [
      {
        term: 'Equilibrium State',
        definition: 'A condition in which opposing forces or influences are balanced, resulting in a stable macroscopic condition.',
      },
      {
        term: 'Conservation Principle',
        definition: 'A law stating that a particular measurable property of an isolated physical system remains invariant as the system evolves.',
      },
      {
        term: 'Efficiency Ratio',
        definition: 'The percentage comparison between useful work output and the total energy input supplied.',
      },
      {
        term: 'System Boundary',
        definition: 'The real or hypothetical geometric surface that encloses the matter and space under analytical investigation.',
      },
    ],
    importantQuestions: [
      'Explain how the primary conservation law applies when external resistances are minimized.',
      'Derive the governing equation from first principles and list all assumptions made.',
      'Compare and contrast the behavior under ideal versus non-ideal empirical conditions.',
      'What experimental factors would cause a deviation from the expected theoretical curve?',
    ],
    flashcards: [
      {
        front: `What is the fundamental law of ${title || 'this subject'}?`,
        back: 'The total energy or mass within any isolated system remains constant over time regardless of transformations.',
      },
      {
        front: 'What are the required conditions for equilibrium?',
        back: 'Net external resultant forces and torques must equal zero ($\\sum F = 0$, $\\sum \\tau = 0$).',
      },
      {
        front: 'How is efficiency mathematically defined?',
        back: 'Efficiency = (Useful Energy Output / Total Energy Input) × 100%.',
      },
      {
        front: 'What is the SI standard unit of measurement?',
        back: 'Derived units based on the metric standard (kilograms, meters, seconds, and Joules).',
      },
    ],
    chapters: [
      {
        title: 'Chapter 1: Foundations & Definitions',
        summary: 'Introduces core nomenclature, coordinate frames, and historical development of the theory.',
      },
      {
        title: 'Chapter 2: Quantitative Mechanics',
        summary: 'Presents algebraic derivations, key formulas, and baseline numerical constants.',
      },
      {
        title: 'Chapter 3: Experimental Analysis & Applications',
        summary: 'Reviews lab procedures, error analysis methods, and current industry use cases.',
      },
    ],
  };
}

function generateFallbackFlashcards(subject: string, topic: string, count: number) {
  const cards = [
    {
      id: 'fc1',
      front: "What is Newton's First Law of Motion?",
      back: 'An object remains at rest or in uniform motion in a straight line unless acted upon by a net external force (Law of Inertia).',
      memoryTip: 'Think "Lazy Objects": They keep doing whatever they were already doing!',
      subject: subject || 'Physics',
      difficulty: 'Easy',
    },
    {
      id: 'fc2',
      front: 'What is the Work-Energy Theorem?',
      back: 'The net work done on an object equals the change in its kinetic energy: $W_{net} = \\Delta KE = \\frac{1}{2}mv_f^2 - \\frac{1}{2}mv_i^2$.',
      memoryTip: 'Work IN = Speed OUT (Every Joule of net work speeds up or slows down the mass).',
      subject: subject || 'Physics',
      difficulty: 'Medium',
    },
    {
      id: 'fc3',
      front: 'What is the difference between speed and velocity?',
      back: 'Speed is a scalar quantity (magnitude only, e.g., 60 km/h), while velocity is a vector quantity (magnitude AND direction, e.g., 60 km/h due North).',
      memoryTip: 'V for Velocity = V for Vector (direction matters!).',
      subject: subject || 'Physics',
      difficulty: 'Easy',
    },
    {
      id: 'fc4',
      front: "What is Le Chatelier's Principle?",
      back: 'If a dynamic equilibrium is disturbed by changing conditions (concentration, temperature, pressure), the position of equilibrium shifts to counteract the change.',
      memoryTip: 'Like a stubborn seesaw: Whatever push you give it, it pushes back in the opposite direction.',
      subject: subject || 'Chemistry',
      difficulty: 'Medium',
    },
    {
      id: 'fc5',
      front: 'What is Big O notation in Computer Science?',
      back: 'A mathematical notation describing the limiting behavior of an algorithm’s execution time or space as the input size $n$ grows toward infinity.',
      memoryTip: 'Think "Worst-Case Guarantee": How does it scale as datasets explode?',
      subject: subject || 'Computer Science',
      difficulty: 'Hard',
    },
    {
      id: 'fc6',
      front: 'What is the Fundamental Theorem of Calculus?',
      back: 'It links differentiation and integration: if $f$ is continuous on $[a, b]$, then $\\int_a^b f(x) dx = F(b) - F(a)$, where $F\'(x) = f(x)$.',
      memoryTip: 'Integration is the mirror inverse operation of differentiation!',
      subject: subject || 'Mathematics',
      difficulty: 'Hard',
    },
  ];
  return cards.slice(0, count);
}

function generateFallbackStudyPlan(subjects: string[], dailyHours: number = 3, difficultTopics?: string) {
  const diffNote = difficultTopics ? `Targeted emphasis on ${difficultTopics}.` : 'Balanced rotation across all subjects.';
  return {
    weeklyGoal: `Complete 14 focused study sessions totaling ${(dailyHours * 7).toFixed(0)} hours. ${diffNote}`,
    aiAdvice: 'Aim for 45-minute Pomodoro focus blocks with 10-minute active recall breaks. Schedule difficult topics when your cognitive energy is highest!',
    days: [
      {
        day: 'Monday',
        focusTheme: 'Core Foundations & Problem Sets',
        tasks: [
          {
            id: 't-mon-1',
            subject: subjects[0] || 'Mathematics',
            topic: 'Algebraic Formulas & Calculus Revision',
            durationMinutes: 45,
            type: 'Theory',
            completed: true,
          },
          {
            id: 't-mon-2',
            subject: subjects[1] || 'Physics',
            topic: 'Kinematics & Force Vectors',
            durationMinutes: 45,
            type: 'Practice',
            completed: true,
          },
          {
            id: 't-mon-3',
            subject: subjects[0] || 'Mathematics',
            topic: 'Speed Drills & 10 Practice Problems',
            durationMinutes: 30,
            type: 'Quiz',
            completed: false,
          },
        ],
      },
      {
        day: 'Tuesday',
        focusTheme: 'Conceptual Deep-Dives',
        tasks: [
          {
            id: 't-tue-1',
            subject: subjects[2] || 'Chemistry',
            topic: 'Atomic Structure & Chemical Bonding',
            durationMinutes: 50,
            type: 'Theory',
            completed: false,
          },
          {
            id: 't-tue-2',
            subject: subjects[3] || 'Computer Science',
            topic: 'Data Structures: Binary Trees & Graphs',
            durationMinutes: 40,
            type: 'Practice',
            completed: false,
          },
          {
            id: 't-tue-3',
            subject: subjects[2] || 'Chemistry',
            topic: 'Flashcard Mastery: Reaction Mechanisms',
            durationMinutes: 30,
            type: 'Revision',
            completed: false,
          },
        ],
      },
      {
        day: 'Wednesday',
        focusTheme: 'Problem Solving & Active Recall',
        tasks: [
          {
            id: 't-wed-1',
            subject: subjects[0] || 'Mathematics',
            topic: 'Integration Techniques & Area Under Curves',
            durationMinutes: 45,
            type: 'Practice',
            completed: false,
          },
          {
            id: 't-wed-2',
            subject: subjects[1] || 'Physics',
            topic: 'Work, Energy, and Power Conservation',
            durationMinutes: 45,
            type: 'Theory',
            completed: false,
          },
        ],
      },
      {
        day: 'Thursday',
        focusTheme: 'High-Yield Revision & Quizzes',
        tasks: [
          {
            id: 't-thu-1',
            subject: subjects[2] || 'Chemistry',
            topic: 'Thermodynamics & Enthalpy Calculations',
            durationMinutes: 45,
            type: 'Practice',
            completed: false,
          },
          {
            id: 't-thu-2',
            subject: subjects[3] || 'Computer Science',
            topic: 'Algorithmic Complexity & LeetCode warmup',
            durationMinutes: 45,
            type: 'Practice',
            completed: false,
          },
        ],
      },
      {
        day: 'Friday',
        focusTheme: 'Challenging Topics Revision',
        tasks: [
          {
            id: 't-fri-1',
            subject: subjects[1] || 'Physics',
            topic: difficultTopics || 'Rotational Dynamics & Torque',
            durationMinutes: 60,
            type: 'Practice',
            completed: false,
          },
          {
            id: 't-fri-2',
            subject: subjects[0] || 'Mathematics',
            topic: 'Timed Quiz: Matrices & Determinants',
            durationMinutes: 30,
            type: 'Quiz',
            completed: false,
          },
        ],
      },
      {
        day: 'Saturday',
        focusTheme: 'Mock Exam & Synthesis',
        tasks: [
          {
            id: 't-sat-1',
            subject: subjects[0] || 'Mathematics',
            topic: 'Full-length Mock Section Practice',
            durationMinutes: 60,
            type: 'Quiz',
            completed: false,
          },
          {
            id: 't-sat-2',
            subject: subjects[2] || 'Chemistry',
            topic: 'Organic Reaction Pathways & Nomenclature',
            durationMinutes: 45,
            type: 'Revision',
            completed: false,
          },
        ],
      },
      {
        day: 'Sunday',
        focusTheme: 'Weekly Review & Recovery',
        tasks: [
          {
            id: 't-sun-1',
            subject: 'All Subjects',
            topic: 'Review Mistake Log & Spaced Repetition Flashcards',
            durationMinutes: 45,
            type: 'Revision',
            completed: false,
          },
          {
            id: 't-sun-2',
            subject: 'Planning',
            topic: 'Assess Progress Analytics & Set Next Week Goals',
            durationMinutes: 20,
            type: 'Theory',
            completed: false,
          },
        ],
      },
    ],
  };
}

// In development, hook up Vite middleware; in production, serve static files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[EDUGENIE] Server running on port ${PORT}`);
  });
}

startServer();
