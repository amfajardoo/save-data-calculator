# 🎴 CZN Save Data Calculator

> **Optimize your Faint Memory and maximize your progress in Chaos Zero Nightmare**

A powerful, real-time calculator for managing your Save Data in Chaos Zero Nightmare. Built with Angular 19, featuring SSR (Server-Side Rendering) and a beautiful, responsive UI.

![Angular](https://img.shields.io/badge/Angular-19-DD0031?style=flat&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?style=flat&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

## ✨ Features

### 🃏 **Deck Management**
- Manage basic, unique, neutral, forbidden, and monster cards
- Visual card representation with images
- Real-time deck composition tracking
- Support for up to 3 characters simultaneously

### ⚡ **Epiphany System**
- Apply Regular and Divine Epiphanies
- Automatic FM bonus calculation based on card type
- Visual indicators for epiphany status on cards
- Easy epiphany removal and management

### 🎯 **Strategic Actions**
- **Duplicate**: Clone cards to boost your deck
- **Remove**: Eliminate unnecessary cards with calculated costs
- **Convert**: Transform basic cards into neutral cards
- Progressive cost system for repeated actions

### 📊 **Real-Time Calculations**
- Instant FM (Faint Memory) calculation
- Detailed history log of all contributions
- Automatic CAP enforcement based on Tier
- Visual feedback for every action

### ⏮️ **Undo System**
- Revert up to 20 previous actions
- Experiment freely without fear of losing progress
- Clear action history tracking

### 🎨 **Beautiful UI**
- Modern, dark-themed interface
- Responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Intuitive card interactions

## 🚀 Live Demo

🔗 **[Try it now!](https://save-data-calculator.vercel.app)**

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Angular CLI (v19)

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/save-data-calculator.git

# Navigate to project directory
cd save-data-calculator

# Install dependencies
npm install
```

## 💻 Development

```bash
# Start development server
npm run dev

# Open browser at http://localhost:4200
```

## 🏗️ Build

```bash
# Build for production
npm run build

# Build with SSR
npm run build:ssr

# Serve SSR build
npm run serve:ssr
```

## 📦 Tech Stack

### **Frontend**
- **Angular 19** - Latest version with zoneless change detection
- **TypeScript 5.7** - Type-safe development
- **TailwindCSS 4.0** - Utility-first CSS framework
- **Angular CDK** - Component Dev Kit for dialogs and overlays

### **State Management**
- **Angular Signals** - Reactive state management
- Custom state service with computed values
- History manager for undo functionality

### **Rendering**
- **Angular SSR** - Server-Side Rendering
- **Prerendering** - Static page generation
- **Client Hydration** - Fast interactivity

### **Architecture**
- **Domain-Driven Design** - Clean separation of concerns
- **Service Layer** - Business logic isolation
- **Factory Pattern** - Card creation management

## 📁 Project Structure

```
src/
├── app/
│   ├── common/                 # Shared components & modals
│   │   ├── add-card-modal.ts
│   │   ├── epiphany-modal.ts
│   │   ├── select-character-modal.ts
│   │   ├── modal.ts
│   │   └── constants.ts
│   │
│   ├── domain/                 # Business logic
│   │   ├── models/            # Type definitions
│   │   └── services/          # Core services
│   │       ├── card-factory.ts
│   │       ├── czn.ts
│   │       ├── faint-memory-calculator.ts
│   │       ├── faint-memory-state.ts
│   │       └── history-manager.ts
│   │
│   ├── presentation/           # UI components
│   │   ├── components/
│   │   │   ├── character-data/
│   │   │   ├── global-config/
│   │   │   └── undo-button/
│   │   └── pages/
│   │       ├── home/          # Landing page
│   │       └── save-data/     # Calculator page
│   │
│   ├── app.config.ts          # App configuration
│   ├── app.routes.ts          # Client routes
│   └── app.routes.server.ts   # Server routes
│
├── styles.css                  # Global styles
└── index.html                 # Entry point
```

## 🎮 How to Use

### 1️⃣ **Set Your Tier**
Define your run's difficulty level. Each tier has a different FM CAP that you need to optimize.

### 2️⃣ **Build Your Deck**
- Add characters with their initial cards
- Incorporate neutral, forbidden, and monster cards based on your strategy

### 3️⃣ **Optimize with Actions**
- Apply epiphanies to valuable cards
- Duplicate important cards
- Remove unnecessary cards
- Convert basic cards to neutral

### 4️⃣ **Maximize Your FM**
Watch the automatic calculation and adjust your strategy until you reach the optimal CAP for your tier.

## 📐 FM Calculation Rules

### **Card Contributions**
- Neutral/Forbidden: **+20 FM**
- Monster: **+80 FM**
- Basic/Unique: **+0 FM** (base value)

### **Epiphany Bonuses**
- Regular (on Neutral/Forbidden/Monster): **+10 FM**
- Divine: **+20 FM** (always applied)

### **Action Costs**
- **Removals**: 0, -10, -30, -50, -70 (progressive)
- **Character Card Removal Bonus**: +20 FM each
- **Duplications**: 0, 10, 30, 50, 70 (progressive)
- **Conversions**: +10 FM each

### **CAP System**
- Base CAP = 10 × (Tier - 1) + 30
- Nightmare Mode: +10 FM to CAP

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Chaos Zero Nightmare** community for inspiration
- All players who provided feedback and suggestions
- Contributors who helped improve the calculator

## 🐛 Bug Reports

Found a bug? Please open an issue on [GitHub Issues](https://github.com/yourusername/save-data-calculator/issues)

## 📧 Contact

For questions or suggestions, feel free to reach out or open a discussion on GitHub.

---

<div align="center">

**Made with ❤️ by the CZN Community**

⭐ Star this repo if you find it helpful!

</div>