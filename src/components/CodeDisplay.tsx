'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CodeDisplayProps } from '@/types';

export default function CodeDisplay({ code, language = 'typescript', loading = false }: CodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  if (loading) {
    return (
      <div className="relative">
        <div className="bg-gray-900 rounded-lg p-6 min-h-[200px] flex items-center justify-center">
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            <span>Generating code...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!code) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
        <div className="text-gray-400 text-lg mb-2">No code generated yet</div>
        <div className="text-gray-500 text-sm">Enter a prompt above to generate code</div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-t-lg">
        <span className="text-gray-300 text-sm font-medium capitalize">{language}</span>
        <button
          onClick={handleCopy}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            copied
              ? 'bg-green-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {copied ? 'Copied!' : 'Copy Code'}
        </button>
      </div>
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
            margin: 0,
            borderRadius: '0 0 0.5rem 0.5rem',
            fontSize: '14px',
          }}
          wrapLongLines={true}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}