import React from "react";
import {
  MessageSquare,
  Plus,
  Trash2,
  BookOpen,
  Download,
  Code2,
  RotateCcw,
  Sparkles,
  Terminal,
} from "lucide-react";
import { ChatSession, DSATopic } from "../types";

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: (initialPrompt?: string, title?: string) => void;
  onDeleteSession: (id: string) => void;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  onClearAll: () => void;
}

const PRESET_TOPICS: DSATopic[] = [
  {
    id: "arrays",
    name: "Arrays & Hashing",
    description: "Hash maps, Two-pointers, Sliding Window patterns.",
    difficulty: "All",
    category: "Data Structures",
  },
  {
    id: "linked-lists",
    name: "Linked Lists",
    description: "Singly, Doubly, cycle detection, list reversal.",
    difficulty: "Easy",
    category: "Data Structures",
  },
  {
    id: "trees-graphs",
    name: "Trees & Graphs",
    description: "BFS, DFS, Binary Search Trees, Dijkstra's algorithm.",
    difficulty: "Medium",
    category: "Data Structures",
  },
  {
    id: "dp",
    name: "Dynamic Programming",
    description: "Memoization, Tabulation, Knapsack, and grid paths.",
    difficulty: "Hard",
    category: "Algorithms",
  },
  {
    id: "backtracking",
    name: "Backtracking",
    description: "N-Queens, Sudoku solver, Subsets generation.",
    difficulty: "Medium",
    category: "Algorithms",
  },
  {
    id: "complexity",
    name: "Big-O Notation",
    description: "Master theorem, Space & Time bounds, recurrence.",
    difficulty: "Easy",
    category: "Advanced",
  },
];

const LANGUAGES = [
  { value: "cpp", label: "C++ (GCC 20)" },
  { value: "java", label: "Java 17" },
  { value: "python", label: "Python 3.11" },
  { value: "javascript", label: "JavaScript (ES6)" },
  { value: "typescript", label: "TypeScript 5" },
  { value: "go", label: "Go (Golang)" },
];

