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
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No file selected</h3>
          <p className="text-gray-500 max-w-md">
            Select a file from the project tree or generate new code to start editing.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* File tab */}
      <div className="flex items-center justify-between bg-gray-50 px-4 py-2 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <span className="text-sm">
            {file.type === 'file' ? '📄' : '📁'}
          </span>
          <span className="text-sm font-medium text-gray-700">
            {file.name}
          </span>
          <span className="text-xs text-gray-500">
            {file.path}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(file.content);
              // You could add a toast notification here
            }}
            className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300"
          >
            Copy All
          </button>
          <button
            onClick={() => {
              // Download file functionality
              const blob = new Blob([file.content], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = file.name;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
          >
            Download
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={getLanguageFromFile(file.name)}
          value={file.content}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
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
            }
          }}
        />
      </div>
    </div>
  );
}