# Using This Template

This is a GitHub template repository with automatic variable replacement.

## Quick Start

1. **Click "Use this template"** on GitHub
2. **Create a new repository** from this template
   - Enter your repository name (e.g., "my-awesome-project") - used for package name
   - **Add a description** (e.g., "My Awesome Project") - used for display titles and headings
3. **Clone your new repository**:

   ```bash
   git clone <your-repo-url>
   cd <your-repo-name>
   ```

4. **Install dependencies**:

   ```bash
   npm install
   ```

5. **Start developing**:

   ```bash
   npm run start
   ```

## Automatic Variable Replacement

GitHub automatically replaces these variables when you create a repository from this template:

- `{{ repo }}` → Your repository name
- `{{ owner }}` → Your GitHub username/organization
- `{{ name }}` → Same as `{{ repo }}`
- `{{ description }}` → Repository description (if provided)

### What Gets Replaced

- **package.json**: `"name": "{{ repo | downcase }}"` → Your repository name in lowercase (for npm package name)
- **index.html**: `<title>{{ description }}</title>` → Repository description (for display title)
- **README.md**: `# {{ description }}` → Repository description (for main heading)

## Workspace File

The workspace file `project.code-workspace` will be copied as-is. You can manually rename it to match your project name if desired.

## Features

This template includes:

- ⚡️ **Vite** - Next generation frontend tooling
- ⚛️ **React 18** - Latest React features
- 🎨 **Tailwind CSS 4** - Utility-first CSS framework
- 📘 **TypeScript** - Type-safe development
- 🏗️ **Atomic Design** - Organized component structure
- 🔧 **ESLint** - Code linting with shared config
- 💅 **Prettier** - Code formatting

## Notes

- GitHub template variables only work in **plain text files**
- Variables are replaced automatically when using "Use this template" on GitHub
- No manual setup required!
