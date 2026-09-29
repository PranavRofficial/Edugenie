import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  HelpCircle,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Award,
  BookOpen,
  BrainCircuit,
  Lightbulb,
  Check,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/api';
import { QuizQuestion, QuizResult } from '../../types';

export const QuizGenerator: React.FC = () => {
  const { profile, addQuizResult, setCurrentView, setActiveTutorPrompt, triggerConfetti } = useApp();

  // Generator form states
  const [subject, setSubject] = useState(profile.subjects[0] || 'Physics');
  const [topic, setTopic] = useState('Photosynthesis & Cellular Energy');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [questionType, setQuestionType] = useState<string>('Multiple Choice');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Active quiz session states
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qIndex: number]: number }>({});
  const [showHint, setShowHint] = useState<boolean>(false);
  const [quizTimer, setQuizTimer] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [completedResult, setCompletedResult] = useState<QuizResult | null>(null);

  // Timer interval
  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setQuizTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    try {
      const response = await apiService.generateQuiz(
        subject,
        topic.trim(),
        difficulty,
        questionCount,
        questionType
      );

      if (response.quiz && response.quiz.length > 0) {
        setQuizQuestions(response.quiz);
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
        setShowHint(false);
        setQuizTimer(0);
        setIsTimerRunning(true);
        setQuizCompleted(false);
        setCompletedResult(null);
      }
    } catch (err) {
      alert('Unable to generate quiz. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setShowHint(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsTimerRunning(false);
    setQuizCompleted(true);

    // Calculate score
    let score = 0;
    const weakTopicsList: string[] = [];

    quizQuestions.forEach((q, idx) => {
      const userAns = selectedAnswers[idx];
      if (userAns === q.correctAnswerIndex) {
        score++;
      } else {
        weakTopicsList.push(q.topic || topic);
      }
    });

    const percentage = Math.round((score / quizQuestions.length) * 100);

    const result: QuizResult = {
      id: `quiz_${Date.now()}`,
      quizTitle: `${topic} (${difficulty})`,
      subject,
      topic,
      difficulty,
      score,
      totalQuestions: quizQuestions.length,
      percentage,
      date: 'Just now',
      userAnswers: selectedAnswers,
      weakTopics: Array.from(new Set(weakTopicsList)),
      recommendedTopics: [
        `Revision: ${topic} Fundamentals`,
        `Advanced ${subject} Problem Sets`,
      ],
      questions: quizQuestions,
    };

    setCompletedResult(result);
    addQuizResult(result);

    if (percentage >= 80) {
      triggerConfetti();
    }
  };

  const resetQuizState = () => {
    setQuizQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizCompleted(false);
    setCompletedResult(null);
  };

  const handleReviewWithTutor = (weakTopic: string) => {
    setActiveTutorPrompt(`I made a mistake in my quiz on "${weakTopic}". Can you explain it simply and give an example?`);
    setCurrentView('tutor');
  };

  // 1. GENERATOR FORM VIEW
  if (quizQuestions.length === 0 && !quizCompleted) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/25">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">AI Quiz Generator</h1>
                <span className="text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                  Gemini Powered
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Test your knowledge with adaptive AI-generated questions tailored to your syllabus.
              </p>
            </div>
          </div>

          <form onSubmit={handleGenerateQuiz} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-xs font-semibold bg-white text-slate-800"
                >
                  {profile.subjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                  <option value="General Science">General Science</option>
                  <option value="World History">World History</option>
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Difficulty</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Easy', 'Medium', 'Hard'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setDifficulty(lvl)}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                        difficulty === lvl
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Topic Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Topic or Chapter</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Photosynthesis, Newton's Laws, Rotational Dynamics, Trees & Graphs..."
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-xs sm:text-sm font-medium text-slate-800"
              />
              <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-500">
                <span className="font-semibold">Quick Topics:</span>
                {['Photosynthesis', 'Newton’s Laws of Motion', 'Definite Integrals', 'Le Chatelier Principle', 'Graph Algorithms'].map(
                  (t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTopic(t)}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors"
                    >
                      {t}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Question Count */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Number of Questions
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[3, 5, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setQuestionCount(num)}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                        questionCount === num
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {num} Questions
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Question Type
                </label>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-xs font-semibold bg-white text-slate-800"
                >
                  <option>Multiple Choice</option>
                  <option>True / False</option>
                  <option>Conceptual Short Answer</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Generating Quiz with Gemini...' : 'Generate Quiz with Gemini'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. ACTIVE QUIZ SESSION VIEW
  if (quizQuestions.length > 0 && !quizCompleted) {
    const currentQ = quizQuestions[currentQuestionIndex];
    const isAnswerSelected = selectedAnswers[currentQuestionIndex] !== undefined;
    const progressPercent = Math.round(
      ((currentQuestionIndex + 1) / quizQuestions.length) * 100
    );

    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-12">
        {/* Top Quiz Header: Progress & Timer */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              {subject} • {difficulty}
            </span>
            <h3 className="text-sm font-black text-slate-900">
              Question {currentQuestionIndex + 1} of {quizQuestions.length}
            </h3>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>{formatTimer(quizTimer)}</span>
            </div>
            <button
              onClick={resetQuizState}
              className="text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors"
            >
              Exit
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md space-y-6">
          <h2 className="text-base sm:text-xl font-extrabold text-slate-900 leading-snug">
            {currentQ.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, oIdx) => {
              const isSelected = selectedAnswers[currentQuestionIndex] === oIdx;
              const optionLetters = ['A', 'B', 'C', 'D'];
              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelectOption(oIdx)}
                  className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-between transition-all duration-200 ${
                    isSelected
                      ? 'bg-indigo-50/90 border-indigo-600 text-indigo-950 shadow-xs ring-2 ring-indigo-500/20'
                      : 'bg-white border-slate-200/90 text-slate-700 hover:border-indigo-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {optionLetters[oIdx] || oIdx + 1}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                </button>
              );
            })}
          </div>

          {/* Hint Card */}
          {currentQ.hint && (
            <div>
              {!showHint ? (
                <button
                  onClick={() => setShowHint(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Need a hint?</span>
                </button>
              ) : (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Conceptual Hint: </span>
                    {currentQ.hint}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Action */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {quizQuestions.length - currentQuestionIndex - 1} remaining
            </span>

            <button
              onClick={handleNextQuestion}
              disabled={!isAnswerSelected}
              className="py-3 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white disabled:text-slate-400 font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-600/20 disabled:shadow-none transition-all flex items-center gap-2"
            >
              <span>
                {currentQuestionIndex === quizQuestions.length - 1
                  ? 'Submit Quiz & View Results'
                  : 'Next Question'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. RESULTS & FEEDBACK PAGE
  if (completedResult) {
    const isPassing = completedResult.percentage >= 70;

    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        {/* Score Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-4">
            <Award className="w-4 h-4" />
            <span>Quiz Diagnostic Report</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {isPassing ? 'Outstanding Job! 🎉' : 'Good Effort! Keep Practicing 💪'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {completedResult.quizTitle} • Completed in {formatTimer(quizTimer)}
          </p>

          {/* Big Score Radial/Box */}
          <div className="my-6 inline-flex flex-col items-center justify-center w-36 h-36 rounded-3xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-500/25">
            <span className="text-4xl font-black">{completedResult.percentage}%</span>
            <span className="text-xs font-bold text-indigo-200">
              {completedResult.score} / {completedResult.totalQuestions} Correct
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={resetQuizState}
              className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
            <button
              onClick={() => {
                setActiveTutorPrompt(
                  `Can you explain the main concepts from the quiz on ${completedResult.topic}?`
                );
                setCurrentView('tutor');
              }}
              className="py-3 px-6 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Ask Tutor About Weak Areas</span>
            </button>
          </div>
        </div>

        {/* Detailed Question Review List */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900">Question-by-Question Review</h3>
              <p className="text-xs text-slate-500">Explanations generated by Google Gemini</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> {completedResult.score} Correct
              </span>
              <span className="text-rose-600 flex items-center gap-1">
                <XCircle className="w-4 h-4" />
                {completedResult.totalQuestions - completedResult.score} Incorrect
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {completedResult.questions.map((q, qIndex) => {
              const userAns = completedResult.userAnswers[qIndex];
              const isCorrect = userAns === q.correctAnswerIndex;

              return (
                <div
                  key={qIndex}
                  className={`p-5 rounded-2xl border transition-all ${
                    isCorrect
                      ? 'bg-emerald-50/30 border-emerald-200'
                      : 'bg-rose-50/30 border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400">Question {qIndex + 1}</span>
                      <h4 className="text-sm font-bold text-slate-900">{q.question}</h4>
                    </div>
                    {isCorrect ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold shrink-0 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold shrink-0 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                      </span>
                    )}
                  </div>

                  {/* Answers summary */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                        Your Answer:
                      </span>
                      <span
                        className={`font-semibold ${
                          isCorrect ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {userAns !== undefined ? q.options[userAns] : 'No answer given'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase block mb-0.5">
                        Correct Answer:
                      </span>
                      <span className="font-semibold text-emerald-900">
                        {q.options[q.correctAnswerIndex]}
                      </span>
                    </div>
                  </div>

                  {/* Gemini Explanation */}
                  <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Gemini Explanation:</span>
                    </div>
                    <p className="leading-relaxed">{q.explanation}</p>
                  </div>

                  {!isCorrect && (
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => handleReviewWithTutor(q.question)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                      >
                        <span>Deep dive with AI Tutor →</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
