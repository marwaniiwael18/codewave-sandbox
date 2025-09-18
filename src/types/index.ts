export interface GenerateCodeRequest {
  prompt: string;
}

export interface GenerateCodeResponse {
  code: string;
  language?: string;
  error?: string;
  files?: FileItem[];
}

export interface FileItem {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  type: 'file' | 'folder';
  children?: FileItem[];
  isOpen?: boolean;
}

export interface CodeDisplayProps {
  code: string;
  language?: string;
  loading?: boolean;
}

export interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  loading?: boolean;
}

export interface FileTreeProps {
  files: FileItem[];
  selectedFile: string | null;
  onFileSelect: (fileId: string) => void;
  onFileCreate: (parentPath: string, name: string, type: 'file' | 'folder') => void;
  onFileDelete: (fileId: string) => void;
}

export interface CodeEditorProps {
  file: FileItem | null;
  onChange: (fileId: string, content: string) => void;
}

export interface ProjectState {
  files: FileItem[];
  selectedFileId: string | null;
  loading: boolean;
  error: string | null;
}