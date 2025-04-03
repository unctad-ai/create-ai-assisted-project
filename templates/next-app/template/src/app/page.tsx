import React from 'react';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">React Application</h1>
      <p className="text-xl mb-8">AI-Enhanced Development Project</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <div className="border rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Project Resources</h2>
          <ul className="space-y-2">
            <li>
              <a href="/project-docs/guidelines/development.md" className="text-blue-500 hover:underline">
                Development Guidelines
              </a>
            </li>
            <li>
              <a href="/project-docs/guidelines/review.md" className="text-blue-500 hover:underline">
                Review Guidelines
              </a>
            </li>
            <li>
              <a href="/memory.md" className="text-blue-500 hover:underline">Project Memory</a>
            </li>
            <li>
              <a href="/todo.md" className="text-blue-500 hover:underline">Todo List</a>
            </li>
          </ul>
        </div>
        
        <div className="border rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <p className="mb-4">
            This project uses Next.js with App Router, TypeScript, shadcn/ui, and Tailwind CSS.
          </p>
          <p>
            Edit <code className="bg-gray-100 p-1 rounded">src/app/page.tsx</code> to get started.
          </p>
        </div>
      </div>
    </div>
  );
}