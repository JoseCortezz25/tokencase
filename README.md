# TokenCase - Figma Plugin

TokenCase is a Figma plugin designed to streamline the management and export of design tokens directly from your design files.

![Preview](.screenshot.png)

## ✨ Features

- **Visualize your styles:** Clearly and neatly displays all color tokens from your document.
- **Export preview:** Allows you to see how tokens will look in different formats before exporting.
- **Intuitive interface:** A clean and user-friendly interface built with React.
- **Efficient communication:** Robust communication between the plugin's UI and Figma's main thread.

## 🛠️ Tech Stack & Versions

This project is built with the following technologies:

- **Package Manager:** pnpm `8.6.3`
- **Core:**
  - React: `19.1.1`
  - Vite: `5.4.19`
  - TypeScript: `5.9.2`
- **Styling:**
  - Tailwind CSS: `4.1.12`
  - Lucide React: `0.536.0` (for icons)
- **Figma API:**
  - @figma/plugin-typings: `1.116.0`
- **Linting & Formatting:**
  - ESLint: `9.32.0`
  - Prettier: `3.6.2`

## 🚀 Getting Started

Follow these steps to set up the development environment.

**1. Install dependencies:**
You must use `pnpm` as the package manager.

```bash
pnpm install
```

**2. Start development mode:**
This command will compile the files and watch for changes to rebuild automatically.

```bash
pnpm run dev
```

**3. Load the plugin in Figma:**

- In Figma, go to `Plugins > Development > Import plugin from manifest...`
- Select the `manifest.json` file located in the `dist` folder generated in the previous step.
- And that's it! You can now run your plugin locally.

## 📦 Building for Production

To create a production-ready build of the plugin, run the following command. This will bundle all the necessary files into the `dist` folder, which can then be published.

```bash
pnpm build
```

## 📜 Available Commands

- `pnpm install`: Installs all dependencies.
- `pnpm dev`: Starts the development environment with hot-reloading.
- `pnpm build`: Generates the production build of the plugin in the `dist` folder.
- `pnpm lint`: Runs the linter (ESLint) to check code quality.
- `pnpm format`: Formats all project files with Prettier.
