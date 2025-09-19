'use client';

import { useState } from 'react';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  loading: boolean;
  error: string | null;
}

export default function PromptInput({ onSubmit, loading, error }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [focusState, setFocusState] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !loading) {
      onSubmit(prompt.trim());
      setPrompt('');
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Mobile-Optimized Input Area */}
      <div className="flex-1 flex flex-col p-4 md:p-6 space-y-4">
        {/* Quick Prompt Examples - Mobile First */}
        <div className="space-y-2">
          <p className="text-sm text-gray-400 flex items-center">
            <span className="mr-2">💡</span>
            Try these examples:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              "Build a React todo app",
              "Create a Python web scraper",
              "Make a CSS animation library",
              "Design a Node.js API server"
            ].map((example, index) => (
              <button
                key={index}
                onClick={() => setPrompt(example)}
                className="text-left p-3 text-xs bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg text-purple-300 hover:text-purple-200 transition-all duration-200 hover:border-purple-400/40 hover:scale-[1.02]"
              >
                <span className="mr-2">⚡</span>
                {example}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>

        {/* Main Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
          <div className="relative flex-1 min-h-[120px] md:min-h-[200px]">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onFocus={() => setFocusState(true)}
              onBlur={() => setFocusState(false)}
              placeholder="🚀 Describe your project... What would you like to build?"
              className={`w-full h-full p-4 bg-black/40 border rounded-xl text-white placeholder-gray-400 resize-none transition-all duration-300 ${
                focusState
                  ? 'border-purple-400/60 bg-black/60 shadow-lg shadow-purple-500/10'
                  : 'border-purple-500/30 hover:border-purple-400/50'
              }`}
              disabled={loading}
            />
            <div className="absolute bottom-3 right-3 flex items-center space-x-2">
              <span className="text-xs text-gray-500">
                {prompt.length} chars
              </span>
              {prompt.length > 0 && (
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              )}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <div className="flex items-center space-x-2 text-red-400">
                <span>🚨</span>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!prompt.trim() || loading}
            className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
              loading
                ? 'bg-purple-600/50 cursor-not-allowed'
                : prompt.trim()
                ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 shadow-lg hover:shadow-purple-500/25 transform hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-gray-700/60 cursor-not-allowed'
            } text-white relative overflow-hidden`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm md:text-base">Creating your project...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg">🎯</span>
                <span className="text-sm md:text-base">Generate Project</span>
                <div className="hidden md:block bg-white/20 px-2 py-1 rounded text-xs">
                  Enter ↵
                </div>
              </div>
            )}
            
            {/* Animated Background Effect */}
            {!loading && prompt.trim() && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            )}
          </button>

          {/* Mobile Tips */}
          <div className="md:hidden bg-black/20 rounded-lg p-3 space-y-2">
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <span>💡</span>
              <span>Pro tips for mobile:</span>
            </div>
            <div className="space-y-1 text-xs text-gray-500">
              <p>• Be specific about what you want to build</p>
              <p>• Mention frameworks you prefer (React, Vue, etc.)</p>
              <p>• Include styling preferences (Tailwind, CSS, etc.)</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}