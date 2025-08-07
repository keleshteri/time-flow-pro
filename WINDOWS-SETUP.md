# TimeFlow Pro - Windows Setup Guide

## 🪟 Windows-Specific Instructions

### Prerequisites
1. **Node.js 18+** - Download from [nodejs.org](https://nodejs.org/)
2. **Git for Windows** - Download from [git-scm.com](https://git-scm.com/)
3. **PowerShell 5.1+** (included with Windows 10/11)

### Quick Setup

```powershell
# Clone the repository
git clone https://github.com/your-username/time-flow-pro.git
cd time-flow-pro

# Install dependencies
npm install

# Build the application
npm run build

# Start development server
npm run serve
```

Visit `http://localhost:3000/dist` to see TimeFlow Pro!

### Windows-Specific Scripts

We've included Windows-compatible scripts:

#### PowerShell Deployment Script
```powershell
# Deploy to all platforms
.\deploy.ps1

# Deploy to specific platform
.\deploy.ps1 netlify
.\deploy.ps1 vercel
.\deploy.ps1 cloudflare
```

#### npm Scripts (Cross-Platform)
```powershell
npm run dev          # Start development with hot reload
npm run build        # Build for production
npm run serve        # Start local server
npm run type-check   # Run TypeScript checking
npm run lint         # Run ESLint
npm run format       # Format code
```

### Development Workflow

1. **Start Development Mode:**
   ```powershell
   npm run dev
   ```
   This starts both the build watcher and the development server.

2. **Make Changes:**
   - Edit files in `src/`
   - Changes automatically reload in browser

3. **Build for Production:**
   ```powershell
   npm run build
   ```

4. **Deploy:**
   ```powershell
   .\deploy.ps1 netlify
   ```

### Troubleshooting

#### Command Not Found Errors
If you see "command not found" errors:

1. **PowerShell Execution Policy:**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

2. **Missing Global Tools:**
   ```powershell
   npm install -g netlify-cli vercel wrangler
   ```

#### Build Issues
1. **Clean Node Modules:**
   ```powershell
   Remove-Item -Recurse -Force node_modules
   npm install
   ```

2. **Clean Build Directory:**
   ```powershell
   Remove-Item -Recurse -Force dist
   npm run build
   ```

#### PowerShell vs Command Prompt
- Use **PowerShell** (recommended) for all commands
- Avoid Command Prompt (cmd) as it has different syntax

### IDE Setup (VS Code on Windows)

1. **Install VS Code Extensions:**
   - TypeScript and JavaScript Language Features
   - ESLint
   - Prettier - Code formatter
   - Live Server

2. **VS Code Settings (`.vscode/settings.json`):**
   ```json
   {
     "typescript.preferences.importModuleSpecifier": "relative",
     "editor.formatOnSave": true,
     "editor.defaultFormatter": "esbenp.prettier-vscode"
   }
   ```

### Windows Terminal Setup

For the best experience, use Windows Terminal:

1. Install from Microsoft Store
2. Set PowerShell as default profile
3. Enable developer features in Windows Settings

### Deployment Platforms

#### Netlify (Recommended)
```powershell
# Install CLI
npm install -g netlify-cli

# Login
netlify login

# Link site
netlify link

# Deploy
.\deploy.ps1 netlify
```

#### Vercel
```powershell
# Install CLI  
npm install -g vercel

# Login
vercel login

# Deploy
.\deploy.ps1 vercel
```

#### Cloudflare Pages
```powershell
# Install CLI
npm install -g wrangler

# Login
wrangler login

# Deploy
.\deploy.ps1 cloudflare
```

### Performance Tips for Windows

1. **Exclude from Windows Defender:**
   - Add `node_modules` folder to exclusions
   - Add your project folder to exclusions

2. **Use SSD Storage:**
   - Keep project on SSD for faster builds

3. **Close Unnecessary Programs:**
   - TypeScript compilation is CPU intensive

### File System Considerations

Windows file paths use backslashes (`\`), but our build process automatically handles cross-platform paths. No manual changes needed.

### Next Steps

1. Complete the setup above
2. Start with Epic 1: Foundation & Core Time Tracking
3. Follow the main development roadmap in README.md

## Support

- Main docs: [README.md](README.md)
- Architecture: [docs/architecture.md](docs/architecture.md)
- Issues: GitHub Issues