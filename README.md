# Agents UI (React + TypeScript + Vite)

A three‑pane Agent interface showcasing multiple agent types and a Claude‑like message history experience. The app includes:

- Left pane: Agents displayed as selectable cards (with emoji, color, description)
- Middle pane: Dynamic workspace that switches between Chat, Form, or Markdown Notebook depending on the selected agent
- Right pane: Previous messages for the current agent with per‑message version history (similar to Claude "History")
- Full Markdown rendering in the middle pane using the `marked` library
- Light/Dark theme toggle in the top bar with persistence via `localStorage`
- Seeded, realistic fake data for agents, conversations, messages, and versions

This project was bootstrapped with Vite and uses React + TypeScript.

## Features

- Three vertical sections (Agents • Workspace • History)
- Agent types: `chat`, `form`, and `notebook`
  - Chat: threaded conversation + composer with Markdown
  - Form: simple data collection + live Markdown preview
  - Notebook: Markdown editor with live preview and save
- Markdown support everywhere relevant (code blocks, lists, headings, etc.) via `marked`
- Message “versions” panel for quick comparison of alternative responses
- Theme switcher (Dark/Light) with `data-theme` on `<html>` and persistence to `localStorage`
- Responsive layout hides the right pane on smaller screens

## Tech stack

- React 19
- TypeScript 5
- Vite 7
- marked 12 (Markdown renderer)
- Minimal CSS (no UI framework)

## Quick start

Prerequisites: Node.js 18+ and npm.

- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Build for production: `npm run build`
- Preview production build: `npm run preview`
- Lint: `npm run lint`

The dev server will print a local URL (usually http://localhost:5173).

## Where things live

- `src/App.tsx` — Main UI: three‑pane layout, theme toggle, agent logic, seeded fake data
  - Edit `fakeAgents` and `seedConversations` to change the demo data
- `src/App.css` — Layout and component styles for the three panes
- `src/index.css` — App‑wide styles and explicit dark/light theme rules using `:root[data-theme]`
- `src/main.tsx` — App bootstrap
- `index.html` — Vite HTML entry

## Theming

- Toggle button is in the middle header (top right)
- Theme value (`"light" | "dark"`) is stored in `localStorage` key `theme`
- The active theme is applied to `<html>` as `data-theme="light" | "dark"`

## Markdown

- Rendering is powered by `marked`
- Code fences, headings, lists, and blockquotes are supported; styles are in `App.css`

## Notes

- This is a front‑end demo with mock data—no backend is included
- The UI is responsive; on narrow viewports the right history pane is hidden

## License

No license has been specified. Use at your own discretion for demos and experimentation.
