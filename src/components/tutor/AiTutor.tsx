import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Paperclip,
  Copy,
  Check,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  HelpCircle,
  ListOrdered,
  Lightbulb,
  FileQuestion,
  AlignLeft,
  Volume2,
  Trash2,
  FileText,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/api';

export const AiTutor: React.FC = () => {
  const {
    profile,
    chatHistory,
    addChatMessage,
    setChatMessageFeedback,
    clearChatHistory,
    activeTutorPrompt,
    setActiveTutorPrompt,
    triggerConfetti,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [speechSynthesisActive, setSpeechSynthesisActive] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick Action Buttons
  const quickActions = [
    { label: 'Explain Simply', mode: 'explain_simply', icon: Lightbulb },
    { label: 'Give an Example', mode: 'give_example', icon: BookOpen },
    { label: 'Summarize', mode: 'summarize', icon: AlignLeft },
    { label: 'Quiz Me', mode: 'quiz_me', icon: HelpCircle },
    { label: 'Practice Questions', mode: 'practice_questions', icon: FileQuestion },
    { label: 'Explain Step-by-Step', mode: 'step_by_step', icon: ListOrdered },
  ];

  // Auto-scroll on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  // Handle passed quick prompt from dashboard
  useEffect(() => {
    if (activeTutorPrompt) {
      setInputMessage(activeTutorPrompt);
      setActiveTutorPrompt('');
    }
  }, [activeTutorPrompt]);

  const handleSend = async (customMessage?: string, mode: string = 'standard') => {
    const textToSend = (customMessage || inputMessage).trim();
    if (!textToSend && !uploadedFileName) return;

    const fullMessage = uploadedFileName
      ? `[Attached Document: ${uploadedFileName}]\n\n${textToSend || 'Please analyze this material and explain the key concepts.'}`
      : textToSend;

    // Add User Message
    addChatMessage({
      sender: 'user',
      text: fullMessage,
      mode,
    });

    setInputMessage('');
    setUploadedFileName(null);
    setIsLoading(true);

    try {
      const response = await apiService.sendTutorMessage(fullMessage, mode, profile);
      addChatMessage({
        sender: 'edugenie',
        text: response.reply,
        mode: response.mode || mode,
        isSimulated: response.isSimulated,
      });
    } catch (err) {
      addChatMessage({
        sender: 'edugenie',
        text: '### ⚠️ I encountered a temporary network delay\n\nPlease check your query and try again. Google Gemini is ready to assist you.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (mode: string) => {
    if (inputMessage.trim()) {
      handleSend(inputMessage, mode);
    } else {
      // Use latest question context
      const lastUserMsg = [...chatHistory].reverse().find((m) => m.sender === 'user');
      const baseQuery = lastUserMsg ? lastUserMsg.text : 'Photosynthesis in plants';
      handleSend(`${baseQuery}`, mode);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRegenerate = (prevMessageText: string) => {
    handleSend(`Please give me an alternate explanation of: ${prevMessageText}`);
  };

  const handleSpeakText = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speechSynthesisActive === id) {
      window.speechSynthesis.cancel();
      setSpeechSynthesisActive(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown hashes/stars for TTS
    const cleanSpeech = text
      .replace(/#+/g, '')
      .replace(/\*+/g, '')
      .replace(/`+/g, '')
      .replace(/\$+/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeechSynthesisActive(null);
    utterance.onerror = () => setSpeechSynthesisActive(null);

    setSpeechSynthesisActive(id);
    window.speechSynthesis.speak(utterance);
  };

  // Voice Input (Web Speech API)
  const toggleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognition.start();
    } catch (e) {
      setIsRecording(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
    }
  };

  // Basic Markdown Renderer for Educational content
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');

    return lines.map((line, idx) => {
      // Headings
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-base sm:text-lg font-black text-slate-900 mt-4 mb-2">
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('#### ')) {
        return (
          <h4 key={idx} className="text-sm sm:text-base font-extrabold text-indigo-950 mt-3 mb-1.5">
            {line.replace('#### ', '')}
          </h4>
        );
      }
      // Divider
      if (line.trim() === '---') {
        return <hr key={idx} className="my-3 border-slate-200" />;
      }
      // Formulas & Math
      if (line.includes('$$')) {
        return (
          <div
            key={idx}
            className="my-3 p-3 bg-indigo-50/80 border border-indigo-100 rounded-xl font-mono text-xs sm:text-sm text-indigo-950 font-semibold text-center overflow-x-auto"
          >
            {line.replace(/\$\$/g, '')}
          </div>
        );
      }
      // Bullet lists
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-xs sm:text-sm text-slate-700 my-1">
            <span
              dangerouslySetInnerHTML={{
                __html: line
                  .replace(/^[-*]\s+/, '')
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>'),
              }}
            />
          </li>
        );
      }
      // Numbered lists
      if (/^\d+\.\s+/.test(line)) {
        return (
          <li key={idx} className="ml-4 list-decimal text-xs sm:text-sm text-slate-700 my-1">
            <span
              dangerouslySetInnerHTML={{
                __html: line
                  .replace(/^\d+\.\s+/, '')
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>'),
              }}
            />
          </li>
        );
      }
      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      // Standard paragraph
      return (
        <p
          key={idx}
          className="text-xs sm:text-sm text-slate-700 leading-relaxed my-1"
          dangerouslySetInnerHTML={{
            __html: line
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
              .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 text-indigo-700 font-mono text-xs">$1</code>'),
          }}
        />
      );
    });
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-7.5rem)] flex flex-col bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Top Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900">Ask EDUGENIE</h2>
              <span className="text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200/80 px-2 py-0.5 rounded-full">
                Powered by Google Gemini
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Personalized tutor for {profile.name} • {profile.grade}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearChatHistory}
            title="Clear Chat History"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/40">
        {chatHistory.map((message) => {
          const isUser = message.sender === 'user';
          return (
            <div
              key={message.id}
              className={`flex items-start gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs mt-1">
                  ✨
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 sm:p-5 shadow-xs transition-all ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-xs'
                    : 'bg-white border border-slate-200/90 rounded-tl-xs text-slate-900'
                }`}
              >
                {/* Content */}
                <div className={isUser ? 'text-xs sm:text-sm font-medium whitespace-pre-wrap' : ''}>
                  {isUser ? message.text : renderFormattedContent(message.text)}
                </div>

                {/* Footer Controls for AI responses */}
                {!isUser && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">{message.timestamp}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        Gemini 3.8 Flash
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Text-to-speech */}
                      <button
                        onClick={() => handleSpeakText(message.id, message.text)}
                        title="Listen to explanation"
                        className={`p-1.5 rounded-lg hover:bg-slate-100 transition-colors ${
                          speechSynthesisActive === message.id ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Copy */}
                      <button
                        onClick={() => handleCopy(message.id, message.text)}
                        title="Copy answer"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        {copiedId === message.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Regenerate */}
                      <button
                        onClick={() => handleRegenerate(message.text.slice(0, 100))}
                        title="Regenerate alternate answer"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>

                      {/* Feedback */}
                      <button
                        onClick={() => setChatMessageFeedback(message.id, 'up')}
                        title="Helpful explanation"
                        className={`p-1.5 rounded-lg hover:bg-slate-100 transition-colors ${
                          message.feedback === 'up'
                            ? 'text-emerald-600 bg-emerald-50'
                            : 'text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setChatMessageFeedback(message.id, 'down')}
                        title="Needs improvement"
                        className={`p-1.5 rounded-lg hover:bg-slate-100 transition-colors ${
                          message.feedback === 'down'
                            ? 'text-rose-600 bg-rose-50'
                            : 'text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {isUser && (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-8 h-8 rounded-full object-cover border border-indigo-200 mt-1 shrink-0"
                />
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
              ✨
            </div>
            <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs p-4 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                <span className="text-xs font-semibold text-slate-600">
                  EDUGENIE is formulating your explanation with Gemini...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Buttons (Prompt Pills) */}
      <div className="px-4 py-2 border-t border-slate-100 bg-white flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
          Modes:
        </span>
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.mode}
              onClick={() => handleQuickAction(action.mode)}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs font-semibold transition-all shrink-0 border border-slate-200/70"
            >
              <Icon className="w-3.5 h-3.5 text-indigo-600" />
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>

      {/* Attachment Preview if any */}
      {uploadedFileName && (
        <div className="px-4 py-2 bg-indigo-50 border-t border-indigo-100 flex items-center justify-between text-xs text-indigo-900 font-semibold">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Attachment: {uploadedFileName}</span>
          </div>
          <button onClick={() => setUploadedFileName(null)} className="text-indigo-600 hover:text-indigo-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          {/* File Upload Hidden Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Attach study material, notes or diagram"
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors shrink-0"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Voice input */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            title={isRecording ? 'Listening... click to stop' : 'Voice input'}
            className={`p-2.5 rounded-xl border transition-colors shrink-0 ${
              isRecording
                ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                : 'border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800'
            }`}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask a question (e.g. 'Explain photosynthesis in simple terms')..."
            disabled={isLoading}
            className="flex-1 py-3 px-4 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={isLoading || (!inputMessage.trim() && !uploadedFileName)}
            className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white rounded-xl shadow-md shadow-indigo-600/20 disabled:shadow-none transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
