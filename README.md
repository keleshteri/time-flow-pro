# TimeFlow Pro

Professional time tracking and billing management for freelancers and consultants.

![TimeFlow Pro](https://img.shields.io/badge/TimeFlow%20Pro-v1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- ⏱️ **Real-time Timer** - Accurate time tracking with millisecond precision
- 📊 **Professional Billing** - Separate billable vs tracked hours
- 🔄 **Three-Stage Payment Flow** - Ready to Bill → Billed → Paid
- 🌐 **Asana Integration** - Seamless task synchronization
- ☁️ **Cloud Sync** - Automatic backup with JSONBin.io
- 📱 **PWA Ready** - Works offline, installable
- 🎨 **Modern UI** - Clean, responsive design without frameworks

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Modern browser (Chrome 70+, Firefox 65+, Safari 12+, Edge 79+)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/time-flow-pro.git
cd time-flow-pro

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see TimeFlow Pro in action!

## 🏗️ Architecture

TimeFlow Pro uses a **framework-free architecture** built with:

- **TypeScript** - Type-safe development
- **Web Components** - Native, reusable UI components
- **CSS Grid/Flexbox** - Modern layouts without framework overhead
- **LocalStorage API** - Offline-first data persistence
- **Service Workers** - PWA capabilities and background sync

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run type-check   # Run TypeScript type checking
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Project Structure

```
src/
├── types/           # TypeScript type definitions
├── core/           # Core business logic (timer, storage, billing)
├── integrations/   # External API clients (Asana, JSONBin.io)
├── ui/             # UI components and controllers
├── utils/          # Shared utilities
└── styles/         # CSS styling
```

## 🚀 Deployment

TimeFlow Pro supports deployment to multiple platforms:

### One-Click Deployment

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/time-flow-pro)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/time-flow-pro)

### Manual Deployment

```bash
# Deploy to all platforms
./deploy.sh

# Deploy to specific platform
./deploy.sh netlify
./deploy.sh vercel
./deploy.sh cloudflare
```

### Platform Comparison

| Platform | Cost | Performance | Features | Best For |
|----------|------|-------------|----------|----------|
| **Netlify** | Free tier: 100GB/month | Global CDN | Forms, redirects | Most users |
| **Vercel** | Free tier: 100GB/month | Edge network | Analytics, domains | Performance focused |
| **Cloudflare Pages** | Unlimited bandwidth | Fastest global network | R2 integration | Advanced users |

## 📋 Development Roadmap

### Epic 1: Foundation & Core Time Tracking ✅
- [x] Project setup and basic HTML structure
- [ ] Real-time timer functionality
- [ ] Manual time entry system
- [ ] Local data persistence

### Epic 2: Task Management & Project Organization 🔄
- [ ] Project creation and management
- [ ] Task CRUD operations
- [ ] Time-to-task linking
- [ ] Progress visualization

### Epic 3: Asana Integration & Cloud Sync 📅
- [ ] Asana API authentication
- [ ] Task import and synchronization
- [ ] JSONBin.io cloud storage
- [ ] Offline/online sync

### Epic 4: Advanced Billing & Payment Tracking 📅
- [ ] Flexible billing rates
- [ ] Three-stage workflow
- [ ] Invoice generation
- [ ] Payment tracking

### Epic 5: Analytics & Reporting 📅
- [ ] Interactive dashboards
- [ ] Detailed reports
- [ ] Data visualization
- [ ] Export functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Architecture Documentation](docs/architecture.md)
- [Product Requirements](docs/prd.md)
- [Live Demo](https://timeflow-pro.netlify.app) (Coming soon)

---

Made with ❤️ by the TimeFlow Pro team