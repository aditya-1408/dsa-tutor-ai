import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  Terminal,
  Code2,
  Bug,
  Brain,
  MessageSquareCode,
  ArrowRight,
  User,
  Loader2,
} from "lucide-react";
import { Message } from "../types";
import MarkdownRenderer from "./MarkdownRenderer";

interface ChatContainerProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  selectedLanguage: string;
}

const THINKING_PHASES = [
  "Analyzing algorithm structures...",
  "Calculating worst-case Time Complexity...",
  "Consulting DSA handbook...",
  "Formulating optimized solutions...",
  "Verifying recursive base-cases...",
  "Constructing clean Big-O analysis...",
];

export default function ChatContainer({
  messages,
  onSendMessage,
  isLoading,
  selectedLanguage,
}: ChatContainerProps) {
  const [input, setInput] = useState("");
  const [thinkingPhase, setThinkingPhase] = useState(THINKING_PHASES[0]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cycle thinking helper messages when loading
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      let step = 0;
      setThinkingPhase(THINKING_PHASES[0]);
      interval = setInterval(() => {
        step = (step + 1) % THINKING_PHASES.length;
        setThinkingPhase(THINKING_PHASES[step]);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Scroll to bottom when messages list updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const starterPrompts = [
    {
      title: "Complexity Master",
      desc: "Analyze recursive code and state its Big-O space and time complexity.",
      icon: <Brain className="h-4.5 w-4.5 text-indigo-400" />,
      prompt: "Can you explain how to analyze the time and space complexity of a recursive binary search algorithm?",
    },
    {
      title: "Linked List Cycle Detection",
      desc: "Intuition behind Floyd's Tortoise and Hare algorithm.",
      icon: <Code2 className="h-4.5 w-4.5 text-indigo-400" />,
      prompt: "Explain how Floyd's cycle detection algorithm works under the hood. Show C++ code for detecting a cycle.",
    },
    {
      title: "DP Tabulation vs Memoization",
      desc: "Learn top-down vs bottom-up techniques using Fibonacci.",
      icon: <MessageSquareCode className="h-4.5 w-4.5 text-indigo-400" />,
      prompt: "What is the difference between Memoization (Top-down) and Tabulation (Bottom-up) in Dynamic Programming? Please explain using a clear problem.",
    },
    {
      title: "Debug Binary Search",
      desc: "Find standard off-by-one errors in binary boundary loops.",
      icon: <Bug className="h-4.5 w-4.5 text-rose-400" />,
      prompt: "I am getting an infinite loop in my binary search implementation. Can you point out the most common bugs in boundary updates (mid, low, high)?",
    },
  ];

  return (
    <div className="flex h-full flex-col bg-elegant-bg text-elegant-text-main flex-1">
      {/* Container Header */}
      <div className="flex items-center justify-between border-b border-elegant-border bg-elegant-sidebar/40 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-elegant-border bg-elegant-active">
              <Sparkles className="h-5 w-5 text-elegant-accent-hover animate-pulse-slow" />
            </div>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-elegant-bg" />
          </div>
          <div>
            <h2 className="font-display text-sm font-semibold text-white flex items-center gap-2">
              DSA AI Tutor
            </h2>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-elegant-text-sec">
              <span>Online Session</span>
              <span className="h-1 w-1 rounded-full bg-elegant-border" />
              <span>Model: gemini-3.5-flash</span>
            </div>
          </div>
        </div>

        {/* Selected Language Badge */}
        <div className="flex items-center gap-2 rounded-full bg-elegant-active px-3.5 py-1.5 border border-elegant-border">
          <Terminal className="h-3.5 w-3.5 text-elegant-accent-hover" />
          <span className="text-xs font-mono font-medium text-elegant-text-bright">
            {selectedLanguage.toUpperCase()} MODE
          </span>
        </div>
      </div>

      {/* Main Messages Panel */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.length === 0 ? (
          // Welcome Screen / Empty State
          <div className="mx-auto max-w-2xl pt-8 pb-12 space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-elegant-active border border-elegant-border text-elegant-accent-hover mb-2">
                <Brain className="h-6.5 w-6.5" />
              </div>
              <h3 className="font-display text-2xl font-bold tracking-tight text-white">
                Master Data Structures & Algorithms
              </h3>
              <p className="text-elegant-text-sec text-sm max-w-lg mx-auto">
                Ask coding questions, explore optimized layouts, calculate space-time complexity, or debug code templates with your dedicated DSA mentor.
              </p>
            </div>

            {/* Quick Prompts Starters */}
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {starterPrompts.map((preset, idx) => (
                <button
                  key={idx}
                  id={`starter-prompt-${idx}`}
                  onClick={() => onSendMessage(preset.prompt)}
                  className="group relative flex flex-col text-left rounded-xl border border-elegant-border bg-elegant-sidebar/30 p-4 transition-all hover:-translate-y-0.5 hover:border-elegant-accent/30 hover:bg-elegant-active"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="rounded-lg bg-elegant-sidebar p-1.5 border border-elegant-border">
                      {preset.icon}
                    </span>
                    <span className="text-xs font-bold text-elegant-text-bright group-hover:text-elegant-accent-hover transition-colors">
                      {preset.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-elegant-text-sec leading-normal mb-6 flex-1">
                    {preset.desc}
                  </p>
                  <div className="absolute bottom-3 right-4 flex items-center gap-1 font-mono text-[9px] font-semibold text-elegant-text-sec group-hover:text-elegant-accent-hover transition-colors">
                    <span>Ask Tutor</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </button>
              ))}
            </div>

            {/* Platform Constraints Card */}
            <div className="rounded-xl bg-elegant-sidebar/40 border border-elegant-border p-4 flex items-start gap-3">
              <Terminal className="h-5 w-5 text-elegant-accent-hover shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-elegant-text-bright mb-1">Interactive DSA Tutor Guide</h4>
                <p className="text-[11px] text-elegant-text-sec leading-relaxed">
                  Provide your code snippet, problem statement, or request hints. The tutor will provide detailed walkthroughs, space complexity calculations, and clean programming solutions.
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Messages Feed
          <div className="space-y-6 max-w-3xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* Assistant Icon */}
                {message.role === "assistant" && (
                  <div className="flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-lg border border-elegant-border bg-elegant-active">
                    <Brain className="h-4.5 w-4.5 text-elegant-accent-hover" />
                  </div>
                )}

                {/* Bubble Container */}
                <div
                  className={`relative flex max-w-[85%] flex-col rounded-xl px-4 py-3 border ${
                    message.role === "user"
                      ? "bg-elegant-accent border-elegant-border text-white font-medium"
                      : "bg-elegant-active/40 border-elegant-border text-elegant-text-bright"
                  }`}
                >
                  {/* Timestamp/Role Header */}
                  <div className="flex items-center justify-between gap-8 mb-1.5">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-elegant-text-sec">
                      {message.role === "user" ? "You" : "DSA Tutor AI"}
                    </span>
                    <span className="font-mono text-[9px] text-elegant-text-sec/80">
                      {message.timestamp}
                    </span>
                  </div>

                  {/* Bubble Content */}
                  {message.role === "user" ? (
                    <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-white">
                      {message.content}
                    </p>
                  ) : (
                    <MarkdownRenderer content={message.content} />
                  )}
                </div>

                {/* User Icon */}
                {message.role === "user" && (
                  <div className="flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-lg border border-elegant-border bg-elegant-active text-elegant-text-main">
                    <User className="h-4.5 w-4.5" />
                  </div>
                )}
              </div>
            ))}

            {/* Inline AI Thinking Overlay */}
            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-elegant-border bg-elegant-active">
                  <Brain className="h-4.5 w-4.5 text-elegant-accent-hover animate-pulse" />
                </div>
                <div className="flex max-w-[85%] flex-col rounded-xl px-4 py-3 bg-elegant-active/40 border border-elegant-border">
                  <div className="flex items-center gap-2.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-elegant-accent-hover" />
                    <span className="text-xs font-mono text-elegant-accent-hover">{thinkingPhase}</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Submit Bar */}
      <div className="border-t border-elegant-border bg-elegant-bg p-4">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="relative flex items-end rounded-xl border border-elegant-border bg-elegant-active shadow-lg transition-all focus-within:border-elegant-accent">
            <textarea
              id="chat-textarea"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask anything about DSA or LeetCode in ${selectedLanguage.toUpperCase()}... (Enter to send, Shift+Enter for newline)`}
              rows={Math.min(6, input.split("\n").length || 1)}
              className="w-full resize-none bg-transparent px-4 py-3.5 text-sm text-white placeholder-elegant-text-sec focus:outline-none focus:ring-0 leading-relaxed font-sans"
              disabled={isLoading}
            />
            <div className="flex items-center gap-2 p-2 shrink-0">
              <button
                id="btn-submit-chat"
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-elegant-accent hover:bg-elegant-accent/80 text-white shadow transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                title="Send message"
              >
                {isLoading ? (
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <div className="mt-1.5 flex items-center justify-between px-1">
            <span className="text-[10px] text-elegant-text-sec font-mono">
              Press Enter to Submit • Shift+Enter for Newlines
            </span>
            <span className="text-[10px] text-elegant-text-sec hover:text-elegant-accent-hover transition-colors cursor-pointer font-mono flex items-center gap-1">
              <Terminal className="h-3 w-3" /> DSA Mode Enabled
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
