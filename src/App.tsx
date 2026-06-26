import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  MessageSquare,
  Clock,
  BookOpen,
  Terminal,
  Brain,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import Sidebar from "./components/Sidebar";
import ChatContainer from "./components/ChatContainer";
import ComplexityAnalyzer from "./components/ComplexityAnalyzer";
import PracticeArena from "./components/PracticeArena";
import { ChatSession, Message, QuizQuestion, ComplexityResult } from "./types";

const LOCAL_STORAGE_SESSION_KEY = "dsa_tutor_sessions_v1";
const LOCAL_STORAGE_ACTIVE_ID_KEY = "dsa_tutor_active_id_v1";
const LOCAL_STORAGE_LANG_KEY = "dsa_tutor_lang_v1";
const LOCAL_STORAGE_COMPLEX_KEY = "dsa_tutor_complex_history_v1";

const DEFAULT_INTRO = `Welcome to **DSA Tutor AI**! 🚀

I am your personal mentor specialized in **Data Structures, Algorithms, Competitive Programming, and Coding Interviews**. 

### How I can help you:
1. **Explain concepts & logic**: BFS, Dynamic Programming, Heap/Trie structures, etc.
2. **Review your solutions**: Paste code snippets to detect off-by-one errors or logical traps.
3. **Analyze Complexities**: Provide step-by-step space-time bounds and recurrences.
4. **Generate progressive hints**: Guides you through challenges without spoiling the final code.

What topic would you like to explore today?`;

