import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { marked } from 'marked'

// Types
 type AgentType = 'chat' | 'form' | 'notebook'
 interface Agent {
  id: string
  name: string
  description: string
  type: AgentType
  emoji?: string
  color?: string
}

interface MessageVersion {
  id: string
  content: string
  timestamp: string
}

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  versions?: MessageVersion[]
}

interface Conversation {
  id: string
  agentId: string
  title: string
  messages: Message[]
}

// Fake data
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

const iso = (d: Date) => d.toISOString()

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

function MarkdownView({ text }: { text: string }) {
  const html = useMemo(() => marked.parse(text), [text])
  return <div className="markdown" dangerouslySetInnerHTML={{ __html: html }} />
}

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') return saved
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const [agents] = useState<Agent[]>(fakeAgents)
  const [conversations, setConversations] = useState<Conversation[]>(seedConversations)
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id ?? 'a1')
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)

  const currentAgent = agents.find(a => a.id === selectedAgentId) ?? agents[0]
  const currentConversation = conversations.find(c => c.agentId === currentAgent.id) ?? {
    id: 'new-' + currentAgent.id,
    agentId: currentAgent.id,
    title: 'New Conversation',
    messages: [],
  }

  const messages = currentConversation.messages
  const selectedMessage = messages.find(m => m.id === selectedMessageId) ?? null

  function ensureConversationForAgent(agentId: string) {
    const existing = conversations.find(c => c.agentId === agentId)
    if (existing) return existing
    const created: Conversation = { id: 'c-' + agentId, agentId, title: 'Untitled', messages: [] }
    setConversations(prev => [...prev, created])
    return created
  }

  function handleSelectAgent(agentId: string) {
    setSelectedAgentId(agentId)
    setSelectedMessageId(null)
  }

  function addMessage(content: string, role: Message['role'] = 'user') {
    const conv = ensureConversationForAgent(currentAgent.id)
    const msg: Message = {
      id: 'm-' + Math.random().toString(36).slice(2, 8),
      role,
      content,
      timestamp: iso(new Date()),
    }
    const updated = conversations.map(c => c.id === conv.id ? { ...c, messages: [...c.messages, msg] } : c)
    setConversations(updated)
    setSelectedMessageId(msg.id)
  }

  function addAssistantReply(basis: string) {
    // Fake two versions like Claude "History" suggestions
    const conv = ensureConversationForAgent(currentAgent.id)
    const reply: Message = {
      id: 'm-' + Math.random().toString(36).slice(2, 8),
      role: 'assistant',
      content: basis + '\n\n> Here is a concise answer.\n\n- Point A\n- Point B',
      timestamp: iso(new Date()),
      versions: [
        { id: 'v-' + Math.random().toString(36).slice(2,4), content: basis + '\n\n### Version 1\nA short, direct answer.', timestamp: iso(new Date()) },
        { id: 'v-' + Math.random().toString(36).slice(2,4), content: basis + '\n\n### Version 2\nA more detailed, structured answer with steps:\n1. Step one\n2. Step two', timestamp: iso(new Date()) },
      ],
    }
    const updated = conversations.map(c => c.id === conv.id ? { ...c, messages: [...c.messages, reply] } : c)
    setConversations(updated)
  }

  return (
    <div className="app">
      {/* Left: Agents */}
      <aside className="sidebar">
        <div className="sidebar-header">Agents</div>
        <div className="agent-list">
          {agents.map((a) => (
            <button
              key={a.id}
              className={"agent-card" + (a.id === currentAgent.id ? ' selected' : '')}
              onClick={() => handleSelectAgent(a.id)}
            >
              <span className="agent-emoji" aria-hidden>{a.emoji ?? '🤖'}</span>
              <div className="agent-meta">
                <div className="agent-name">{a.name}</div>
                <div className="agent-desc">{a.description}</div>
                <div className="agent-type">{a.type.toUpperCase()}</div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Middle: dynamic content with Markdown support */}
      <main className="middle">
        <header className="middle-header">
          <div className="title">
            <span className="bubble" style={{ backgroundColor: currentAgent.color }}>{currentAgent.emoji}</span>
            <div>
              <div className="h1">{currentAgent.name}</div>
              <div className="sub">{currentAgent.description}</div>
            </div>
          </div>
          <div className="top-actions">
            <button
              className="theme-toggle"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              aria-label="Toggle color theme"
            >
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </header>

        <section className="middle-content">
          {currentAgent.type === 'chat' && (
            <ChatPane messages={messages} onSend={(text) => { addMessage(text, 'user'); addAssistantReply(text) }} />
          )}
          {currentAgent.type === 'form' && (
            <FormPane onSubmit={(dataMd) => { addMessage(dataMd, 'user'); addAssistantReply('Thanks! I processed your form.') }} />
          )}
          {currentAgent.type === 'notebook' && (
            <NotebookPane onSave={(note) => addMessage(note, 'user')} />
          )}
        </section>
      </main>

      {/* Right: Previous messages + Versions */}
      <aside className="right">
        <div className="right-header">Previous messages</div>
        <div className="message-list">
          {messages.length === 0 && (
            <div className="empty">No messages yet. Start by sending something in the middle pane.</div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={"message-item" + (selectedMessageId === m.id ? ' selected' : '')} onClick={() => setSelectedMessageId(m.id)}>
              <div className="row">
                <span className={"role " + m.role}>{m.role}</span>
                <span className="time">{new Date(m.timestamp).toLocaleString()}</span>
              </div>
              <div className="preview" title={m.content}>{m.content.slice(0, 120)}{m.content.length > 120 ? '…' : ''}</div>
            </div>
          ))}
        </div>

        {selectedMessage && (
          <div className="versions">
            <div className="versions-title">History</div>
            {selectedMessage.versions?.length ? selectedMessage.versions.map(v => (
              <div key={v.id} className="version-card">
                <div className="row">
                  <span className="version-id">{v.id}</span>
                  <span className="time">{new Date(v.timestamp).toLocaleString()}</span>
                </div>
                <MarkdownView text={v.content} />
              </div>
            )) : (
              <div className="empty small">No versions for this message.</div>
            )}
          </div>
        )}
      </aside>
    </div>
  )
}

