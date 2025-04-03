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
          <h2>Project Resources</h2>
          <ul>
            <li>
              <a href="/project-docs/guidelines/development.md">
                Development Guidelines
              </a>
            </li>
            <li>
              <a href="/project-docs/guidelines/review.md">
                Review Guidelines
              </a>
            </li>
            <li>
              <a href="/memory.md">Project Memory</a>
            </li>
            <li>
              <a href="/todo.md">Todo List</a>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;
