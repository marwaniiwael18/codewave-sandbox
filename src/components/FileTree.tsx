'use client';

import { useState } from 'react';
import { FileTreeProps, FileItem } from '@/types';

const FileTreeItem = ({ 
  item, 
  selectedFile, 
  onFileSelect, 
  onFileCreate, 
  onFileDelete, 
  depth = 0 
}: {
  item: FileItem;
  selectedFile: string | null;
  onFileSelect: (fileId: string) => void;
  onFileCreate: (parentPath: string, name: string, type: 'file' | 'folder') => void;
  onFileDelete: (fileId: string) => void;
  depth?: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(item.isOpen || false);
  const [showNewFileInput, setShowNewFileInput] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<'file' | 'folder'>('file');

  const handleToggle = () => {
    if (item.type === 'folder') {
      setIsExpanded(!isExpanded);
    } else {
      onFileSelect(item.id);
    }
  };

  const handleNewFile = () => {
    if (newFileName.trim()) {
      onFileCreate(item.path, newFileName.trim(), newFileType);
      setNewFileName('');
      setShowNewFileInput(false);
    }
  };

  const getFileIcon = (item: FileItem) => {
    if (item.type === 'folder') {
      return isExpanded ? (
        <span className="text-blue-400">📂</span>
      ) : (
        <span className="text-gray-400">📁</span>
      );
    }
    
    const ext = item.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
        return <span className="text-yellow-400">📄</span>;
      case 'jsx':
        return <span className="text-blue-400">⚛️</span>;
      case 'ts':
        return <span className="text-blue-500">🔷</span>;
      case 'tsx':
        return <span className="text-blue-400">⚛️</span>;
      case 'css':
        return <span className="text-pink-400">🎨</span>;
      case 'html':
        return <span className="text-orange-400">🌐</span>;
      case 'json':
        return <span className="text-yellow-300">📋</span>;
      case 'md':
        return <span className="text-gray-300">📝</span>;
      case 'py':
        return <span className="text-green-400">�</span>;
      case 'java':
        return <span className="text-red-400">☕</span>;
      case 'go':
        return <span className="text-cyan-400">🐹</span>;
      default:
        return <span className="text-gray-400">📄</span>;
    }
  };

  return (
    <div>
      <div
        className={`flex items-center py-2 px-3 cursor-pointer group transition-all duration-200 ${
          selectedFile === item.id 
            ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-r-2 border-purple-400' 
            : 'hover:bg-gray-700/50'
        }`}
        style={{ paddingLeft: `${depth * 20 + 12}px` }}
        onClick={handleToggle}
      >
        <span className="mr-3 text-base">{getFileIcon(item)}</span>
        <span className={`text-sm flex-1 transition-colors duration-200 ${
          selectedFile === item.id ? 'text-white font-medium' : 'text-gray-300 group-hover:text-white'
        }`}>
          {item.name}
        </span>
        
        {/* Action buttons */}
        {item.type === 'folder' && (
          <div className="hidden group-hover:flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowNewFileInput(true);
                setNewFileType('file');
              }}
              className="p-1.5 text-xs text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-all duration-200"
              title="New File"
            >
              <span className="block w-3 h-3">📄</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowNewFileInput(true);
                setNewFileType('folder');
              }}
              className="p-1.5 text-xs text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded transition-all duration-200"
              title="New Folder"
            >
              <span className="block w-3 h-3">📁</span>
            </button>
          </div>
        )}
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFileDelete(item.id);
          }}
          className="hidden group-hover:block p-1.5 text-xs text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-all duration-200 ml-1"
          title="Delete"
        >
          <span className="block w-3 h-3">🗑️</span>
        </button>
      </div>

      {/* New file input */}
      {showNewFileInput && (
        <div style={{ paddingLeft: `${(depth + 1) * 20 + 12}px` }} className="py-2 animate-fadeIn">
          <div className="flex items-center space-x-3 bg-gray-800/50 rounded-lg p-2 border border-gray-600/50">
            <span className="text-sm">{newFileType === 'file' ? '📄' : '📁'}</span>
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleNewFile();
                if (e.key === 'Escape') setShowNewFileInput(false);
              }}
              className="flex-1 text-sm px-3 py-1 bg-gray-700 text-gray-200 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              placeholder={`New ${newFileType} name...`}
              autoFocus
            />
            <button
              onClick={handleNewFile}
              className="text-sm text-green-400 hover:text-green-300 px-2 py-1 hover:bg-green-500/10 rounded transition-all duration-200"
            >
              ✓
            </button>
            <button
              onClick={() => setShowNewFileInput(false)}
              className="text-sm text-red-400 hover:text-red-300 px-2 py-1 hover:bg-red-500/10 rounded transition-all duration-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Children */}
      {isExpanded && item.children && (
        <div>
          {item.children.map((child) => (
            <FileTreeItem
              key={child.id}
              item={child}
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
              onFileCreate={onFileCreate}
              onFileDelete={onFileDelete}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function FileTree({ 
  files, 
  selectedFile, 
  onFileSelect, 
  onFileCreate, 
  onFileDelete 
}: FileTreeProps) {
  return (
    <div className="bg-gray-900/70 backdrop-blur-sm border-r border-gray-700/50 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-200 flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            <span>Project Explorer</span>
          </h3>
          <div className="text-xs text-gray-500 bg-gray-700/50 px-2 py-1 rounded">
            {files.length} files
          </div>
        </div>
      </div>
      
      <div className="py-2">
        {files.length === 0 ? (
          <div className="p-6 text-center">
            <div className="text-4xl mb-3 opacity-50">📁</div>
            <div className="text-sm text-gray-400 mb-1">No files yet</div>
            <div className="text-xs text-gray-500">
              Generate code to create files automatically
            </div>
          </div>
        ) : (
          files.map((file) => (
            <FileTreeItem
              key={file.id}
              item={file}
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
              onFileCreate={onFileCreate}
              onFileDelete={onFileDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}