function ChatPane({ messages, onSend }: { messages: Message[]; onSend: (text: string) => void }) {
  const [input, setInput] = useState('Explain recursion with a simple example.\n\n- Use code\n- Keep it short')
  return (
    <div className="chat-pane">
      <div className="chat-thread">
        {messages.map(m => (
          <div key={m.id} className={"chat-bubble " + m.role}>
            <MarkdownView text={m.content} />
          </div>
        ))}
      </div>
      <div className="composer">
        <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message with Markdown…" />
        <button onClick={() => { if (input.trim()) { onSend(input.trim()); setInput('') } }}>Send</button>
      </div>
    </div>
  )
}

function FormPane({ onSubmit }: { onSubmit: (dataMarkdown: string) => void }) {
  const [name, setName] = useState('Ada Lovelace')
  const [email, setEmail] = useState('ada@example.com')
  const [goal, setGoal] = useState('Build an Agent UI with three panes and Markdown support.')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const md = `# Form Submission\n\n- **Name:** ${name}\n- **Email:** ${email}\n- **Goal:** ${goal}`
    onSubmit(md)
  }

  return (
    <div className="form-pane">
      <form onSubmit={handleSubmit} className="form">
        <label>
          <span>Name</span>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
        </label>
        <label>
          <span>Email</span>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@domain.com" />
        </label>
        <label>
          <span>Goal</span>
          <textarea value={goal} onChange={e => setGoal(e.target.value)} placeholder="What would you like to do?" />
        </label>
        <div className="actions">
          <button type="submit">Submit</button>
        </div>
      </form>
      <div className="preview-panel">
        <div className="panel-title">Markdown Preview</div>
        <MarkdownView text={`# Preview\n\n- **Name:** ${name}\n- **Email:** ${email}\n- **Goal:** ${goal}`} />
      </div>
    </div>
  )
}

function NotebookPane({ onSave }: { onSave: (note: string) => void }) {
  const [note, setNote] = useState(`# Meeting Notes\n\n- Agents as cards\n- Middle pane supports Markdown\n- Right pane shows message history & versions`)
  return (
    <div className="notebook-pane">
      <div className="editor">
        <textarea value={note} onChange={e => setNote(e.target.value)} />
      </div>
      <div className="preview-panel">
        <div className="panel-title">Preview</div>
        <MarkdownView text={note} />
      </div>
      <div className="actions right">
        <button onClick={() => onSave(note)}>Save Note</button>
      </div>
    </div>
  )
}

export default App
