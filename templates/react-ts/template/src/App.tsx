import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <header className="app-header">
        <h1>React Application</h1>
        <p>AI-Enhanced Development Project</p>
      </header>

      <main className="app-main">
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            Count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>

        <div className="resources">
          <h2>Getting Started with AI</h2>
          <div className="guide">
            <ol>
              <li>
                <strong>Open your AI coding assistant</strong> (Claude Code, Windsurf, Cursor, etc.)
              </li>
              <li>
                <strong>Ask it to read guidelines:</strong>
                <code>Please read the AI_ASSISTANT.md file in this project</code>
              </li>
              <li>
                <strong>Start planning:</strong>
                <code>Help me plan this project: [your description]</code>
              </li>
              <li>
                <strong>Begin implementation:</strong>
                <code>Let's implement the next task</code>
              </li>
            </ol>
          </div>
          <div className="key-files">
            <h3>Project Resources</h3>
            <ul>
              <li><strong>AI_ASSISTANT.md</strong> - AI guidelines</li>
              <li><strong>project-docs/</strong> - Documentation</li>
              <li><strong>memory.md</strong> - Project state</li>
              <li><strong>todo.md</strong> - Task tracking</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
