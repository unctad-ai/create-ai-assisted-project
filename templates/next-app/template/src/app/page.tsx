import React from 'react';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">React Application</h1>
      <p className="text-xl mb-8">AI-Enhanced Development Project</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <div className="border rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <ol className="space-y-3 list-decimal pl-5">
            <li>
              <strong>Open your AI coding assistant</strong> (Claude Code, Windsurf, Cursor, etc.)
            </li>
            <li>
              <strong>Ask it to read project guidelines:</strong><br />
              <code className="bg-gray-100 p-1 rounded block mt-1 text-sm">
                Please read the AI_ASSISTANT.md file in this project
              </code>
            </li>
            <li>
              <strong>Start planning your project:</strong><br />
              <code className="bg-gray-100 p-1 rounded block mt-1 text-sm">
                Help me plan this project: [your description]
              </code>
            </li>
            <li>
              <strong>Begin implementation:</strong><br />
              <code className="bg-gray-100 p-1 rounded block mt-1 text-sm">
                Let's implement the next task
              </code>
            </li>
          </ol>
        </div>
        
        <div className="border rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Project Resources</h2>
          <p className="mb-3">Key files for AI-assisted development:</p>
          <ul className="space-y-2 list-disc pl-5">
            <li>
              <strong className="font-medium">AI_ASSISTANT.md</strong> - Guidelines for AI tools
            </li>
            <li>
              <strong className="font-medium">project-docs/</strong> - Project documentation
            </li>
            <li>
              <strong className="font-medium">memory.md</strong> - Project state tracker
            </li>
            <li>
              <strong className="font-medium">todo.md</strong> - Development tasks
            </li>
          </ul>
          <p className="mt-4 text-sm text-gray-600">
            This project uses Next.js with App Router, TypeScript, and Tailwind CSS.
          </p>
        </div>
      </div>
    </div>
  );
}