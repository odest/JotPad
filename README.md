<p align="center">
<img src="https://raw.githubusercontent.com/odest/JotPad/refs/heads/master/apps/native/src-tauri/icons/icon.png" alt="logo" width="80" height="80"/>
</p>

<div align="center">

JotPad
===========================

JotPad is an open-source, cross-platform note-taking application that allows you to take notes in a unique way – by sending messages to yourself, just like a chat app.

</div>

<div align="center">
  <picture>
    <source srcset="https://raw.githubusercontent.com/odest/JotPad/refs/heads/master/apps/native/public/screenshot_light.png" media="(prefers-color-scheme: light)">
    <source srcset="https://raw.githubusercontent.com/odest/JotPad/refs/heads/master/apps/native/public/screenshot_dark.png" media="(prefers-color-scheme: dark)">
    <img src="https://raw.githubusercontent.com/odest/JotPad/refs/heads/master/apps/native/public/screenshot_dark.png" alt="screenshot">
  </picture>
</div>

<br>

## Features

- **Chat-Based Note-Taking**: Jot down your thoughts and ideas through a chat interface, similar to popular messaging apps like WhatsApp.
- **Cross-Platform**: Available on Web, Desktop (Windows, Linux, macOS), and Mobile (Android, iOS) platforms.
- **Built with Modern Technologies**: The app leverages Next.js, Tauri, Rust, TypeScript, React, TailwindCSS, ShadCN UI, and Lucide Icons to provide a sleek and efficient experience.
- **Open Source (FOSS)**: JotPad is released under the GPL-3.0 license, making it free for anyone to use, modify, and contribute to.

JotPad brings simplicity to note-taking, turning your notes into a conversation with yourself!

<br>

## Getting Started

### Prerequisites

Ensure the following tools are installed:

- **Node.js** (v22+)
- **pnpm** (v8+)
- **Rust** ([Install Rust](https://www.rust-lang.org/tools/install))
- **Xcode** (for iOS development) _(Optional)_
- **Android Studio** (for Android development) _(Optional)_

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/odest/JotPad.git
   cd JotPad
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

### Running the Apps

#### Web (Next.js):

```bash
pnpm --filter web dev
```

#### Desktop (Tauri):

```bash
pnpm --filter native dev
```

#### Mobile (iOS/Android via Tauri):

Refer to the [Tauri Mobile
Guide](https://tauri.app/develop/#using-xcode-or-android-studio) for additional
setup.

### Shared Components

The `packages/ui` directory contains shared UI components, hooks, and utilities
built with:

- [TailwindCSS](https://tailwindcss.com/)
- [Shadcn](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)

These components ensure consistency across web, desktop, and mobile platforms.

<br>

## Folder Structure

```plaintext
.
├── apps
│   ├── landing            # Next.js app for landing page
│   ├── web                # Next.js app for web and API
│   ├── native             # Tauri app for desktop and mobile
├── packages
│   ├── ui                 # Shared components, styles, and utilities
│   ├── typescript-config  # Shared TypeScript configurations
│   ├── eslint-config      # Shared ESLint configurations
└── turbo.json             # TurboRepo configuration
```

<br>

## Commands

- **`pnpm dev`**: Start the development server for all apps.
- **`pnpm tauri`**: Exposes the Tauri CLI for running the desktop or mobile app.
- **`pnpm tauri dev`**: Start the Tauri desktop app in development mode.
- **`pnpm tauri android dev`**: Start the Tauri android app in development mode.
- **`pnpm tauri ios dev`**: Start the Tauri iOS app in development mode.
- **`pnpm lint`**: Lint the codebase using ESLint.
- **`pnpm format`**: Format the codebase using Prettier.
- **`pnpm clean`**: Remove all build artifacts.
- **`pnpm check-types`**: Check TypeScript types.
- **`pnpm shadcn`**: Exposes the Shadcn CLI for generating components.

<br>

## Contributing

Contributions are welcome! Please fork the repository and create a pull request
with your changes.

<br>

## License

This project is licensed under the [GPL-3.0 license](LICENSE).
