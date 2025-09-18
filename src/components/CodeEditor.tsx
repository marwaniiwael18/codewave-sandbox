'use client';

import { useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { CodeEditorProps } from '@/types';

export default function CodeEditor({ file, onChange }: CodeEditorProps) {
  useEffect(() => {
    // Configure Monaco themes and settings
    import('monaco-editor').then((monaco) => {
      monaco.editor.defineTheme('codewave-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '6A9955' },
          { token: 'keyword', foreground: '569CD6' },
          { token: 'string', foreground: 'CE9178' },
        ],
        colors: {
          'editor.background': '#1e1e1e',
          'editor.foreground': '#d4d4d4',
        },
      });
    });
  }, []);

  const getLanguageFromFile = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
        return 'javascript';
      case 'jsx':
        return 'javascript';
      case 'ts':
        return 'typescript';
      case 'tsx':
        return 'typescript';
      case 'css':
        return 'css';
      case 'scss':
        return 'scss';
      case 'html':
        return 'html';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      case 'py':
        return 'python';
      case 'java':
        return 'java';
      case 'cpp':
      case 'cc':
      case 'cxx':
        return 'cpp';
      case 'c':
        return 'c';
      case 'php':
        return 'php';
      case 'rb':
        return 'ruby';
      case 'go':
        return 'go';
      case 'rs':
        return 'rust';
      case 'sh':
        return 'shell';
      case 'yml':
      case 'yaml':
        return 'yaml';
      case 'xml':
        return 'xml';
      case 'sql':
        return 'sql';
      default:
        return 'plaintext';
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (file && value !== undefined) {
      onChange(file.id, value);
    }
  };

  if (!file) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6 opacity-60">✨</div>
          <h3 className="text-xl font-semibold text-gray-200 mb-3">Ready to Code</h3>
          <p className="text-gray-400 leading-relaxed mb-6">
            Select a file from the project tree or generate new code to start your coding journey.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Real-time</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
              <span>Professional</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-900">
      {/* File tab */}
      <div className="flex items-center justify-between bg-gray-800/50 backdrop-blur-sm px-6 py-3 border-b border-gray-700/50">
        <div className="flex items-center space-x-3">
          <span className="text-base">
            {file.type === 'file' ? getFileIcon(file.name) : '📁'}
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-200">
              {file.name}
            </span>
            <span className="text-xs text-gray-500">
              {file.path}
            </span>
          </div>
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" title="Modified"></div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              navigator.clipboard.writeText(file.content);
            }}
            className="group px-3 py-2 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-all duration-200 border border-gray-600 hover:border-gray-500 flex items-center space-x-2"
          >
            <span className="group-hover:scale-110 transition-transform duration-200">📋</span>
            <span>Copy</span>
          </button>
          <button
            onClick={() => {
              const blob = new Blob([file.content], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = file.name;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="group px-3 py-2 text-xs bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 flex items-center space-x-2"
          >
            <span className="group-hover:scale-110 transition-transform duration-200">📥</span>
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          language={getLanguageFromFile(file.name)}
          value={file.content}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            contextmenu: true,
            selectOnLineNumbers: true,
            renderWhitespace: 'selection',
            folding: true,
            foldingStrategy: 'indentation',
            showFoldingControls: 'mouseover',
            bracketPairColorization: { enabled: true },
            guides: {
              bracketPairs: true,
              indentation: true
            },
            padding: { top: 16, bottom: 16 },
            smoothScrolling: true,
            cursorSmoothCaretAnimation: 'on',
            cursorBlinking: 'smooth',
            renderLineHighlight: 'gutter',
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
              useShadows: false
            }
          }}
        />
        {/* Status bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gray-800/90 backdrop-blur-sm px-4 py-2 border-t border-gray-700/50 text-xs text-gray-400 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span>Language: {getLanguageFromFile(file.name)}</span>
            <span>•</span>
            <span>{file.content.split('\n').length} lines</span>
            <span>•</span>
            <span>{file.content.length} characters</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span>Auto-saved</span>
          </div>
        </div>
      </div>
    </div>
  );

  function getFileIcon(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js': return '📄';
      case 'jsx': return '⚛️';
      case 'ts': return '🔷';
      case 'tsx': return '⚛️';
      case 'css': return '🎨';
      case 'html': return '🌐';
      case 'json': return '📋';
      case 'md': return '📝';
      case 'py': return '🐍';
      default: return '📄';
    }
  }
}