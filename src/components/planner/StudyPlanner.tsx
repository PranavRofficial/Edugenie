import React, { useState } from 'react';
import {
  CalendarDays,
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  ArrowRight,
  Target,
  BookOpen,
  Calendar,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/api';
import { StudyDayPlan, StudyTask } from '../../types';

export const StudyPlanner: React.FC = () => {
  const {
    profile,
    weeklySchedule,
    setWeeklySchedule,
    toggleTaskCompleted,
    addStudyTask,
    triggerConfetti,
  } = useApp();

  // Generator inputs
  const [examDate, setExamDate] = useState('2026-11-15');
  const [dailyHours, setDailyHours] = useState(3);
  const [knowledgeLevel, setKnowledgeLevel] = useState('Intermediate');
  const [difficultTopics, setDifficultTopics] = useState(
    'Rotational Dynamics & Calculus Integration'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  // New task form state
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskDay, setNewTaskDay] = useState('Monday');
  const [newTaskSubject, setNewTaskSubject] = useState(profile.subjects[0] || 'Mathematics');
  const [newTaskTopic, setNewTaskTopic] = useState('');
  const [newTaskDuration, setNewTaskDuration] = useState(45);
  const [newTaskType, setNewTaskType] = useState<'Theory' | 'Practice' | 'Revision' | 'Quiz'>('Practice');

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const response = await apiService.generateStudyPlan(
        examDate,
        profile.subjects,
        dailyHours,
        knowledgeLevel,
        difficultTopics
      );

      if (response.plan && response.plan.days) {
        setWeeklySchedule(response.plan.days);
        triggerConfetti();
        setIsGeneratorOpen(false);
      }
    } catch (e) {
      alert('Error creating study plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTopic.trim()) return;

    const newTask: StudyTask = {
      id: `task_${Date.now()}`,
      subject: newTaskSubject,
      topic: newTaskTopic.trim(),
      durationMinutes: newTaskDuration,
      type: newTaskType,
      completed: false,
    };

    setWeeklySchedule((prev) =>
      prev.map((day) =>
        day.day === newTaskDay ? { ...day, tasks: [...day.tasks, newTask] } : day
      )
    );

    addStudyTask(newTask);
    setIsAddingTask(false);
    setNewTaskTopic('');
  };

  // Calculate totals
  const totalTasks = weeklySchedule.reduce((acc, d) => acc + d.tasks.length, 0);
  const completedTasks = weeklySchedule.reduce(
    (acc, d) => acc + d.tasks.filter((t) => t.completed).length,
    0
  );
  const weeklyCompletionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/25">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Personalized Study Planner
              </h1>
              <span className="text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                AI Powered Schedule
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Personalized weekly study agenda balanced by Google Gemini based on your upcoming exams and priority topics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddingTask(true)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-bold text-xs text-slate-700 flex items-center gap-1.5 transition-all shadow-2xs"
          >
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>Add Task</span>
          </button>

          <button
            onClick={() => setIsGeneratorOpen(!isGeneratorOpen)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Regenerate with AI</span>
          </button>
        </div>
      </div>

      {/* Generator Drawer Modal */}
      {isGeneratorOpen && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-200 shadow-xl space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-black text-slate-900">Configure Your AI Study Plan</h3>
            </div>
            <button
              onClick={() => setIsGeneratorOpen(false)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreatePlan} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Exam Date</label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Daily Study Availability
                </label>
                <select
                  value={dailyHours}
                  onChange={(e) => setDailyHours(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-600 bg-white"
                >
                  <option value={2}>2 Hours / Day</option>
                  <option value={3}>3 Hours / Day</option>
                  <option value={4}>4 Hours / Day</option>
                  <option value={5}>5+ Hours / Day</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Current Knowledge Level
                </label>
                <select
                  value={knowledgeLevel}
                  onChange={(e) => setKnowledgeLevel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-600 bg-white"
                >
                  <option>Beginner (Need Fundamentals)</option>
                  <option>Intermediate (Need Problem Sets)</option>
                  <option>Advanced (Exam Speed Drills)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Priority & Difficult Topics
              </label>
              <input
                type="text"
                value={difficultTopics}
                onChange={(e) => setDifficultTopics(e.target.value)}
                placeholder="e.g. Rotational Torque, Le Chatelier, Definite Integrals, Trees & Graphs"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 outline-none focus:border-indigo-600"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Synthesizing with Gemini...' : 'Create My AI Study Plan'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Add Task Modal */}
      {isAddingTask && (
        <div className="bg-white rounded-3xl p-6 border-2 border-indigo-200 shadow-lg space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-sm font-black text-slate-900">Add Custom Study Task</h4>
            <button
              onClick={() => setIsAddingTask(false)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleAddNewTask} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Day</label>
              <select
                value={newTaskDay}
                onChange={(e) => setNewTaskDay(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
                  (d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Subject</label>
              <select
                value={newTaskSubject}
                onChange={(e) => setNewTaskSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
              >
                {profile.subjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Topic</label>
              <input
                type="text"
                value={newTaskTopic}
                onChange={(e) => setNewTaskTopic(e.target.value)}
                placeholder="e.g. Practice 10 Calculus problems"
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Weekly Progress Banner */}
      <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl p-5 border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-indigo-700 uppercase tracking-wider">
            Weekly Progress Goal
          </span>
          <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
            {completedTasks} of {totalTasks} Tasks Finished ({weeklyCompletionRate}%)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Keep pace to finish your priority topics before {examDate}!
          </p>
        </div>

        <div className="w-full sm:w-60">
          <div className="w-full bg-indigo-200/60 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${weeklyCompletionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Calendar Style Weekly Schedule View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {weeklySchedule.map((dayPlan, dIdx) => (
          <div
            key={dIdx}
            className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div>
                  <h3 className="text-base font-black text-slate-900">{dayPlan.day}</h3>
                  <p className="text-[11px] text-slate-400 font-medium">{dayPlan.focusTheme}</p>
                </div>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                  {dayPlan.tasks.filter((t) => t.completed).length}/{dayPlan.tasks.length}
                </span>
              </div>

              {/* Tasks List */}
              <div className="space-y-2.5">
                {dayPlan.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTaskCompleted(task.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                      task.completed
                        ? 'bg-slate-50 border-slate-200 opacity-60'
                        : 'bg-white border-slate-200 hover:border-indigo-400 hover:shadow-2xs'
                    }`}
                  >
                    <button className="mt-0.5 shrink-0">
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300 hover:text-indigo-600" />
                      )}
                    </button>

                    <div className="space-y-0.5 flex-1 min-w-0">
                      <span
                        className={`text-xs font-bold block truncate ${
                          task.completed ? 'line-through text-slate-400' : 'text-slate-800'
                        }`}
                      >
                        {task.topic}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                        <span className="font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded">
                          {task.subject}
                        </span>
                        <span>•</span>
                        <span>{task.durationMinutes}m</span>
                        <span>•</span>
                        <span className="font-medium text-slate-400">{task.type}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {dayPlan.tasks.reduce((sum, t) => sum + t.durationMinutes, 0)} min total
              </span>
              <span className="font-semibold text-indigo-600">EDUGENIE Plan</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
