export interface GenerateCodeRequest {
  prompt: string;
}

export interface GenerateCodeResponse {
  code: string;
  language?: string;
  error?: string;
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