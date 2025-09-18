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
    <div className="h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Code<span className="text-blue-600">Wave</span>
            </h1>
            <div className="text-sm text-gray-500">
              AI-Powered Code Editor
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {projectState.files.length > 0 && (
              <button
                onClick={() => downloadAllFiles(projectState.files)}
                className="px-4 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                📥 Download Project
              </button>
            )}
            <button
              onClick={() => setProjectState({ files: [], selectedFileId: null, loading: false, error: null })}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              🗑️ Clear All
            </button>
          </div>
        </div>
      </header>

      {/* Prompt Input */}
      <div className="border-b bg-gray-50 px-6 py-4 flex-shrink-0">
        <PromptInput onSubmit={handlePromptSubmit} loading={projectState.loading} />
      </div>

      {/* Error Display */}
      {projectState.error && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3 flex-shrink-0">
          <div className="text-red-600 text-sm">
            <strong>Error:</strong> {projectState.error}
          </div>
        </div>
      )}

      {/* Main Editor Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Tree Sidebar */}
        <div className="w-80 flex-shrink-0 bg-gray-50 border-r border-gray-200">
          <FileTree
            files={projectState.files}
            selectedFile={projectState.selectedFileId}
            onFileSelect={handleFileSelect}
            onFileCreate={handleFileCreate}
            onFileDelete={handleFileDelete}
          />
        </div>

        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <CodeEditor
            file={selectedFile}
            onChange={handleFileContentChange}
          />
        </div>
      </div>
    </div>
  );
}
