import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AgentProvider, type Agent, type Conversation } from '@ag-ui/client'

// Fake data moved from App.tsx
const iso = (d: Date) => d.toISOString()

const fakeAgents: Agent[] = [
  {
    id: 'a1',
    name: 'Research Agent',
    description: 'Answers questions using web research and summarizes in Markdown.',
    type: 'chat',
    emoji: '🔎',
    color: '#1f6feb',
  },
  {
    id: 'a2',
    name: 'Form Assistant',
    description: 'Collects details and produces a neat Markdown summary.',
    type: 'form',
    emoji: '📝',
    color: '#7c4dff',
  },
  {
    id: 'a3',
    name: 'Notebook Agent',
    description: 'A simple Markdown notebook. Write and preview in real-time.',
    type: 'notebook',
    emoji: '📒',
    color: '#00b894',
  },
]

const seedConversations: Conversation[] = [
  {
    id: 'c1',
    agentId: 'a1',
    title: 'Getting started with GraphQL',
    messages: [
      {
        id: 'm1',
        role: 'user',
        content: 'What is GraphQL? Can you explain with a small example?\n\nAlso output in Markdown.',
        timestamp: iso(new Date()),
      },
      {
        id: 'm2',
        role: 'assistant',
        content: 'GraphQL is a query language for APIs... \n\n```js\nconst query = `{ user { id name } }`\n```',
        timestamp: iso(new Date()),
        versions: [
          {
            id: 'v1',
            content: '# GraphQL Basics\n\n- GraphQL lets clients specify exactly what data they need\n- Strongly typed schema\n\n```graphql\ntype User { id: ID! name: String! }\n```',
            timestamp: iso(new Date()),
          },
          {
            id: 'v2',
            content: '## GraphQL in a nutshell\n\nYou define a schema, then query only the fields you need.\n\nExample query:\n```graphql\n{ user { id name } }\n```',
            timestamp: iso(new Date()),
          },
        ],
      },
    ],
  },
  {
    id: 'c2',
    agentId: 'a3',
    title: 'Design notes',
    messages: [
      {
        id: 'm3',
        role: 'user',
        content: '# Ideas\n\n- Three-pane layout\n- Cards for agents\n- Markdown everywhere',
        timestamp: iso(new Date()),
        versions: [
          { id: 'v3', content: '# Ideas (rev 1)\n- Layout\n- Cards\n- MD', timestamp: iso(new Date()) },
          { id: 'v4', content: '# Ideas (rev 2)\n- Layout tweaks\n- Keyboard shortcuts', timestamp: iso(new Date()) },
        ],
      },
    ],
  },
]


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AgentProvider initialAgents={fakeAgents} initialConversations={seedConversations}>
      <App />
    </AgentProvider>
  </StrictMode>,
)
