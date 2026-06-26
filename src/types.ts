export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  language: string;
  createdAt: string;
}

export interface DSATopic {
  id: string;
  name: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard" | "All";
  category: "Data Structures" | "Algorithms" | "Advanced";
}

export interface QuizQuestion {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  description: string;
  hint: string;
  starterTemplate: string;
}

export interface ComplexityResult {
  code: string;
  language: string;
  analysis: string;
  timestamp: string;
}
