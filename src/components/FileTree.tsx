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
      return isExpanded ? '📂' : '📁';
    }
    
    const ext = item.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx':
        return '📄';
      case 'ts':
      case 'tsx':
        return '🔷';
      case 'css':
        return '🎨';
      case 'html':
        return '🌐';
      case 'json':
        return '📋';
      case 'md':
        return '📝';
      default:
        return '📄';
    }
  };

  return (
    <div>
      <div
        className={`flex items-center py-1 px-2 cursor-pointer hover:bg-gray-100 group ${
          selectedFile === item.id ? 'bg-blue-100 border-r-2 border-blue-500' : ''
        }`}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
        onClick={handleToggle}
      >
        <span className="mr-2 text-sm">{getFileIcon(item)}</span>
        <span className="text-sm text-gray-700 flex-1">{item.name}</span>
        
        {/* Action buttons */}
        {item.type === 'folder' && (
          <div className="hidden group-hover:flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowNewFileInput(true);
                setNewFileType('file');
              }}
              className="p-1 text-xs text-gray-500 hover:text-blue-600"
              title="New File"
            >
              📄+
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowNewFileInput(true);
                setNewFileType('folder');
              }}
              className="p-1 text-xs text-gray-500 hover:text-blue-600"
              title="New Folder"
            >
              📁+
            </button>
          </div>
        )}
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFileDelete(item.id);
          }}
          className="hidden group-hover:block p-1 text-xs text-gray-500 hover:text-red-600"
          title="Delete"
        >
          🗑️
        </button>
      </div>

      {/* New file input */}
      {showNewFileInput && (
        <div style={{ paddingLeft: `${(depth + 1) * 20 + 8}px` }} className="py-1">
          <div className="flex items-center space-x-2">
            <span className="text-sm">{newFileType === 'file' ? '📄' : '📁'}</span>
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleNewFile();
                if (e.key === 'Escape') setShowNewFileInput(false);
              }}
              className="flex-1 text-sm px-2 py-1 border rounded"
              placeholder={`New ${newFileType} name...`}
              autoFocus
            />
            <button
              onClick={handleNewFile}
              className="text-xs text-green-600 hover:text-green-700"
            >
              ✓
            </button>
            <button
              onClick={() => setShowNewFileInput(false)}
              className="text-xs text-red-600 hover:text-red-700"
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
    <div className="bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700">Project Files</h3>
      </div>
      
      <div className="py-2">
        {files.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No files yet. Generate code to create files automatically.
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