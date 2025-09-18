import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import type { GenerateCodeRequest, GenerateCodeResponse } from '@/types';

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

    // Create a detailed prompt for code generation
    const enhancedPrompt = `
You are an expert web developer. Generate clean, modern, and functional code based on the following request.

Instructions:
- Generate complete, working code (HTML, CSS, JavaScript, React, etc.)
- Use modern best practices and clean code principles
- Include proper styling (preferably TailwindCSS if applicable)
- Make it responsive and accessible
- Add comments where helpful
- Return only the code, no explanations or markdown formatting
- If it's a React component, make it functional with hooks
- Ensure the code is production-ready

User Request: ${prompt}
`;

    // Generate content
    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const generatedCode = response.text();

    // Detect language based on code content
    let detectedLanguage = 'javascript';
    if (generatedCode.includes('import React') || generatedCode.includes('export default function')) {
      detectedLanguage = 'tsx';
    } else if (generatedCode.includes('<!DOCTYPE html>') || generatedCode.includes('<html')) {
      detectedLanguage = 'html';
    } else if (generatedCode.includes('@media') || generatedCode.includes('display:')) {
      detectedLanguage = 'css';
    } else if (generatedCode.includes('def ') || generatedCode.includes('import ')) {
      detectedLanguage = 'python';
    }

    const responseData: GenerateCodeResponse = {
      code: generatedCode,
      language: detectedLanguage,
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