export default function App() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [complexityHistory, setComplexityHistory] = useState<ComplexityResult[]>([]);
  const [activeTab, setActiveTab] = useState<"chat" | "analyzer" | "practice">("chat");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load state from local storage on mount
  useEffect(() => {
    try {
      const storedLang = localStorage.getItem(LOCAL_STORAGE_LANG_KEY);
      if (storedLang) setSelectedLanguage(storedLang);

      const storedComplex = localStorage.getItem(LOCAL_STORAGE_COMPLEX_KEY);
      if (storedComplex) setComplexityHistory(JSON.parse(storedComplex));

      const storedSessions = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
      const parsedSessions = storedSessions ? JSON.parse(storedSessions) : [];

      if (parsedSessions.length > 0) {
        setSessions(parsedSessions);
        const storedActiveId = localStorage.getItem(LOCAL_STORAGE_ACTIVE_ID_KEY);
        if (storedActiveId && parsedSessions.some((s: ChatSession) => s.id === storedActiveId)) {
          setActiveSessionId(storedActiveId);
        } else {
          setActiveSessionId(parsedSessions[0].id);
        }
      } else {
        // Create initial onboarding chat session
        const initialSessionId = `session_${Date.now()}`;
        const onboardingSession: ChatSession = {
          id: initialSessionId,
          title: "Introduction & Guide",
          language: "cpp",
          createdAt: new Date().toISOString(),
          messages: [
            {
              id: `msg_onboard_${Date.now()}`,
              role: "assistant",
              content: DEFAULT_INTRO,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ],
        };
        setSessions([onboardingSession]);
        setActiveSessionId(initialSessionId);
        localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify([onboardingSession]));
        localStorage.setItem(LOCAL_STORAGE_ACTIVE_ID_KEY, initialSessionId);
      }
    } catch (err) {
      console.error("Local storage initialization failed:", err);
    }
  }, []);

  // Update language preference helper
  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    localStorage.setItem(LOCAL_STORAGE_LANG_KEY, lang);
  };

  // Create a new session helper
  const handleNewSession = (initialPrompt?: string, title?: string) => {
    const newId = `session_${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: title || "New Chat Session",
      language: selectedLanguage,
      createdAt: new Date().toISOString(),
      messages: initialPrompt
        ? [
            {
              id: `msg_user_${Date.now()}`,
              role: "user",
              content: initialPrompt,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]
        : [
            {
              id: `msg_intro_${Date.now()}`,
              role: "assistant",
              content: `Hi there! I'm ready to discuss Data Structures or Algorithms with you using **${selectedLanguage.toUpperCase()}**. Ask me any question, paste code to debug, or request optimized solutions!`,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ],
    };

    const updated = [newSession, ...sessions];
    setSessions(updated);
    setActiveSessionId(newId);
    setActiveTab("chat");
    setIsMobileSidebarOpen(false);

    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(updated));
    localStorage.setItem(LOCAL_STORAGE_ACTIVE_ID_KEY, newId);

    // If an initial prompt is set, automatically trigger the API reply
    if (initialPrompt) {
      triggerTutorReply(updated, newId);
    }
  };

  // Delete session helper
  const handleDeleteSession = (id: string) => {
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);

    let nextActiveId = activeSessionId;
    if (activeSessionId === id) {
      nextActiveId = updated.length > 0 ? updated[0].id : null;
      setActiveSessionId(nextActiveId);
    }

    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(updated));
    if (nextActiveId) {
      localStorage.setItem(LOCAL_STORAGE_ACTIVE_ID_KEY, nextActiveId);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_ACTIVE_ID_KEY);
    }

    // Auto create onboarding if list gets fully emptied
    if (updated.length === 0) {
      const initialSessionId = `session_${Date.now()}`;
      const onboardingSession: ChatSession = {
        id: initialSessionId,
        title: "Introduction & Guide",
        language: "cpp",
        createdAt: new Date().toISOString(),
        messages: [
          {
            id: `msg_onboard_${Date.now()}`,
            role: "assistant",
            content: DEFAULT_INTRO,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ],
      };
      setSessions([onboardingSession]);
      setActiveSessionId(initialSessionId);
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify([onboardingSession]));
      localStorage.setItem(LOCAL_STORAGE_ACTIVE_ID_KEY, initialSessionId);
    }
  };

  // Trigger server-side chat generation
  const triggerTutorReply = async (allSessions: ChatSession[], sessionId: string) => {
    setIsLoading(true);
    const targetSession = allSessions.find((s) => s.id === sessionId);
    if (!targetSession) return;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: targetSession.messages,
        }),
      });

      if (!res.ok) {
        throw new Error("Tutor was unable to connect. Verify service availability.");
      }

      const data = await res.json();
      const answer = data.answer || "I apologize, but I couldn't formulate a response. Let me know if we can try again.";

      const newBotMsg: Message = {
        id: `msg_bot_${Date.now()}`,
        role: "assistant",
        content: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      // Append reply to the correct session
      const finalSessions = allSessions.map((s) => {
        if (s.id === sessionId) {
          const updatedMsgs = [...s.messages, newBotMsg];
          // Dynamically rename default session titles if they are "New Chat Session"
          const updatedTitle =
            s.title === "New Chat Session" && s.messages.length > 0
              ? s.messages[0].content.slice(0, 24).trim() + "..."
              : s.title;

          return { ...s, title: updatedTitle, messages: updatedMsgs };
        }
        return s;
      });

      setSessions(finalSessions);
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(finalSessions));
    } catch (err: any) {
      console.error(err);
      const errorMsg: Message = {
        id: `msg_err_${Date.now()}`,
        role: "assistant",
        content: `⚠️ **Service Connectivity Error**: ${err.message || "An issue occurred connecting to the tutor server."}. Let's try sending that question again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      const finalSessions = allSessions.map((s) => {
        if (s.id === sessionId) {
          return { ...s, messages: [...s.messages, errorMsg] };
        }
        return s;
      });
      setSessions(finalSessions);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit standard chat messages
  const handleSendMessage = (content: string) => {
    if (!activeSessionId) return;

    const newMsg: Message = {
      id: `msg_user_${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updated = sessions.map((s) => {
      if (s.id === activeSessionId) {
        return { ...s, messages: [...s.messages, newMsg] };
      }
      return s;
    });

    setSessions(updated);
    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(updated));

    // Fire actual bot responder
    triggerTutorReply(updated, activeSessionId);
  };

  // Submit complexity analytics
  const handleAnalyzeComplexity = async (code: string, language: string): Promise<string> => {
    const res = await fetch("/api/analyze-complexity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language }),
    });

    if (!res.ok) {
      throw new Error("Unable to analyze code complexity.");
    }

    const data = await res.json();
    const analysis = data.analysis || "No analysis generated.";

    const newResult: ComplexityResult = {
      code,
      language,
      analysis,
      timestamp: new Date().toLocaleString(),
    };

    const updatedHistory = [newResult, ...complexityHistory].slice(0, 20); // cap history at 20 items
    setComplexityHistory(updatedHistory);
    localStorage.setItem(LOCAL_STORAGE_COMPLEX_KEY, JSON.stringify(updatedHistory));

    return analysis;
  };

  // Generate dynamic coding questions
  const handleGenerateQuiz = async (topic: string, difficulty: string): Promise<QuizQuestion> => {
    const res = await fetch("/api/generate-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, difficulty }),
    });

    if (!res.ok) {
      throw new Error("Unable to generate interview questions.");
    }

    const question: QuizQuestion = await res.json();
    return question;
  };

  // Evaluate solved practice solutions in Chat View
  const handleSubmitSolutionToChat = (question: QuizQuestion, solution: string) => {
    const prompt = `Hello Tutor! I generated an interview practice question on the topic of "${question.topic}" called "${question.title}".

Here is the problem statement:
${question.description}

Here is my solved solution in ${selectedLanguage.toUpperCase()}:
\`\`\`${selectedLanguage}
${solution}
\`\`\`

Please inspect my implementation:
1. Double-check for correct logic, edge-cases, and potential runtime bugs.
2. Formulate step-by-step Time and Space Complexity bounds.
3. Suggest better layouts or micro-optimizations.
4. Give me an evaluation report with feedback! Thank you.`;

    handleNewSession(prompt, `Review: ${question.title}`);
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100 antialiased">
      {/* Mobile Header Nav */}
      <div className="flex h-14 items-center justify-between border-b border-slate-800/80 bg-slate-950 px-4 md:hidden w-full absolute top-0 z-30">
        <button
          id="btn-mobile-menu"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="rounded p-1 text-slate-400 hover:text-white"
        >
          {isMobileSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <span className="font-display font-bold tracking-tight text-white">DSA Tutor AI</span>
        <div className="flex items-center gap-1.5 rounded-full bg-slate-800/60 px-2.5 py-1 text-[10px] font-mono border border-slate-700/30">
          {selectedLanguage.toUpperCase()}
        </div>
      </div>

      {/* Sidebar Panel - Collapsible for desktop / slide-over for mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${isSidebarOpen ? "md:flex md:w-80" : "md:hidden"}`}
      >
        <Sidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={(id) => {
            setActiveSessionId(id);
            setActiveTab("chat");
            setIsMobileSidebarOpen(false);
            localStorage.setItem(LOCAL_STORAGE_ACTIVE_ID_KEY, id);
          }}
          onNewSession={handleNewSession}
          onDeleteSession={handleDeleteSession}
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
          onClearAll={() => {
            if (window.confirm("This will permanently delete all of your chat history and custom calculations from your browser storage. Proceed?")) {
              localStorage.clear();
              window.location.reload();
            }
          }}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          id="mobile-sidebar-overlay"
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Main Workspace Frame */}
      <div className="flex flex-1 flex-col overflow-hidden pt-14 md:pt-0">
        {/* Workspace Toolbar Tabs */}
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 md:px-6">
          {/* Collapse sidebar button */}
          <button
            id="btn-toggle-sidebar"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg border border-slate-850 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-750 transition-all cursor-pointer shadow-inner"
            title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isSidebarOpen ? <ChevronLeft className="h-4.5 w-4.5" /> : <ChevronRight className="h-4.5 w-4.5" />}
          </button>

          {/* Core Applet Navigation Tabs */}
          <div className="flex h-full items-center gap-1">
            <button
              id="tab-chat"
              onClick={() => setActiveTab("chat")}
              className={`flex h-full items-center gap-2 px-4 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 font-display ${
                activeTab === "chat"
                  ? "border-indigo-500 text-indigo-400 font-bold bg-indigo-500/5"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Coaching Chat</span>
            </button>
            <button
              id="tab-analyzer"
              onClick={() => setActiveTab("analyzer")}
              className={`flex h-full items-center gap-2 px-4 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 font-display ${
                activeTab === "analyzer"
                  ? "border-indigo-500 text-indigo-400 font-bold bg-indigo-500/5"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>Big-O Analyzer</span>
            </button>
            <button
              id="tab-practice"
              onClick={() => setActiveTab("practice")}
              className={`flex h-full items-center gap-2 px-4 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 font-display ${
                activeTab === "practice"
                  ? "border-indigo-500 text-indigo-400 font-bold bg-indigo-500/5"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Practice Arena</span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
            <span className="text-[10px] font-mono text-indigo-300 font-semibold tracking-wider uppercase hidden sm:inline">
              Interactive Workspace
            </span>
          </div>
        </div>

        {/* Workspace Display Area */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "chat" && activeSession && (
            <ChatContainer
              messages={activeSession.messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              selectedLanguage={selectedLanguage}
            />
          )}

          {activeTab === "analyzer" && (
            <ComplexityAnalyzer
              onAnalyze={handleAnalyzeComplexity}
              history={complexityHistory}
              onClearHistory={() => {
                setComplexityHistory([]);
                localStorage.removeItem(LOCAL_STORAGE_COMPLEX_KEY);
              }}
              onDeleteHistoryItem={(timestamp) => {
                const updated = complexityHistory.filter((item) => item.timestamp !== timestamp);
                setComplexityHistory(updated);
                localStorage.setItem(LOCAL_STORAGE_COMPLEX_KEY, JSON.stringify(updated));
              }}
              selectedLanguage={selectedLanguage}
            />
          )}

          {activeTab === "practice" && (
            <PracticeArena
              onGenerateQuiz={handleGenerateQuiz}
              onSubmitSolutionToChat={handleSubmitSolutionToChat}
              selectedLanguage={selectedLanguage}
            />
          )}
        </div>
      </div>
    </div>
  );
}
