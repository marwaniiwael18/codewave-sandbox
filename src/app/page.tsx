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
  };

  const handleFileCreate = (parentPath: string, name: string, type: 'file' | 'folder') => {
    const newItem = type === 'file' 
      ? createNewFile(name, parentPath) 
      : createNewFolder(name, parentPath);

    if (parentPath === '') {
      // Root level
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
      // Inside a folder
      setProjectState(prev => ({
        ...prev,
        files: addFileToFolder(prev.files, parentPath, newItem)
      }));
    }

    if (type === 'file') {
      setProjectState(prev => ({ ...prev, selectedFileId: newItem.id }));
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

  const selectedFile = projectState.selectedFileId 
    ? findFileById(projectState.files, projectState.selectedFileId) 
    : null;

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
