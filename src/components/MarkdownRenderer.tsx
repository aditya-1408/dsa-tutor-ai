import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  // Split content by code blocks: ```[lang] ... ```
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3 font-sans text-[15px] leading-relaxed text-elegant-text-main">
      {parts.map((part, index) => {
        if (part.startsWith("```")) {
          // Extract language and code
          const match = part.match(/```(\w*)\n([\s\S]*?)```/);
          const lang = match ? match[1] : "code";
          const code = match ? match[2].trim() : part.slice(3, -3).trim();

          return (
            <div
              key={index}
              id={`code-block-${index}`}
              className="my-4 overflow-hidden rounded-lg border border-elegant-border bg-elegant-sidebar/90 shadow-lg shadow-black/30"
            >
              <div className="flex items-center justify-between bg-elegant-active px-4 py-2 text-xs font-mono text-elegant-text-sec border-b border-elegant-border">
                <span className="uppercase tracking-wider font-semibold text-elegant-accent-hover">
                  {lang || "code"}
                </span>
                <button
                  id={`btn-copy-${index}`}
                  onClick={() => copyToClipboard(code, index)}
                  className="flex items-center gap-1 text-elegant-text-sec hover:text-white transition-colors duration-150 cursor-pointer"
                  title="Copy code to clipboard"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <div className="overflow-x-auto p-4 font-mono text-sm leading-6 text-white">
                <pre>
                  <code>{code}</code>
                </pre>
              </div>
            </div>
          );
        } else {
          // Render plain markdown: headers, bold text, lists, linebreaks
          const lines = part.split("\n");
          return (
            <div key={index} className="space-y-2">
              {lines.map((line, lineIdx) => {
                const trimmed = line.trim();

                if (!trimmed) {
                  return <div key={lineIdx} className="h-2" />;
                }

                // Headers
                if (trimmed.startsWith("### ")) {
                  return (
                    <h4 key={lineIdx} className="text-base font-semibold text-elegant-accent-hover pt-2 font-display">
                      {parseInlineMarkdown(trimmed.slice(4))}
                    </h4>
                  );
                }
                if (trimmed.startsWith("## ")) {
                  return (
                    <h3 key={lineIdx} className="text-lg font-bold text-white border-b border-elegant-border pb-1 pt-3 font-display">
                      {parseInlineMarkdown(trimmed.slice(3))}
                    </h3>
                  );
                }
                if (trimmed.startsWith("# ")) {
                  return (
                    <h2 key={lineIdx} className="text-xl font-extrabold text-white pt-4 pb-2 font-display tracking-tight">
                      {parseInlineMarkdown(trimmed.slice(2))}
                    </h2>
                  );
                }

                // Bullet Lists
                if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                  return (
                    <div key={lineIdx} className="flex items-start gap-2 pl-4 py-0.5">
                      <span className="text-elegant-accent-hover mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-elegant-accent-hover" />
                      <p className="text-elegant-text-main">
                        {parseInlineMarkdown(trimmed.slice(2))}
                      </p>
                    </div>
                  );
                }

                // Numbered Lists (1. Item)
                if (/^\d+\.\s/.test(trimmed)) {
                  const match = trimmed.match(/^(\d+)\.\s(.*)/);
                  const num = match ? match[1] : "1";
                  const text = match ? match[2] : trimmed;
                  return (
                    <div key={lineIdx} className="flex items-start gap-2 pl-4 py-0.5">
                      <span className="font-mono text-xs font-semibold text-elegant-accent-hover mt-1 shrink-0">
                        {num}.
                      </span>
                      <p className="text-elegant-text-main">
                        {parseInlineMarkdown(text)}
                      </p>
                    </div>
                  );
                }

                // Normal Paragraph
                return (
                  <p key={lineIdx} className="text-elegant-text-main leading-relaxed py-0.5">
                    {parseInlineMarkdown(line)}
                  </p>
                );
              })}
            </div>
          );
        }
      })}
    </div>
  );
}

// Helper to parse bold, inline code, and highlights
function parseInlineMarkdown(text: string): React.ReactNode[] {
  // Regex pattern for bold **bold** or inline code `code`
  const regex = /(\*\*.*?\*\*|`.*?`)/g;
  const parts = text.split(regex);

  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const boldText = part.slice(2, -2);
      // Highlight complexity values uniquely
      if (/^[OΘΩ]\(.*\)$/i.test(boldText) || boldText.includes("Complexity") || boldText.includes("Time") || boldText.includes("Space")) {
        return (
          <span key={idx} className="mx-0.5 inline-block rounded bg-elegant-active px-1.5 py-0.5 text-xs font-mono font-semibold text-elegant-accent-hover border border-elegant-border">
            {boldText}
          </span>
        );
      }
      return <strong key={idx} className="font-bold text-white">{boldText}</strong>;
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={idx} className="mx-0.5 rounded bg-elegant-sidebar px-1.5 py-0.5 font-mono text-xs text-elegant-accent-hover border border-elegant-border">
          {part.slice(1, -1)}
        </code>
      );
    }

    return <span key={idx}>{part}</span>;
  });
}
