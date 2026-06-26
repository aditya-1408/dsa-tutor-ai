import React, { useState } from "react";
import {
  Brain,
  Code,
  Sparkles,
  History,
  Trash2,
  Clock,
  Zap,
  Check,
  Copy,
} from "lucide-react";
import { ComplexityResult } from "../types";
import MarkdownRenderer from "./MarkdownRenderer";

interface ComplexityAnalyzerProps {
  onAnalyze: (code: string, lang: string) => Promise<string>;
  history: ComplexityResult[];
  onClearHistory: () => void;
  onDeleteHistoryItem: (timestamp: string) => void;
  selectedLanguage: string;
}

export default function ComplexityAnalyzer({
  onAnalyze,
  history,
  onClearHistory,
  onDeleteHistoryItem,
  selectedLanguage,
}: ComplexityAnalyzerProps) {
  const [code, setCode] = useState("");
  const [lang, setLang] = useState(selectedLanguage);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    if (!code.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setCurrentAnalysis(null);
    try {
      const result = await onAnalyze(code, lang);
      setCurrentAnalysis(result);
    } catch (err) {
      console.error(err);
      setCurrentAnalysis("Failed to compile analysis. Please check your network connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadPastAnalysis = (past: ComplexityResult) => {
    setCode(past.code);
    setLang(past.language);
    setCurrentAnalysis(past.analysis);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-full flex-col bg-elegant-bg text-elegant-text-main flex-1">
      {/* Header */}
      <div className="border-b border-elegant-border bg-elegant-sidebar/40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-elegant-border bg-elegant-active text-elegant-accent-hover">
            <Clock className="h-5.5 w-5.5" />
          </div>
          <div>
            <h2 className="font-display text-sm font-semibold text-white">Big-O Analyzer</h2>
            <p className="text-[10px] text-elegant-text-sec font-mono">Calculate Time & Space Bounds</p>
          </div>
        </div>

        {/* Feature badge */}
        <div className="flex items-center gap-1.5 rounded-full bg-elegant-active px-3 py-1 border border-elegant-border text-[10px] font-semibold text-elegant-text-bright uppercase tracking-wider font-mono">
          <Zap className="h-3 w-3 text-amber-400" />
          Complexity Calculator
        </div>
      </div>

      {/* Workspace Panel Split */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left panel: Code input */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-elegant-text-sec font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Code className="h-4 w-4" /> Code Workspace
              </span>
              <div className="flex gap-2">
                <select
                  id="analyzer-select-language"
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="rounded bg-elegant-active border border-elegant-border px-2 py-1 text-[11px] font-semibold text-elegant-text-bright focus:outline-none"
                >
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="go">Go</option>
                </select>
                {code.trim() && (
                  <button
                    id="btn-copy-code-analyzer"
                    onClick={handleCopyCode}
                    className="rounded bg-elegant-active border border-elegant-border p-1.5 text-xs text-elegant-text-sec hover:text-white flex items-center gap-1"
                    title="Copy code"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                )}
              </div>
            </div>

            {/* Code Textarea editor look */}
            <div className="relative rounded-lg border border-elegant-border bg-elegant-sidebar/80 p-2 focus-within:border-elegant-accent shadow-inner">
              <textarea
                id="analyzer-code-textarea"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`// Paste your loop, recurrence, or LeetCode function template here...
// Example:
int fib(int n) {
    if (n <= 1) return n;
    return fib(n-1) + fib(n-2);
}`}
                rows={12}
                className="w-full resize-none bg-transparent px-3 py-2 font-mono text-xs leading-5 text-white placeholder-elegant-text-sec focus:outline-none"
              />
            </div>

            <button
              id="btn-analyze-complexity"
              onClick={handleAnalyze}
              disabled={!code.trim() || isAnalyzing}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-elegant-accent hover:bg-elegant-accent/80 py-2.5 px-4 text-xs font-semibold text-white shadow transition-all disabled:opacity-40"
            >
              {isAnalyzing ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Synthesizing Complexity Bounds...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-white" />
                  <span>Calculate Big-O Complexity</span>
                </>
              )}
            </button>

            {/* Analysis History */}
            {history.length > 0 && (
              <div className="rounded-xl border border-elegant-border bg-elegant-sidebar/40 p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-elegant-border">
                  <span className="text-xs font-semibold text-elegant-text-sec font-mono uppercase tracking-wider flex items-center gap-1.5">
                    <History className="h-4 w-4 text-elegant-text-sec" /> Past Calculations ({history.length})
                  </span>
                  <button
                    id="btn-clear-history"
                    onClick={onClearHistory}
                    className="text-[10px] text-rose-400 hover:text-rose-300 font-mono transition-colors"
                  >
                    Clear All
                  </button>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {history.map((item, idx) => (
                    <div
                      key={item.timestamp}
                      className="group flex items-center justify-between rounded bg-elegant-active/30 hover:bg-elegant-active/80 px-2.5 py-1.5 border border-elegant-border transition-all text-xs"
                    >
                      <button
                        id={`past-analysis-item-${idx}`}
                        onClick={() => loadPastAnalysis(item)}
                        className="flex-1 text-left truncate text-elegant-text-main hover:text-elegant-accent-hover font-mono"
                      >
                        {item.code.slice(0, 30)}... ({item.language.toUpperCase()})
                      </button>
                      <button
                        id={`delete-history-item-${idx}`}
                        onClick={() => onDeleteHistoryItem(item.timestamp)}
                        className="opacity-0 group-hover:opacity-100 p-0.5 text-elegant-text-sec hover:text-rose-400 transition-opacity"
                        title="Delete item"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right panel: Analysis Output */}
          <div className="space-y-4">
            <span className="text-xs font-semibold text-elegant-text-sec font-mono uppercase tracking-wider flex items-center gap-1.5">
              <Brain className="h-4 w-4" /> Complexity Report
            </span>

            <div className="rounded-xl border border-elegant-border bg-elegant-sidebar/40 p-5 min-h-[360px] flex flex-col shadow-inner">
              {currentAnalysis ? (
                <div className="flex-1 overflow-y-auto">
                  <MarkdownRenderer content={currentAnalysis} />
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="h-12 w-12 rounded-full bg-elegant-active flex items-center justify-center border border-elegant-border">
                    <Clock className="h-5 w-5 text-elegant-text-sec" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-elegant-text-bright">Awaiting Code Input</h4>
                    <p className="text-[11px] text-elegant-text-sec max-w-xs mt-1">
                      Paste your code on the left and trigger the Big-O Calculator. It will output precise recursion-tree analysis, auxiliary allocations, and performance tips.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
