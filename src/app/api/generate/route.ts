import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import type { GenerateCodeRequest, GenerateCodeResponse, FileItem } from '@/types';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { prompt }: GenerateCodeRequest = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Create a detailed prompt for multi-file code generation
    const enhancedPrompt = `
You are an expert full-stack developer. Generate a complete project based on the following request.

Instructions:
- Generate ALL necessary files for a complete, working project
- Include proper file structure with folders and subfolders
- Use modern best practices and clean code principles
- Include configuration files (package.json, tsconfig.json, etc.) when needed
- Add proper styling (preferably TailwindCSS if applicable)
- Make it responsive and accessible
- Add comments where helpful
- Return the response as a JSON object with this exact structure:

{
  "files": [
    {
      "name": "filename.ext",
      "path": "folder/subfolder/filename.ext",
      "content": "actual file content here...",
      "language": "javascript|typescript|html|css|json|markdown|etc"
    }
  ]
}

IMPORTANT: 
- Return ONLY the JSON object, no markdown formatting or explanations
- Include ALL files needed for the project to work
- Create a logical folder structure
- Each file should be complete and functional
- The "content" should contain the actual file content

User Request: ${prompt}
`;

    // Generate content
    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    let generatedText = response.text();

    // Clean up the response to extract JSON
    generatedText = generatedText.replace(/```json\n?/, '').replace(/```\n?$/, '');
    generatedText = generatedText.trim();

    let parsedResponse: { files: any[] };
    try {
      parsedResponse = JSON.parse(generatedText);
    } catch (parseError) {
      // Fallback: if JSON parsing fails, create a single file
      const detectedLanguage = detectLanguage(generatedText);
      const fileName = generateFileName(prompt, detectedLanguage);
      
      const singleFile: FileItem = {
        id: uuidv4(),
        name: fileName,
        path: fileName,
        content: generatedText,
        language: detectedLanguage,
        type: 'file'
      };

      return NextResponse.json({
        files: [singleFile],
        code: generatedText,
        language: detectedLanguage
      });
    }

    // Convert the parsed files to FileItem format
    const files: FileItem[] = parsedResponse.files.map(file => ({
      id: uuidv4(),
      name: file.name || 'untitled.txt',
      path: file.path || file.name || 'untitled.txt',
      content: file.content || '',
      language: file.language || detectLanguage(file.content || ''),
      type: 'file' as const
    }));

    // Create folder structure
    const fileTree = createFileTree(files);

    const responseData: GenerateCodeResponse = {
      files: fileTree,
      code: files[0]?.content || '',
      language: files[0]?.language || 'plaintext',
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error generating code:', error);
    
    let errorMessage = 'An error occurred while generating code';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

function detectLanguage(content: string): string {
  if (content.includes('import React') || content.includes('export default function')) {
    return 'typescript';
  } else if (content.includes('<!DOCTYPE html>') || content.includes('<html')) {
    return 'html';
  } else if (content.includes('@media') || content.includes('display:')) {
    return 'css';
  } else if (content.includes('def ') || content.includes('import ')) {
    return 'python';
  } else if (content.includes('"scripts"') || content.includes('"dependencies"')) {
    return 'json';
  } else if (content.includes('# ') || content.includes('## ')) {
    return 'markdown';
  }
  return 'javascript';
}

function generateFileName(prompt: string, language: string): string {
  const extensions: { [key: string]: string } = {
    javascript: 'js',
    typescript: 'ts',
    html: 'html',
    css: 'css',
    json: 'json',
    markdown: 'md',
    python: 'py'
  };

  const ext = extensions[language] || 'txt';
  const baseName = prompt.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 30) || 'generated-code';
  
  return `${baseName}.${ext}`;
}

function createFileTree(files: FileItem[]): FileItem[] {
  const folderMap = new Map<string, FileItem>();
  const result: FileItem[] = [];

  // First pass: create all files and identify folders
  files.forEach(file => {
    const pathParts = file.path.split('/');
    let currentPath = '';

    // Create folder structure
    for (let i = 0; i < pathParts.length - 1; i++) {
      const folderName = pathParts[i];
      currentPath = currentPath ? `${currentPath}/${folderName}` : folderName;
      
      if (!folderMap.has(currentPath)) {
        const folder: FileItem = {
          id: uuidv4(),
          name: folderName,
          path: currentPath,
          content: '',
          language: '',
          type: 'folder',
          children: [],
          isOpen: true
        };
        folderMap.set(currentPath, folder);
      }
    }
  });

  // Second pass: organize files into their folders
  files.forEach(file => {
    const pathParts = file.path.split('/');
    
    if (pathParts.length === 1) {
      // Root level file
      result.push(file);
    } else {
      // File in a folder
      const parentPath = pathParts.slice(0, -1).join('/');
      const parentFolder = folderMap.get(parentPath);
      if (parentFolder && parentFolder.children) {
        parentFolder.children.push(file);
      }
    }
  });

  // Third pass: add folders to result, organized by depth
  const addedFolders = new Set<string>();
  
  folderMap.forEach((folder, path) => {
    if (!addedFolders.has(path)) {
      const pathParts = path.split('/');
      
      if (pathParts.length === 1) {
        // Root level folder
        result.push(folder);
        addedFolders.add(path);
      } else {
        // Nested folder
        const parentPath = pathParts.slice(0, -1).join('/');
        const parentFolder = folderMap.get(parentPath);
        if (parentFolder && parentFolder.children && !addedFolders.has(path)) {
          parentFolder.children.push(folder);
          addedFolders.add(path);
        }
      }
    }
  });

  return result.sort((a, b) => {
    // Folders first, then files
    if (a.type !== b.type) {
      return a.type === 'folder' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
}