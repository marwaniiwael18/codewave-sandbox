'use client';

import { useState } from 'react';
import PromptInput from '@/components/PromptInput';
import CodeDisplay from '@/components/CodeDisplay';
import type { GenerateCodeResponse } from '@/types';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('typescript');
  const [error, setError] = useState('');

  const handlePromptSubmit = async (prompt: string) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate code');
      }

      const data: GenerateCodeResponse = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setGeneratedCode(data.code);
        setCodeLanguage(data.language || 'typescript');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while generating code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Code<span className="text-blue-600">Wave</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              AI-powered coding sandbox. Describe what you want to build, and get instant code generation.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <PromptInput onSubmit={handlePromptSubmit} loading={loading} />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-red-600 text-sm">
                <strong>Error:</strong> {error}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Generated Code</h2>
          </div>
          <div className="p-6">
            <CodeDisplay 
              code={generatedCode} 
              language={codeLanguage} 
              loading={loading} 
            />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              Built with Next.js, TailwindCSS, and Google Gemini AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
