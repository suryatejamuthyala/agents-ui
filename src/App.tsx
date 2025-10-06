import { useEffect, useState } from 'react'
import './App.css'
import {
  AgentHeader,
  AgentList,
  ChatPane,
  FormPane,
  MessageHistory,
  NotebookPane,
  useAgents,
  useSelectedAgent,
} from '@ag-ui/client'
import { Button, ThreePaneLayout } from '@ag-ui/core'

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

  const { agents } = useAgents()
  const { selectedAgent, setSelectedAgentId } = useSelectedAgent()

  if (!selectedAgent) {
    return <div>Loading...</div>
  }

  const renderContent = () => {
    switch (selectedAgent.type) {
      case 'chat':
        return <ChatPane key={selectedAgent.id} />
      case 'form':
        return <FormPane key={selectedAgent.id} />
      case 'notebook':
        return <NotebookPane key={selectedAgent.id} />
      default:
        return <div>Unsupported agent type: {selectedAgent.type}</div>
    }
  }

  return (
    <ThreePaneLayout>
      <ThreePaneLayout.Sidebar>
        <AgentList
          agents={agents}
          selectedAgentId={selectedAgent.id}
          onSelectAgent={setSelectedAgentId}
        />
      </ThreePaneLayout.Sidebar>

      <ThreePaneLayout.Main>
        <AgentHeader agent={selectedAgent}>
          <div className="top-actions">
            <Button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              aria-label="Toggle color theme"
            >
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </Button>
          </div>
        </AgentHeader>
        {renderContent()}
      </ThreePaneLayout.Main>

      <ThreePaneLayout.Aside>
        <MessageHistory key={selectedAgent.id} />
      </ThreePaneLayout.Aside>
    </ThreePaneLayout>
  )
}

export default App

