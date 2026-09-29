import React, { useState } from 'react';
import {
  Upload,
  FileText,
  FileCheck,
  Sparkles,
  BookOpen,
  HelpCircle,
  Layers,
  ArrowRight,
  List,
  CheckCircle2,
  Bookmark,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/api';
import { StudyMaterialAnalysis } from '../../types';

export const StudyMaterialAnalyzer: React.FC = () => {
  const {
    saveMaterialAnalysis,
    savedMaterials,
    addFlashcards,
    setCurrentView,
    setActiveTutorPrompt,
    triggerConfetti,
  } = useApp();

  const [documentTitle, setDocumentTitle] = useState('Newtonian Mechanics & Kinematics');
  const [materialText, setMaterialText] = useState(
    `Chapter 3: Dynamics of Motion and Work-Energy Equivalence.
Newton's First Law states that every object will remain at rest or in uniform motion in a straight line unless compelled to change its state by the action of an external resultant force. This is commonly known as the Law of Inertia.
Newton's Second Law describes the relationship between an object's mass and the amount of force needed to accelerate it: F = ma, or more formally, net force is the time derivative of momentum dp/dt.
Newton's Third Law states that for every action, there is an equal and opposite reaction force.
The Work-Energy Theorem states that the net work done by all external forces acting on a particle equals the change in its kinetic energy: W_net = Delta KE = 1/2 m v_f^2 - 1/2 m v_i^2.
Conservative forces conserve total mechanical energy throughout the path, while non-conservative forces like friction dissipate mechanical energy into thermal energy.`
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState<StudyMaterialAnalysis | null>(
    savedMaterials[0] || null
  );

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialText.trim()) return;

    setIsAnalyzing(true);
    try {
      const response = await apiService.analyzeStudyMaterial(documentTitle, materialText);
      if (response.analysis) {
        setActiveAnalysis(response.analysis);
        saveMaterialAnalysis(response.analysis);
        triggerConfetti();
      }
    } catch (err) {
      alert('Analysis encountered an issue. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setDocumentTitle(file.name.replace(/\.[^/.]+$/, ''));
      setMaterialText(
        `[Extracted Text from ${file.name}]\nFoundational lecture notes covering thermodynamic cycles, heat engines, Carnot efficiency calculations, and entropy changes in isolated systems.`
      );
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setDocumentTitle(file.name.replace(/\.[^/.]+$/, ''));
      setMaterialText(
        `[Extracted Text from ${file.name}]\nDetailed study notes on organic reaction mechanisms, electrophilic aromatic substitution, Markovnikov additions, and carbonyl chemistry.`
      );
    }
  };

  const handleExportFlashcards = () => {
    if (!activeAnalysis?.flashcards) return;
    const newCards = activeAnalysis.flashcards.map((fc, i) => ({
      id: `fc_mat_${Date.now()}_${i}`,
      front: fc.front,
      back: fc.back,
      subject: activeAnalysis.subject || 'Notes',
      memoryTip: 'Extracted from ' + activeAnalysis.title,
      status: 'new' as const,
    }));
    addFlashcards(newCards);
    triggerConfetti();
    alert(`Successfully added ${newCards.length} flashcards to your deck!`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Upload Header & Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/25">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Study Material Analyzer
              </h1>
              <span className="text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                Gemini Multimodal
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Upload your study material and let EDUGENIE turn it into an interactive learning experience.
            </p>
          </div>
        </div>

        <form onSubmit={handleAnalyze} className="space-y-5">
          {/* Drag & Drop File Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="border-2 border-dashed border-indigo-200 hover:border-indigo-500 bg-indigo-50/40 rounded-2xl p-6 text-center transition-all cursor-pointer relative"
          >
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.docx,.ppt,.pptx,.txt,.png,.jpg"
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-xl bg-white shadow-xs text-indigo-600 flex items-center justify-center mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-800">
                {selectedFile ? selectedFile.name : 'Drop your PDF, DOCX, PPT, or lecture notes here'}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Supports textbook chapters, handwritten summaries, slides, and syllabus files up to 25MB
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Document / Topic Title
              </label>
              <input
                type="text"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:border-indigo-600 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Content or Paste Notes
              </label>
              <textarea
                rows={3}
                value={materialText}
                onChange={(e) => setMaterialText(e.target.value)}
                placeholder="Paste key formulas, notes, or chapter excerpt..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 text-slate-800 focus:border-indigo-600 outline-none font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isAnalyzing}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-black text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {isAnalyzing
                ? 'Synthesizing with Google Gemini...'
                : 'Turn Material Into Interactive Experience'}
            </span>
          </button>
        </form>
      </div>

      {/* Analysis Results Display */}
      {activeAnalysis && (
        <div className="space-y-6">
          {/* Quick Action Bar */}
          <div className="bg-gradient-to-r from-indigo-900 to-violet-900 text-white p-5 rounded-3xl shadow-md flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                Analysis Complete
              </span>
              <h2 className="text-xl font-black">{activeAnalysis.title}</h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExportFlashcards}
                className="px-4 py-2 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>Generate Flashcards</span>
              </button>

              <button
                onClick={() => {
                  setCurrentView('quiz');
                }}
                className="px-4 py-2 rounded-xl bg-indigo-700/80 hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 border border-indigo-400/40 transition-all"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Generate Quiz</span>
              </button>

              <button
                onClick={() => {
                  setActiveTutorPrompt(
                    `Explain the difficult concepts from "${activeAnalysis.title}" in detail.`
                  );
                  setCurrentView('tutor');
                }}
                className="px-4 py-2 rounded-xl bg-indigo-700/80 hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 border border-indigo-400/40 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Explain Difficult Topics</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: AI Summary & Key Concepts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Summary Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Executive Summary</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {activeAnalysis.summary}
                </p>
              </div>

              {/* Key Concepts */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>Key Concepts Breakdown</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeAnalysis.keyConcepts?.map((kc, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 transition-all space-y-1"
                    >
                      <h4 className="text-xs font-bold text-slate-900">{kc.title}</h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{kc.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chapter-Wise Summary */}
              {activeAnalysis.chapters && activeAnalysis.chapters.length > 0 && (
                <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <List className="w-4 h-4 text-indigo-600" />
                    <span>Chapter-Wise Summary</span>
                  </h3>

                  <div className="space-y-3">
                    {activeAnalysis.chapters.map((ch, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1"
                      >
                        <h5 className="text-xs font-bold text-indigo-950">{ch.title}</h5>
                        <p className="text-[11px] text-slate-600">{ch.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Col: Important Definitions & Questions */}
            <div className="space-y-6">
              {/* Definitions */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-amber-500" />
                  <span>Important Definitions</span>
                </h3>

                <div className="space-y-3">
                  {activeAnalysis.importantDefinitions?.map((def, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-amber-50/40 border border-amber-200/80 space-y-0.5"
                    >
                      <span className="text-xs font-bold text-amber-950 block">{def.term}</span>
                      <p className="text-[11px] text-slate-600">{def.definition}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* High Yield Exam Questions */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  <span>Important Exam Questions</span>
                </h3>

                <div className="space-y-2">
                  {activeAnalysis.importantQuestions?.map((q, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setActiveTutorPrompt(`Please give a complete answer and explanation to: "${q}"`);
                        setCurrentView('tutor');
                      }}
                      className="p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 transition-all cursor-pointer text-xs font-semibold text-slate-800 flex items-center justify-between group"
                    >
                      <span>{q}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 ml-2" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
