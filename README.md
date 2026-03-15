<div align="center">
  <img src="https://raw.githubusercontent.com/odest/JotPad/refs/heads/master/apps/native/src-tauri/icons/icon.png" alt="JotPad Logo" width="100" height="100"/>
  
  # JotPad
  
  **Chat-Based Note-Taking for the Modern World**
  
  [![License: GPL-3.0](https://img.shields.io/badge/License-GPL%203.0-green.svg)](https://opensource.org/licenses/GPL-3.0)
  [![Version](https://img.shields.io/github/v/release/odest/JotPad?label=Version&-orange.svg)](https://github.com/odest/JotPad/releases/latest)
  [![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Desktop%20%7C%20Mobile-blue.svg)](https://jotpad.odest.dev)
  [![Made with](https://img.shields.io/badge/Made%20with-Tauri%20%7C%20React%20%7C%20Rust-red.svg)](https://tauri.app)
</div>

<div align="center">
  <picture>
    <source srcset="https://raw.githubusercontent.com/odest/JotPad/refs/heads/master/apps/native/public/screenshot_light.png" media="(prefers-color-scheme: light)">
    <source srcset="https://raw.githubusercontent.com/odest/JotPad/refs/heads/master/apps/native/public/screenshot_dark.png" media="(prefers-color-scheme: dark)">
    <img src="https://raw.githubusercontent.com/odest/JotPad/refs/heads/master/apps/native/public/screenshot_dark.png" alt="JotPad Screenshot" width="800">
  </picture>
</div>

<br>

## Table of Contents
- [What is JotPad?](#-what-is-jotpad)
- [Key Features](#-key-features)
  - [Core Functionality](#-core-functionality)
  - [Customization \& Experience](#-customization--experience)
  - [Data Management](#-data-management)
  - [Technical Excellence](#-technical-excellence)
- [Technology Stack](#️-technology-stack)
  - [Frontend](#-frontend)
  - [Backend \& Runtime](#-backend--runtime)
  - [Architecture](#️-architecture)
- [Supported Platforms](#-supported-platforms)
- [Limitations and Warnings](#️-limitations-and-warnings)
- [Quick Start](#-quick-start)
  - [Prerequisites](#-prerequisites)
  - [Installation](#-installation)
  - [Building for Production](#-building-for-production)
- [Development Commands](#-development-commands)
- [Project Structure](#-project-structure)
- [Internationalization](#-internationalization)
- [Contributing](#-contributing)
  - [Bug Reports](#-bug-reports)
  - [Feature Requests](#-feature-requests)
  - [Translations](#-translations)
  - [Code Contributions](#-code-contributions)
  - [Development Guidelines](#-development-guidelines)
- [License](#-license)

<br>

## 🚀 What is JotPad?

JotPad is a **FOSS note-taking application** that transforms the way you capture and organize your thoughts. Instead of traditional note-taking, JotPad lets you **message yourself** - just like your favorite chat apps! 💬

Imagine having a conversation with yourself where every message becomes a note entry, complete with timestamps, markdown support, and powerful organization features. It's note-taking reimagined for the digital age! ✨

<br>

## ✨ Key Features

### 🎯 Core Functionality
- **Chat-Based Note-Taking**: Send messages to yourself with a familiar chat interface
- **Smart Tagging**: Organize notes with color-coded tags for easy categorization
- **Powerful Search**: Find notes and entries instantly with real-time search
- **Timestamp Tracking**: Every entry is automatically timestamped

### 🎨 Customization & Experience
- **Theme Support**: Light, dark, and system theme modes
- **Color Themes**: 8 beautiful color schemes to match your style
- **Custom Backgrounds**: Set your own background images with opacity controls
- **Multi-Language**: Support for 10+ languages including Arabic, Chinese, Japanese, and more

### 📊 Data Management
- **Local Storage**: All data stored locally in SQLite database
- **Export Options**: Export notes in JSON, TXT, or Markdown formats
- **Auto-Save**: Never lose your work with automatic saving
- **Smart Deletion**: Safe deletion with confirmation dialogs

### 🔧 Technical Excellence
- **Performance**: Built with Rust backend for lightning-fast performance
- **Security**: Local-first approach ensures your data privacy
- **Auto-Updates**: Automatic update checking and notifications
- **No Analytics**: No tracking or data collection

<br>

## 🛠️ Technology Stack

JotPad is built with modern, cutting-edge technologies:

### 🎯 Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **ShadCN UI** - Beautiful, accessible components
- **Lucide Icons** - Consistent iconography

### ⚡ Backend & Runtime
- **Tauri 2** - Cross-platform desktop framework
- **Rust** - High-performance system programming
- **SQLite** - Lightweight, local database
- **Next.js** - Web application framework

### 🏗️ Architecture
- **Monorepo** - TurboRepo for efficient development
- **Shared Components** - Consistent UI across platforms
- **Internationalization** - i18next for multi-language support
- **State Management** - React hooks for clean state handling

<br>

## 📱 Supported Platforms

| Platform | Status | Download |
|----------|--------|----------|
| **🪟 Windows** | ✅ Available | [Download](https://github.com/odest/JotPad/releases/latest) |
| **🍎 macOS** | ✅ Available | [Download](https://github.com/odest/JotPad/releases/latest) |
| **🐧 Linux** | ✅ Available | [Download](https://github.com/odest/JotPad/releases/latest) |
| **🤖 Android** | ✅ Available | [Download](https://github.com/odest/JotPad/releases/latest) |
| **📱 iOS** | 🚧 Coming Soon | - |
| **🌐 Web** | 🚧 Coming Soon | - |

<br>

## ⚠️ Limitations and Warnings

**Please read carefully before using JotPad in its current development stage.**

- **Offline-First Only**  
  JotPad is designed as an offline-first application. At this time, there is **no** built-in synchronization between devices or platforms. All your notes are stored locally on the device where they were created.

- **Not for Critical Data**  
  Because JotPad is still under active development, unexpected bugs or crashes may occur. We **strongly** recommend **not** using JotPad to store irreplaceable or mission-critical information until synchronization and stability have been fully implemented and tested.

- **Potential Data Loss**  
  As features evolve, database schema changes or unanticipated errors could lead to data loss. Please export or back up your notes regularly (e.g., via JSON, TXT, or Markdown export) to safeguard your content.

- **Cross-Platform Testing Incomplete**  
  While JotPad aims to run on Web, Desktop (Windows, macOS, Linux) and Mobile (Android, iOS), not every combination of device, browser or OS has been exhaustively tested. You may encounter layout issues, performance quirks, or platform-specific bugs.

- **Feedback Welcome**  
  Your input helps us improve. If you experience any issues or have suggestions, please open an issue on GitHub describing the problem, your environment, and any relevant logs or screenshots.

Thank you for trying JotPad during its early stages. We appreciate your understanding and patience as we work towards a robust, fully synchronized note-taking experience! 🚀

<br>

## 🚀 Quick Start

### 📋 Prerequisites

> [!NOTE]
> For detailed information you can refer to Tauri's official documents: [Prerequisites](https://tauri.app/start/prerequisites/)

Before you begin, ensure you have the following installed:

- **Node.js** (v22 or higher) - [Download](https://nodejs.org/)
- **pnpm** (v8 or higher) - [Install Guide](https://pnpm.io/installation)
- **Rust** (latest stable) - [Install Guide](https://www.rust-lang.org/tools/install)

**Optional for Mobile Development:**
- **Xcode** (for iOS development) - [Download](https://developer.apple.com/xcode/)
- **Android Studio** (for Android development) - [Download](https://developer.android.com/studio)

### 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/odest/JotPad.git
   cd JotPad
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development**
   ```bash
   # For web development
   pnpm --filter web dev
   
   # For desktop development
   pnpm --filter native dev
   
   # For all platforms
   pnpm dev
   ```

### 📦 Building for Production

```bash
# Build all applications
pnpm build

# Build specific platform
pnpm --filter native build
pnpm --filter web build
pnpm --filter landing build
```

<br>

## 🎮 Development Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development servers for all apps |
| `pnpm build` | Build all applications for production |
| `pnpm lint` | Run ESLint across the codebase |
| `pnpm format` | Format code with Prettier |
| `pnpm clean` | Remove all build artifacts |
| `pnpm check-types` | Check TypeScript types |
| `pnpm tauri dev` | Start Tauri desktop app in development |
| `pnpm tauri android dev` | Start Tauri Android app in development |
| `pnpm tauri ios dev` | Start Tauri iOS app in development |

<br>

## 📁 Project Structure

```
JotPad/
├── apps/
│   ├── landing/            # 🌐 Landing page (Next.js)
│   ├── web/                # 🌐 Web application (Next.js)
│   └── native/             # 📱 Desktop & Mobile (Tauri)
│       ├── src/            # 🎨 Frontend React code
│       └── src-tauri/      # ⚡ Backend Rust code
├── packages/
│   ├── ui/                 # 🎨 Shared UI components
│   ├── typescript-config/  # ⚙️ TypeScript configurations
│   └── eslint-config/      # 🔍 ESLint configurations
```

<br>

## 🌍 Internationalization

JotPad supports **10+ languages** out of the box:

- English (🇺🇸)
- Spanish (🇪🇸)
- French (🇫🇷)
- German (🇩🇪)
- Russian (🇷🇺)
- Japanese (🇯🇵)
- Chinese (🇨🇳)
- Turkish (🇹🇷)
- Arabic (🇦🇪)
- Hindi (🇮🇳)

Language files are located in `packages/ui/locales/` and use the i18next framework.

> [!IMPORTANT]
> Please note that these translations were generated by AI. Some phrases or expressions may not be perfect.

<br>

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### 🐛 Bug Reports
- Use the [GitHub Issues](https://github.com/odest/JotPad/issues) page
- Include detailed steps to reproduce the issue
- Provide system information and error logs

### 💡 Feature Requests
- Submit feature requests through [GitHub Issues](https://github.com/odest/JotPad/issues)
- Describe the use case and expected behavior
- Consider contributing the implementation

### 🌍 Translations
- Check if your language already exists under the `locales/` directory
- If not, create a new language file (e.g., `locales/en/translation.json` for English)
- Either add a new translation or fix an existing one
- Ensure translation keys are consistent and contextually correct
- Once complete, follow the code contribution steps above to submit a Pull Request

### 🔧 Code Contributions
1. Fork the repository
2. Create a feature branch (`git checkout -b my-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add a descriptive message about your changes'`)
6. Push to the branch (`git push origin my-feature`)
7. Open a Pull Request

### 📝 Development Guidelines
- Follow the existing code style and conventions
- Add TypeScript types for all new functions
- Test your changes across different platforms
- Update documentation as needed

<br>

## 📄 License

This project is licensed under the **GNU General Public License v3.0** - see the [LICENSE](LICENSE) file for details.

The GPL-3.0 license ensures that:
- ✅ The software remains free and open source
- ✅ Derivative works must also be open source
- ✅ Users have the right to modify and distribute the code
- ✅ The community benefits from all improvements
