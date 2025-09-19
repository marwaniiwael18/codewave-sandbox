'use client';

import { useState } from 'react';
import PromptInput from '@/components/PromptInput';
import FileTree from '@/components/FileTree';
import CodeEditor from '@/components/CodeEditor';
import type { GenerateCodeResponse, FileItem, ProjectState } from '@/types';
import { 
  createNewFile, 
  createNewFolder, 
  findFileById, 
  deleteFileById, 
  updateFileContent, 
  addFileToFolder,
  downloadAllFiles 
} from '@/utils/fileUtils';

export default function Home() {
  const [projectState, setProjectState] = useState<ProjectState>({
    files: [],
    selectedFileId: null,
    loading: false,
    error: null
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'files' | 'editor'>('prompt');

  const handlePromptSubmit = async (prompt: string) => {
    setProjectState(prev => ({ ...prev, loading: true, error: null }));
    
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
        setProjectState(prev => ({ ...prev, error: data.error!, loading: false }));
      } else {
        const newFiles = data.files || [];
        setProjectState(prev => ({
          ...prev,
          files: [...prev.files, ...newFiles],
          selectedFileId: newFiles[0]?.id || null,
          loading: false
        }));
        // Auto-switch to files tab on mobile after generation
        if (window.innerWidth < 768) {
          setActiveTab('files');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setProjectState(prev => ({
        ...prev,
        error: 'An error occurred while generating code. Please try again.',
        loading: false
      }));
    }
  };

  const handleFileSelect = (fileId: string) => {
    setProjectState(prev => ({ ...prev, selectedFileId: fileId }));
    // Auto-switch to editor tab on mobile when file selected
    if (window.innerWidth < 768) {
      setActiveTab('editor');
      setSidebarOpen(false);
    }
  };

  const handleFileCreate = (parentPath: string, name: string, type: 'file' | 'folder') => {
    const newItem = type === 'file' 
      ? createNewFile(name, parentPath) 
      : createNewFolder(name, parentPath);

    if (parentPath === '') {
      setProjectState(prev => ({
        ...prev,
        files: [...prev.files, newItem].sort((a, b) => {
          if (a.type !== b.type) {
            return a.type === 'folder' ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        })
      }));
    } else {
      setProjectState(prev => ({
        ...prev,
        files: addFileToFolder(prev.files, parentPath, newItem)
      }));
    }

    if (type === 'file') {
      setProjectState(prev => ({ ...prev, selectedFileId: newItem.id }));
      if (window.innerWidth < 768) {
        setActiveTab('editor');
      }
    }
  };

  const handleFileDelete = (fileId: string) => {
    setProjectState(prev => ({
      ...prev,
      files: deleteFileById(prev.files, fileId),
      selectedFileId: prev.selectedFileId === fileId ? null : prev.selectedFileId
    }));
  };

  const handleFileContentChange = (fileId: string, content: string) => {
    setProjectState(prev => ({
      ...prev,
      files: updateFileContent(prev.files, fileId, content)
    }));
  };

        </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop Layout */}
        <div className="hidden md:flex w-full">
          {/* Left Panel - Prompt */}
          <div className="w-96 bg-black/30 backdrop-blur-xl border-r border-purple-500/20 flex flex-col">
            <div className="p-6 border-b border-purple-500/20">
              <h2 className="text-lg font-semibold text-white mb-2 flex items-center">
                <span className="mr-2">✨</span>
                AI Code Generator
              </h2>
              <p className="text-sm text-gray-400">Describe your project and watch the magic happen</p>
            </div>
            <div className="flex-1 overflow-hidden">
              <PromptInput 
                onSubmit={handlePromptSubmit} 
                loading={projectState.loading}
                error={projectState.error}
              />
            </div>
          </div>

          {/* Middle Panel - File Tree */}
          <div className="w-80 bg-black/20 backdrop-blur-xl border-r border-purple-500/20 flex flex-col">
            <div className="p-4 border-b border-purple-500/20 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white flex items-center">
                <span className="mr-2">📁</span>
                Project Explorer
              </h2>
              <span className="text-xs text-gray-400 bg-purple-500/20 px-2 py-1 rounded-full">
                {projectState.files.length} files
              </span>
            </div>
            <div className="flex-1 overflow-hidden">
              <FileTree
                files={projectState.files}
                selectedFileId={projectState.selectedFileId}
                onFileSelect={handleFileSelect}
                onFileCreate={handleFileCreate}
                onFileDelete={handleFileDelete}
              />
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="flex-1 bg-black/10 backdrop-blur-xl">
            <CodeEditor
              file={selectedFile}
              onContentChange={handleFileContentChange}
            />
          </div>
        </div>

        {/* Mobile Layout with Sidebar */}
        <div className="md:hidden flex-1 flex">
          {/* Mobile Sidebar */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            >
              <div 
                className="w-80 h-full bg-slate-900/95 backdrop-blur-xl border-r border-purple-500/20 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b border-purple-500/20">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-white">Project Files</h2>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <FileTree
                    files={projectState.files}
                    selectedFileId={projectState.selectedFileId}
                    onFileSelect={handleFileSelect}
                    onFileCreate={handleFileCreate}
                    onFileDelete={handleFileDelete}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Mobile Main Content */}
          <div className="flex-1 bg-black/10 backdrop-blur-xl">
            {activeTab === 'prompt' && (
              <div className="h-full overflow-hidden">
                <div className="p-4 border-b border-purple-500/20">
                  <h2 className="text-lg font-semibold text-white mb-2 flex items-center">
                    <span className="mr-2">✨</span>
                    Generate Code
                  </h2>
                  <p className="text-sm text-gray-400">Describe what you want to build</p>
                </div>
                <div className="flex-1 h-full overflow-hidden">
                  <PromptInput 
                    onSubmit={handlePromptSubmit} 
                    loading={projectState.loading}
                    error={projectState.error}
                  />
                </div>
              </div>
            )}

            {activeTab === 'files' && (
              <div className="h-full overflow-hidden">
                <div className="p-4 border-b border-purple-500/20 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <span className="mr-2">📁</span>
                    Files
                  </h2>
                  <span className="text-xs text-gray-400 bg-purple-500/20 px-3 py-1 rounded-full">
                    {projectState.files.length}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <FileTree
                    files={projectState.files}
                    selectedFileId={projectState.selectedFileId}
                    onFileSelect={handleFileSelect}
                    onFileCreate={handleFileCreate}
                    onFileDelete={handleFileDelete}
                  />
                </div>
              </div>
            )}

            {activeTab === 'editor' && (
              <div className="h-full overflow-hidden">
                <CodeEditor
                  file={selectedFile}
                  onContentChange={handleFileContentChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col overflow-hidden">
      {/* Mobile Header */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-purple-500/20 px-4 py-3 flex-shrink-0 md:hidden">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/10 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">⚡</span>
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              CodeWave
            </h1>
          </div>

          <div className="w-9 h-9 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <span className="text-xs text-purple-300">{projectState.files.length}</span>
          </div>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="flex items-center justify-center mt-3 bg-black/30 rounded-xl p-1">
          {[
            { id: 'prompt', icon: '✨', label: 'Generate' },
            { id: 'files', icon: '📁', label: 'Files' },
            { id: 'editor', icon: '⚡', label: 'Code' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="text-sm">{tab.icon}</span>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden md:flex bg-black/20 backdrop-blur-xl border-b border-purple-500/20 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-lg flex items-center justify-center animate-pulse">
                <span className="text-white font-bold text-sm">⚡</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  CodeWave
                </h1>
                <div className="text-xs text-gray-400 -mt-1 flex items-center space-x-2">
                  <span>AI-Powered Development Suite</span>
                  <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-xs">Online</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {projectState.files.length > 0 && (
              <button
                onClick={() => downloadAllFiles(projectState.files)}
                className="group px-4 py-2 text-sm bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all duration-300 shadow-lg hover:shadow-green-500/25 flex items-center space-x-2 transform hover:scale-105"
              >
                <span className="group-hover:rotate-12 transition-transform duration-300">📦</span>
                <span>Export</span>
              </button>
            )}
            <button
              onClick={() => setProjectState({ files: [], selectedFileId: null, loading: false, error: null })}
              className="px-4 py-2 text-sm bg-gray-800/60 hover:bg-gray-700/60 text-gray-300 rounded-xl transition-all duration-200 border border-gray-600/30 hover:border-gray-500/50 flex items-center space-x-2"
            >
              <span>🗑️</span>
              <span>Clear</span>
            </button>
          </div>
        </div>
      </header>

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-700/50 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">⚡</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  CodeWave
                </h1>
                <div className="text-xs text-gray-400 -mt-1">
                  AI-Powered Development Suite
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {projectState.files.length > 0 && (
              <button
                onClick={() => downloadAllFiles(projectState.files)}
                className="group px-4 py-2 text-sm bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all duration-200 shadow-lg hover:shadow-green-500/25 flex items-center space-x-2"
              >
                <span>�</span>
                <span>Export Project</span>
              </button>
            )}
            <button
              onClick={() => setProjectState({ files: [], selectedFileId: null, loading: false, error: null })}
              className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-all duration-200 border border-gray-600 hover:border-gray-500 flex items-center space-x-2"
            >
              <span>🗑️</span>
              <span>Clear</span>
            </button>
          </div>
        </div>
      </header>

      {/* Prompt Input */}
      <div className="border-b border-gray-700/50 bg-gray-800/30 backdrop-blur-sm px-6 py-6 flex-shrink-0">
        <PromptInput onSubmit={handlePromptSubmit} loading={projectState.loading} />
      </div>

      {/* Error Display */}
      {projectState.error && (
        <div className="bg-gradient-to-r from-red-900/20 to-pink-900/20 border-b border-red-500/30 px-6 py-4 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">!</span>
            </div>
            <div className="text-red-300 text-sm">
              <strong>Error:</strong> {projectState.error}
            </div>
          </div>
        </div>
      )}

      {/* Main Editor Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Tree Sidebar */}
        <div className="w-80 flex-shrink-0 bg-gray-900/70 backdrop-blur-sm border-r border-gray-700/50">
          <FileTree
            files={projectState.files}
            selectedFile={projectState.selectedFileId}
            onFileSelect={handleFileSelect}
            onFileCreate={handleFileCreate}
            onFileDelete={handleFileDelete}
          />
        </div>

        {/* Code Editor */}
        <div className="flex-1 flex flex-col bg-gray-900">
          <CodeEditor
            file={selectedFile}
            onChange={handleFileContentChange}
          />
        </div>
      </div>
    </div>
  );
}
