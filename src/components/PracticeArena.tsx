import React, { useState } from "react";
import {
  BookOpen,
  Lightbulb,
  Sparkles,
  Play,
  Copy,
  Check,
  Send,
  Loader2,
  Code,
  CheckCircle,
} from "lucide-react";
import { QuizQuestion } from "../types";

interface PracticeArenaProps {
  onGenerateQuiz: (topic: string, difficulty: string) => Promise<QuizQuestion>;
  onSubmitSolutionToChat: (question: QuizQuestion, solution: string) => void;
  selectedLanguage: string;
}

const TOPICS = [
  "Arrays & Hashing",
  "Two Pointers",
  "Sliding Window",
  "Stack & Queue",
  "Binary Search",
  "Linked List",
  "Trees & Graphs",
  "Dynamic Programming",
  "Greedy Algorithms",
  "Recursion & Backtracking",
];

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export default function PracticeArena({
  onGenerateQuiz,
  onSubmitSolutionToChat,
  selectedLanguage,
}: PracticeArenaProps) {
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);
  const [selectedDifficulty, setSelectedDifficulty] = useState(DIFFICULTIES[1]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [solution, setSolution] = useState("");
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setCurrentQuestion(null);
    setShowHint(false);
    setSolution("");
    try {
      const question = await onGenerateQuiz(selectedTopic, selectedDifficulty);
      setCurrentQuestion(question);
      setSolution(question.starterTemplate || "");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyTemplate = () => {
    if (!currentQuestion) return;
    navigator.clipboard.writeText(currentQuestion.starterTemplate);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  const handleSubmitSolution = () => {
    if (!currentQuestion || !solution.trim()) return;
    onSubmitSolutionToChat(currentQuestion, solution);
  };

  return (
    <div className="flex h-full flex-col bg-elegant-bg text-elegant-text-main flex-1">
      {/* Header */}
      <div className="border-b border-elegant-border bg-elegant-sidebar/40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-elegant-border bg-elegant-active text-elegant-accent-hover">
            <BookOpen className="h-5.5 w-5.5" />
          </div>
          <div>
            <h2 className="font-display text-sm font-semibold text-white">Interview Practice Arena</h2>
            <p className="text-[10px] text-elegant-text-sec font-mono font-medium">Solve LeetCode-style questions</p>
          </div>
        </div>

        {/* Selected Language Badge */}
        <div className="flex items-center gap-1.5 rounded-full bg-elegant-active px-3.5 py-1.5 border border-elegant-border text-[10px] font-semibold text-elegant-accent-hover font-mono uppercase tracking-wider">
          <Code className="h-3.5 w-3.5" />
          Active: {selectedLanguage.toUpperCase()}
        </div>
      </div>

      {/* Main Workspace Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Topic and Difficulty selectors */}
        <div className="rounded-xl border border-elegant-border bg-elegant-sidebar/40 p-4 flex flex-wrap items-center gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-elegant-text-sec font-mono">
              Select DSA Topic
            </label>
            <select
              id="quiz-select-topic"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="rounded bg-elegant-active border border-elegant-border px-3 py-1.5 text-xs font-semibold text-elegant-text-bright focus:outline-none min-w-[180px]"
            >
              {TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-elegant-text-sec font-mono">
              Difficulty
            </label>
            <select
              id="quiz-select-difficulty"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="rounded bg-elegant-active border border-elegant-border px-3 py-1.5 text-xs font-semibold text-elegant-text-bright focus:outline-none min-w-[100px]"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end h-full pt-4 sm:pt-0 sm:ml-auto">
            <button
              id="btn-generate-quiz"
              onClick={handleGenerate}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-lg bg-elegant-accent py-2 px-4 text-xs font-semibold text-white shadow transition-all hover:bg-elegant-accent/80 disabled:opacity-40"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Generating Interview Prompt...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-white" />
                  <span>Generate DSA Question</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main interactive split block */}
        {currentQuestion ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left Column: Problem Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-elegant-text-sec font-mono uppercase tracking-wider">
                  Problem Description
                </span>
                <div className="flex gap-2">
                  <span className="rounded bg-elegant-sidebar border border-elegant-border text-[10px] font-semibold text-elegant-accent-hover font-mono px-2 py-0.5">
                    {currentQuestion.topic}
                  </span>
                  <span
                    className={`rounded text-[10px] font-semibold font-mono px-2 py-0.5 ${
                      currentQuestion.difficulty === "Easy"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : currentQuestion.difficulty === "Medium"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}
                  >
                    {currentQuestion.difficulty}
                  </span>
                </div>
              </div>

              {/* Problem Content Container */}
              <div className="rounded-xl border border-elegant-border bg-elegant-sidebar/40 p-5 space-y-4 min-h-[320px]">
                <h3 className="font-display text-lg font-bold text-white tracking-tight">
                  {currentQuestion.title}
                </h3>
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-elegant-text-bright font-sans">
                  {currentQuestion.description}
                </div>

                {/* Collapsible Hint */}
                <div className="border-t border-elegant-border pt-4">
                  {showHint ? (
                    <div className="rounded-lg bg-elegant-active/30 border border-elegant-border p-3.5 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-elegant-accent-hover">
                        <Lightbulb className="h-4 w-4" />
                        <span>Subtle Hint</span>
                      </div>
                      <p className="text-xs text-elegant-text-bright leading-relaxed italic">
                        {currentQuestion.hint}
                      </p>
                    </div>
                  ) : (
                    <button
                      id="btn-show-hint"
                      onClick={() => setShowHint(true)}
                      className="text-xs font-semibold text-elegant-accent-hover hover:text-white transition-colors font-mono flex items-center gap-1"
                    >
                      <Lightbulb className="h-3.5 w-3.5" /> Show Problem Hint
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Code Editor Space */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-elegant-text-sec font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <Code className="h-4 w-4" /> Solution Workspace
                </span>
                <button
                  id="btn-copy-template"
                  onClick={handleCopyTemplate}
                  className="text-xs text-elegant-text-sec hover:text-white font-mono flex items-center gap-1"
                >
                  {copiedTemplate ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied Starter Template!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Starter Template</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code TextArea */}
              <div className="relative rounded-xl border border-elegant-border bg-elegant-sidebar/80 p-2.5 shadow-inner">
                <textarea
                  id="quiz-solution-textarea"
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  placeholder={`// Implement your ${selectedLanguage.toUpperCase()} solution here...`}
                  rows={14}
                  className="w-full resize-none bg-transparent px-3 py-2 font-mono text-xs leading-5 text-white placeholder-elegant-text-sec focus:outline-none"
                />
              </div>

              <button
                id="btn-submit-solution"
                onClick={handleSubmitSolution}
                disabled={!solution.trim()}
                className="flex w-full items-center justify-center gap-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 py-3 px-4 text-xs font-bold text-white shadow shadow-emerald-950/20 active:scale-[0.99] disabled:opacity-40 transition-all cursor-pointer"
              >
                <CheckCircle className="h-4.5 w-4.5" />
                <span>Submit to Tutor for Code Review</span>
              </button>
            </div>
          </div>
        ) : (
          // Empty State Quiz Selection Screen
          <div className="flex flex-col items-center justify-center text-center p-12 max-w-md mx-auto min-h-[300px] space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-elegant-active border border-elegant-border text-elegant-accent-hover flex items-center justify-center shadow">
              <Play className="h-6 w-6 text-elegant-accent-hover fill-elegant-accent-hover" />
            </div>
            <div>
              <h4 className="text-base font-bold text-elegant-text-bright">Ready to Practice?</h4>
              <p className="text-xs text-elegant-text-sec leading-relaxed mt-1.5">
                Generate an interview question on your chosen topic (Easy, Medium, or Hard). You will get a prompt, starter code, and hints. Submit your code, and the tutor will analyze it step-by-step.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