export default function Sidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  selectedLanguage,
  onLanguageChange,
  onClearAll,
}: SidebarProps) {
  const exportAllChats = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sessions, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `dsa_tutor_sessions_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  const startTopicPractice = (topic: DSATopic) => {
    const prompt = `Hello Tutor! I would like to learn about "${topic.name}". Could you explain the core concepts of this topic, common LeetCode patterns associated with it, and give a quick interview problem to practice? I prefer using ${LANGUAGES.find((l) => l.value === selectedLanguage)?.label || selectedLanguage}.`;
    onNewSession(prompt, `Study: ${topic.name}`);
  };

  return (
    <div className="flex h-full w-80 flex-col border-r border-elegant-border bg-elegant-sidebar text-elegant-text-main">
      {/* Brand Header */}
      <div className="flex items-center gap-2 border-b border-elegant-border px-5 py-4.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-elegant-accent shadow-md shadow-black/40">
          <Terminal className="h-5.5 w-5.5 text-white" />
        </div>
        <div>
          <h1 className="font-display text-base font-bold tracking-tight text-white flex items-center gap-1.5">
            DSA Tutor AI
            <span className="rounded-full bg-elegant-tag-bg border border-elegant-border px-1.5 py-0.5 text-[10px] font-semibold text-elegant-text-sec">
              v1.0
            </span>
          </h1>
          <p className="text-[11px] text-elegant-text-sec font-mono">Expert DSA Instruction</p>
        </div>
      </div>

      {/* New Session Button */}
      <div className="px-4 py-3">
        <button
          id="btn-new-chat"
          onClick={() => onNewSession(undefined, "New Chat Session")}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-transparent border border-elegant-border py-2.5 px-4 text-sm font-semibold text-elegant-accent-hover transition-all hover:bg-elegant-active active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          <span>New Chat Session</span>
        </button>
      </div>

      {/* Language Selector */}
      <div className="px-4 py-2 border-b border-elegant-border pb-4">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-elegant-text-sec font-mono block mb-1.5">
          Preferred Language
        </label>
        <div className="relative">
          <select
            id="select-language"
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="w-full rounded-lg border border-elegant-border bg-elegant-active px-3 py-2 text-xs font-medium text-elegant-text-bright transition-all hover:border-slate-600 focus:outline-none"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
          <Code2 className="absolute right-3 top-2.5 h-3.5 w-3.5 text-elegant-text-sec pointer-events-none" />
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
        {/* Chat History */}
        <div>
          <div className="px-3 flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-elegant-text-sec font-mono">
              Saved Sessions ({sessions.length})
            </span>
          </div>

          <div className="space-y-1">
            {sessions.length === 0 ? (
              <p className="text-xs text-elegant-text-sec px-3 py-2 italic">No active sessions.</p>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className={`group flex items-center justify-between rounded-lg px-3 py-2 transition-all duration-150 border ${
                    session.id === activeSessionId
                      ? "bg-elegant-active border-elegant-border text-white"
                      : "border-transparent text-elegant-text-main hover:bg-elegant-active/50 hover:text-white"
                  }`}
                >
                  <button
                    id={`session-item-${session.id}`}
                    onClick={() => onSelectSession(session.id)}
                    className="flex flex-1 items-center gap-2 text-left truncate"
                  >
                    <MessageSquare className={`h-4 w-4 shrink-0 ${session.id === activeSessionId ? "text-elegant-accent-hover" : "text-elegant-text-sec"}`} />
                    <span className="text-xs font-medium truncate">{session.title}</span>
                  </button>
                  <button
                    id={`delete-session-${session.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-elegant-text-sec hover:text-rose-400 rounded transition-opacity duration-150"
                    title="Delete session"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Preset Topics */}
        <div>
          <div className="px-3 flex items-center gap-1.5 mb-2">
            <BookOpen className="h-3.5 w-3.5 text-elegant-text-sec" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-elegant-text-sec font-mono">
              DSA Syllabus Starters
            </span>
          </div>

          <div className="space-y-1.5 px-1">
            {PRESET_TOPICS.map((topic) => (
              <button
                key={topic.id}
                id={`preset-topic-${topic.id}`}
                onClick={() => startTopicPractice(topic)}
                className="w-full text-left rounded-lg bg-elegant-active/30 hover:bg-elegant-active/80 border border-elegant-border p-2.5 transition-all group"
              >
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-xs font-semibold text-slate-300 group-hover:text-elegant-accent-hover transition-colors">
                    {topic.name}
                  </span>
                  <span
                    className={`text-[9px] px-1 rounded font-mono border ${
                      topic.difficulty === "Easy"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : topic.difficulty === "Medium"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : topic.difficulty === "Hard"
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        : "bg-elegant-tag-bg text-elegant-text-sec border-elegant-border"
                    }`}
                  >
                    {topic.difficulty}
                  </span>
                </div>
                <p className="text-[10px] text-elegant-text-sec leading-normal">{topic.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="border-t border-elegant-border p-3 bg-elegant-sidebar space-y-1.5">
        <button
          id="btn-export-all"
          onClick={exportAllChats}
          className="flex w-full items-center gap-2 rounded-md py-1.5 px-3 text-[11px] font-medium text-elegant-text-sec hover:bg-elegant-active hover:text-white transition-colors"
        >
          <Download className="h-3.5 w-3.5 text-elegant-text-sec" />
          <span>Export All Conversations</span>
        </button>
        <button
          id="btn-clear-all"
          onClick={onClearAll}
          className="flex w-full items-center gap-2 rounded-md py-1.5 px-3 text-[11px] font-medium text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5 text-rose-500/70" />
          <span>Clear Storage & Reset</span>
        </button>
      </div>
    </div>
  );
}
