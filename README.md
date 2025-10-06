# Agents UI

A three-pane Agent interface built with React and TypeScript, showcasing multiple agent types with state management.

## Features

- Three-pane layout powered by `@ag-ui/core`
  - Left: Agent list with selectable cards
  - Middle: Dynamic workspace (Chat/Form/Notebook)
  - Right: Message history panel
- Integrated with `@ag-ui/client` components
- Automatic dark/light theme detection with manual toggle
- Theme persistence using localStorage
- TypeScript with strict type checking

## Tech Stack

- React 19
- TypeScript 5.8
- Vite 7
- @ag-ui/core ^0.0.39
- @ag-ui/client ^0.0.40

## Project Structure

```
src/
  ├── App.tsx        # Main application component
  ├── App.css        # Component-specific styles
  ├── index.css      # Global styles and theme variables
  └── main.tsx       # Application entry point
```

## Development

Prerequisites:
- Node.js 18+
- npm/yarn

Setup:
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Architecture

- Uses `AgentProvider` for state management
- Implements theme switching via CSS and data-theme attributes
- Components are provided by @ag-ui/client:
  - AgentList
  - ChatPane
  - FormPane
  - NotebookPane
  - MessageHistory

## Configuration

The project uses:
- TypeScript project references (tsconfig.json, tsconfig.app.json, tsconfig.node.json)
- ESLint with TypeScript and React plugins
- Vite for development and building

## Theme Support

Themes are managed through:
- CSS variables in index.css
- data-theme attribute on :root
- Automatic system preference detection
- Manual toggle with localStorage persistence

## Notes

- Mock data for development is provided in main.tsx
- Strict TypeScript configuration enabled
- ESLint configured for React hooks and refresh
