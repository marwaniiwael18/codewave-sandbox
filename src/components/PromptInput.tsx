'use client';

import { useState } from 'react';
import { PromptInputProps } from '@/types';

export default function PromptInput({ onSubmit, loading = false }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !loading) {
      onSubmit(prompt);
    }
  };

  const examplePrompts = [
    "Create a login page with email and password fields",
    "Build a responsive navbar with dark theme",
    "Generate a React component for a todo list",
    "Create a pricing table with three tiers",
    "Build a contact form with validation"
  ];

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to build... (e.g., 'create a login page with email + password + dark theme')"
            className="w-full px-4 py-4 text-gray-700 bg-white border-2 border-gray-200 rounded-lg resize-none focus:outline-none focus:border-blue-500 transition-colors"
            rows={4}
            disabled={loading}
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
            {prompt.length}/1000
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Try one of these examples:
          </div>
          <button
            type="submit"
            disabled={!prompt.trim() || loading}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              loading || !prompt.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Generating...</span>
              </div>
            ) : (
              'Generate Code'
            )}
          </button>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {examplePrompts.map((example, index) => (
          <button
            key={index}
            onClick={() => handleExampleClick(example)}
            disabled={loading}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}