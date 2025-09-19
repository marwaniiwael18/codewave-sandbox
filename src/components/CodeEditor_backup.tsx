'use client';

import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { FileItem } from '@/types';

interface CodeEditorProps {
  file: FileItem | null;
  onContentChange: (fileId: string, content: string) => void;
}

export default function CodeEditor({ file, onContentChange }: CodeEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  useEffect(() => {
    // Configure Monaco themes and settings
    import('monaco-editor').then((monaco) => {
      monaco.editor.defineTheme('codewave-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
          { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
          { token: 'string', foreground: 'CE9178' },
          { token: 'number', foreground: 'B5CEA8' },
          { token: 'type', foreground: '4EC9B0' },
          { token: 'class', foreground: '4EC9B0' },
          { token: 'function', foreground: 'DCDCAA' },
        ],
        colors: {
          'editor.background': '#0d0d1a',
          'editor.foreground': '#e4e4e7',
          'editor.lineHighlightBackground': '#1e1e3f20',
          'editor.selectionBackground': '#264f7850',
          'editorCursor.foreground': '#a855f7',
          'editor.findMatchHighlightBackground': '#ea580c40',
          'scrollbarSlider.background': '#4c1d9520',
          'scrollbarSlider.hoverBackground': '#4c1d9540',
        },
      });
    });
  }, []);

  const getLanguageFromFile = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js': return 'javascript';
      case 'ts': return 'typescript';
      case 'jsx': return 'javascript';
      case 'tsx': return 'typescript';
      case 'py': return 'python';
      case 'html': return 'html';
      case 'css': return 'css';
      case 'scss': return 'scss';
      case 'json': return 'json';
      case 'md': return 'markdown';
      case 'yml':
      case 'yaml': return 'yaml';
      case 'xml': return 'xml';
      case 'sql': return 'sql';
      case 'php': return 'php';
      case 'rb': return 'ruby';
      case 'go': return 'go';
      case 'rs': return 'rust';
      case 'java': return 'java';
      case 'cpp':
      case 'c': return 'cpp';
      case 'sh': return 'shell';
      default: return 'plaintext';
    }
  };

  const downloadFile = (file: FileItem) => {
    const blob = new Blob([file.content || ''], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!file) {
    return (
      <div className="h-full flex items-center justify-center bg-black/10 backdrop-blur-xl">
        <div className="text-center space-y-4 max-w-md mx-auto p-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center">
            <span className="text-3xl">📝</span>
          </div>
          <h2 className="text-xl font-semibold text-white">Welcome to CodeWave</h2>
          <p className="text-gray-400 leading-relaxed">
            Start by generating a project or creating your first file. 
            Your code will appear here with full syntax highlighting and editing capabilities.
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-500">
            <div className="bg-black/20 rounded-lg p-3 space-y-1">
              <div className="text-purple-400">🚀 AI-Powered</div>
              <div>Generate complete projects</div>
            </div>
            <div className="bg-black/20 rounded-lg p-3 space-y-1">
              <div className="text-pink-400">⚡ Real-time</div>
              <div>Live code editing</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col bg-black/10 backdrop-blur-xl ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Enhanced Mobile Header */}
      <div className="bg-black/30 backdrop-blur-xl border-b border-purple-500/20 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
              <span className="text-sm">
                {file.name.endsWith('.js') ? '🟨' : 
                 file.name.endsWith('.ts') ? '🟦' :
                 file.name.endsWith('.py') ? '🐍' :
                 file.name.endsWith('.html') ? '🌐' :
                 file.name.endsWith('.css') ? '🎨' :
                 file.name.endsWith('.json') ? '📋' :
                 file.name.endsWith('.md') ? '📝' : '📄'}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white truncate max-w-[120px] md:max-w-none">
                {file.name}
              </h3>
              <div className="text-xs text-gray-400 flex items-center space-x-2">
                <span>{getLanguageFromFile(file.name)}</span>
                <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                <span>{file.content?.split('\n').length || 0} lines</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Mobile Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isFullscreen ? "M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 15v4.5M15 15h4.5M15 15l4.5 4.5" : "M3.5 3.5l4.5 4.5M9 9V4.5M9 9H4.5M15 15v4.5M15 15h4.5m0 0l-4.5-4.5"} />
              </svg>
            </button>
            
            {/* Download Button */}
            <button
              onClick={() => downloadFile(file)}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-all duration-200 group"
            >
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
            </button>
            
            {/* Close Fullscreen (Mobile) */}
            {isFullscreen && (
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          language={getLanguageFromFile(file.name)}
          value={file.content || ''}
          onChange={(value) => {
            if (value !== undefined) {
              onContentChange(file.id, value);
            }
          }}
          theme="codewave-dark"
          options={{
            minimap: { enabled: window.innerWidth > 768 }, // Disable minimap on mobile
            fontSize: window.innerWidth < 768 ? 14 : 16,
            lineHeight: window.innerWidth < 768 ? 20 : 24,
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: window.innerWidth < 768 ? 'on' : 'off',
            folding: true,
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            contextmenu: true,
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
              verticalScrollbarSize: window.innerWidth < 768 ? 12 : 16,
              horizontalScrollbarSize: window.innerWidth < 768 ? 12 : 16,
            },
            overviewRulerBorder: false,
          }}
        />
        
        {/* Mobile Code Actions Bar */}
        <div className="md:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-black/80 backdrop-blur-xl border border-purple-500/20 rounded-xl px-4 py-2 flex items-center space-x-3 shadow-lg">
            <button className="text-xs text-gray-300 hover:text-white transition-colors">
              Copy
            </button>
            <div className="w-px h-4 bg-gray-600"></div>
            <button className="text-xs text-gray-300 hover:text-white transition-colors">
              Format
            </button>
            <div className="w-px h-4 bg-gray-600"></div>
            <button className="text-xs text-gray-300 hover:text-white transition-colors">
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Status Bar */}
      <div className="bg-black/40 backdrop-blur-xl border-t border-purple-500/20 px-4 py-2 flex-shrink-0">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Ready</span>
            </div>
            <div className="text-gray-500">
              {file.path || file.name}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-500">
              {getLanguageFromFile(file.name).toUpperCase()}
            </span>
            <span className="text-gray-500">
              UTF-8
            </span>
            <div className="hidden md:block text-purple-400">
              Monaco Editor
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
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