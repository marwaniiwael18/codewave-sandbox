# ⚡ CodeWave - AI-Powered Development Suite

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.5.3-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/Gemini_AI-Integrated-orange?style=for-the-badge&logo=google" alt="Gemini AI">
</div>

<div align="center">
  <h3>🚀 Mobile-First AI Coding Sandbox with Claude-Inspired Design</h3>
  <p>Transform ideas into code with AI-powered generation, professional file management, and premium dark aesthetics</p>
</div>

---

## ✨ Features

### 🎯 **AI-Powered Code Generation**
- **Google Gemini Integration**: Generate complete projects with natural language prompts
- **Multi-file Support**: Create entire project structures with folders and dependencies
- **Language Detection**: Automatic syntax highlighting and file type recognition
- **Smart Organization**: Intelligent file tree generation and management

### 📱 **Mobile-First Experience**
- **Responsive Design**: Optimized for mobile devices with touch-friendly interactions
- **Claude-Inspired UI**: Premium dark theme with smooth animations and gradients
- **Tab Navigation**: Seamless switching between Generate, Files, and Code sections
- **Collapsible Sidebar**: Space-efficient navigation with overlay system

### 🛠️ **Professional Development Tools**
- **Monaco Editor**: VS Code-like editing experience with syntax highlighting
- **File Management**: Create, delete, and organize files with drag-and-drop support
- **Project Export**: Download complete projects as zip files
- **Real-time Updates**: Live content editing with instant preview

### 🎨 **Premium Design System**
- **Dark Theme**: Eye-friendly development environment
- **Gradient Aesthetics**: Purple-pink gradient accents throughout
- **Smooth Animations**: 60fps animations with hardware acceleration
- **Professional Typography**: Clean, readable fonts optimized for coding

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/marwaniiwael18/codewave-sandbox.git
   cd codewave-sandbox
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Project Structure

```
codewave/
├── src/
│   ├── app/
│   │   ├── api/generate/          # Gemini API integration
│   │   ├── globals.css            # Global styles & animations
│   │   ├── layout.tsx            # App layout
│   │   └── page.tsx              # Main application
│   ├── components/
│   │   ├── CodeDisplay.tsx       # Code preview component
│   │   ├── CodeEditor.tsx        # Monaco editor wrapper
│   │   ├── FileTree.tsx          # File management system
│   │   └── PromptInput.tsx       # AI prompt interface
│   ├── types/
│   │   └── index.ts              # TypeScript definitions
│   └── utils/
│       └── fileUtils.ts          # File manipulation utilities
├── public/                       # Static assets
├── tailwind.config.ts           # Tailwind configuration
└── next.config.ts              # Next.js configuration
```

---

## 🎯 Usage Guide

### 1. **Generate Code Projects**
- Enter a natural language description in the prompt area
- Examples:
  - "Create a React todo app with dark theme"
  - "Build a Node.js Express API with authentication"
  - "Make a Python data analysis script"

### 2. **File Management**
- **Create Files**: Click the + button in file tree
- **Edit Code**: Select any file to open in the Monaco editor
- **Delete Files**: Right-click files for context menu
- **Download Project**: Use the export button to download as zip

### 3. **Mobile Navigation**
- **Generate Tab**: AI code generation interface
- **Files Tab**: Project file management
- **Code Tab**: Monaco code editor
- **Sidebar**: Access file tree with hamburger menu

---

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15.5.3**: React framework with App Router
- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first CSS framework
- **Monaco Editor**: VS Code editor integration

### **Backend**
- **Next.js API Routes**: Serverless functions
- **Google Gemini AI**: Advanced code generation
- **File System APIs**: Project management

### **Developer Experience**
- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing
- **Hot Reload**: Real-time development updates

---

## 🚦 API Reference

### Generate Code Endpoint
```typescript
POST /api/generate
Content-Type: application/json

{
  "prompt": "Your project description"
}

Response:
{
  "files": [
    {
      "id": "unique-id",
      "name": "filename.ext",
      "content": "file content",
      "type": "file",
      "path": "folder/path"
    }
  ],
  "error": null
}
```

---

## 🎨 Customization

### **Themes**
Modify `src/app/globals.css` to customize colors:
```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --background-dark: #0f0f23;
  --accent-color: #8b5cf6;
}
```

### **AI Prompts**
Enhance generation in `src/app/api/generate/route.ts`:
```typescript
const enhancedPrompt = `
  Create a complete project for: ${prompt}
  Include proper file structure, dependencies, and documentation.
  Use modern best practices and clean code principles.
`;
```

---

## 📱 Mobile Optimization

### **Touch Interactions**
- Swipe gestures for navigation
- Touch-friendly button sizes (44px minimum)
- Haptic feedback integration
- Pull-to-refresh functionality

### **Performance**
- Lazy loading for components
- Image optimization
- Code splitting
- Service worker caching

---

## 🧪 Development

### **Local Development**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### **Environment Variables**
```env
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
npm i -g vercel
vercel --prod
```

### **Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### **Environment Setup**
Add environment variables in your deployment platform:
- `GEMINI_API_KEY`: Your Google Gemini API key
- `NEXT_PUBLIC_APP_URL`: Your production URL

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful code generation
- **Monaco Editor** for the professional editing experience
- **Next.js Team** for the amazing React framework
- **Tailwind CSS** for the utility-first styling system
- **Vercel** for seamless deployment platform

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/marwaniiwael18">@marwaniiwael18</a></p>
  <p>⚡ <strong>CodeWave</strong> - Where AI meets Development</p>
</div>
