# DSA Tutor AI - Interactive Chatbot & Workspace

A modern, highly polished, dark-themed AI chatbot and interactive playground built using **React (Vite)**, **Tailwind CSS**, and **Express**, powered by the **Google Gemini 3.5 Flash** model. 

This application translates complex Data Structures and Algorithms (DSA) concepts into progressive, easily digestible intuition guides, optimizes Big-O performance bounds, detects code logical traps/bugs, and lets you practice technical interviews dynamically.

---

## Key Features

1. **AI Coaching Chatbot (Multi-Turn)**:
   - Maintains chat history and saves it to local browser storage (`localStorage`).
   - Dynamically renders code blocks, formatting headers, lists, and highlighting space-time bounds (e.g. **O(N log N)**) in inline badges.
   - Provides options to study preset templates like Arrays, Linked Lists, Trees, Graphs, DP, or Backtracking.
   - Allows exporting chat logs as JSON.

2. **Big-O Complexity Analyzer**:
   - Paste algorithms or loop structures directly in **C++**, **Java**, **Python**, **Go**, or **JS/TS**.
   - Get step-by-step runtime and space complexity calculations with detailed optimizations.
   - Maintains a local history panel to quickly re-evaluate past submissions.

3. **Technical Interview Arena**:
   - Generates interview/LeetCode-style coding questions based on selected DSA topics and difficulty bounds.
   - Includes problem statements, constraints, sample inputs, progressive hinting, and starter code templates.
   - Features a **Submit Solution to Tutor** pipeline that sends your code directly into the coaching chatbot for LeetCode grading, edge-case analysis, and code formatting tips!

---

## Folder Structure

```text
├── .env.example            # Environment variables setup (contains Gemini API key placeholder)
├── .gitignore              # Ignores local node_modules, build artifacts, and secrets
├── index.html              # Main HTML mounting container
├── metadata.json           # Application configurations and permissions
├── package.json            # Node.json dependency manifest and scripts
├── server.ts               # Express server entrypoint (proxies Gemini API and serves built UI)
├── vite.config.ts          # Vite build configurations with Tailwind plugins
├── tsconfig.json           # TypeScript configuration parameters
└── src/
    ├── main.tsx            # Main React mount entrypoint
    ├── App.tsx             # Main React application shell and state coordinator
    ├── index.css           # Global custom styled themes (Inter, JetBrains Mono, Space Grotesk fonts)
    ├── types.ts            # Enums and Typescript interfaces
    └── components/
        ├── Sidebar.tsx             # Session histories, languages, and study starters
        ├── ChatContainer.tsx       # Scrolling message logs, loading animations, and quick prompts
        ├── ComplexityAnalyzer.tsx  # Big-O code textareas and complexity reports
        ├── PracticeArena.tsx       # Live problem challenges, hinting, and review triggers
        └── MarkdownRenderer.tsx    # Technical custom parser for formatted text and syntax codes
```

---

## Local Setup & Run Instructions

To run this application seamlessly in your local environment via **VS Code**:

### Prerequisites
- Make sure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).
- Get a **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/).

### Step 1: Open project in VS Code
Open your VS Code and use `File > Open Folder...` to select the root directory of this project.

### Step 2: Configure Environment Variables
1. Duplicate the `.env.example` file and rename it to `.env` in the root folder.
2. Edit `.env` and paste your Gemini API Key:
   ```env
   GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"
   ```

### Step 3: Install Dependencies
Open your VS Code terminal (`Ctrl + \`` or ``Cmd + \``) and run:
```bash
npm install
```

### Step 4: Run the Application in Development Mode
To start the live full-stack Express server with Vite HMR middleware, run:
```bash
npm run dev
```
The server will boot up quickly:
```text
DSA Chatbot Server running on http://localhost:3000
```
Open [http://localhost:3000](http://localhost:3000) in your web browser. You can edit code in VS Code, and the changes will refresh instantly!

### Step 5: Build and Run in Production Mode (Optional)
To test how the application runs in a production container or standalone Node deployment, run:
```bash
# Compile client-side code and bundle server.ts with esbuild
npm run build

# Start the compiled self-contained server
npm run start
```
Go to [http://localhost:3000](http://localhost:3000) to view the compiled static bundle!

---

## Technology Stack
- **Framework**: React 19, TypeScript
- **Bundler / Compilers**: Vite 6, Esbuild, TSX
- **Styles**: Tailwind CSS v4, Lucide Icons
- **Backend API**: Node.js, Express
- **AI Core**: `@google/genai` (SDK utilizing `gemini-3.5-flash` model)
