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
    "Create a React dashboard with TypeScript and charts",
    "Build a Node.js REST API with authentication",
    "Generate a Next.js e-commerce site with Stripe",
    "Create a Vue.js todo app with dark theme",
    "Build a Python Flask API with database"
  ];

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your project... (e.g., 'Create a modern React dashboard with dark theme, charts, and user authentication')"
              className="w-full px-6 py-6 text-gray-100 bg-gray-800/90 backdrop-blur-sm border border-gray-600/50 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 placeholder-gray-400 font-medium"
              rows={4}
              disabled={loading}
            />
            <div className="absolute bottom-4 right-4 flex items-center space-x-3">
              <div className="text-xs text-gray-500">
                {prompt.length}/2000
              </div>
              <div className="w-px h-4 bg-gray-600"></div>
              <div className="text-xs text-gray-400 flex items-center space-x-1">
                <span>⚡</span>
                <span>AI Ready</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400 flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span>Try these examples:</span>
          </div>
          <button
            type="submit"
            disabled={!prompt.trim() || loading}
            className={`group px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 ${
              loading || !prompt.trim()
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600'
                : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 border border-purple-500/30'
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Generating Magic...</span>
              </>
            ) : (
              <>
                <span className="text-lg">✨</span>
                <span>Generate Code</span>
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <span className="text-xs">→</span>
                </div>
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 flex flex-wrap gap-3">
        {examplePrompts.map((example, index) => (
          <button
            key={index}
            onClick={() => handleExampleClick(example)}
            disabled={loading}
            className="px-4 py-2 text-sm bg-gray-700/50 backdrop-blur-sm text-gray-300 rounded-xl hover:bg-gray-600/60 hover:text-white transition-all duration-200 border border-gray-600/30 hover:border-gray-500/50 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transform"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}