import { useState, useCallback, useEffect } from 'react'
import { AGENTS, PIPELINE_NAMES } from './data/agents'
import { useAuth } from './lib/useAuth'
import { useOutputs } from './lib/useOutputs'
import { useChat } from './lib/useChat'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import ContextBar from './components/ContextBar'
import ChatArea from './components/ChatArea'
import InputBar from './components/InputBar'
import OutputsPanel from './components/OutputsPanel'
import AuthModal from './components/AuthModal'
import ApiKeyModal from './components/ApiKeyModal'

export default function App() {
  const { user, loading, signIn, signUp, signOut } = useAuth()
  const { outputs, saveOutput, clearOutputs, getOutput, syncStatus } = useOutputs(user)

  const [currentAgent, setCurrentAgent] = useState(AGENTS.find(a => a.id === 'ux-researcher'))
  const [loadedContext, setLoadedContext] = useState([])
  const [apiKey, setApiKey] = useState(localStorage.getItem('agentco_api_key') || '')
  const [showAuth, setShowAuth] = useState(false)
  const [showApiKey, setShowApiKey] = useState(!localStorage.getItem('agentco_api_key'))

  const { messages, send, reset, isRunning, latestOutput } = useChat(currentAgent, loadedContext, apiKey)

  // When agent changes, restore saved output into chat
  const selectAgent = useCallback((agent) => {
    setCurrentAgent(agent)
    setLoadedContext([])
    const saved = getOutput(agent.id)
    // reset() will be called via useEffect below when currentAgent changes
  }, [getOutput])

  // Reset chat when agent changes
  useEffect(() => {
    const saved = getOutput(currentAgent.id)
    reset(saved)
  }, [currentAgent.id]) // eslint-disable-line

  const loadContext = useCallback((agentId) => {
    const saved = getOutput(agentId)
    if (!saved || loadedContext.find(c => c.agentId === agentId)) return
    setLoadedContext(prev => [...prev, saved])
  }, [getOutput, loadedContext])

  const handleSave = useCallback((content) => {
    const record = {
      agentId: currentAgent.id,
      agentName: currentAgent.name,
      content,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    saveOutput(record)
  }, [currentAgent, saveOutput])

  const handlePass = useCallback(() => {
    if (!latestOutput) return
    handleSave(latestOutput.content)
    const idx = AGENTS.findIndex(a => a.id === currentAgent.id)
    if (idx < AGENTS.length - 1) {
      const next = AGENTS[idx + 1]
      selectAgent(next)
      // Auto-load current agent's output as context for next
      setTimeout(() => {
        const saved = getOutput(currentAgent.id)
        if (saved) setLoadedContext([saved])
      }, 50)
    }
  }, [latestOutput, currentAgent, handleSave, selectAgent, getOutput])

  const handleSend = useCallback(async (text) => {
    const result = await send(text)
    if (result === 'NO_KEY') setShowApiKey(true)
  }, [send])

  const hasConversation = messages.some(m => m.role === 'output')
  const canPass = !!latestOutput

  if (loading) {
    return (
      <div className="h-screen bg-bg flex items-center justify-center">
        <div className="text-white/30 text-sm">Loading…</div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-bg text-white flex flex-col overflow-hidden">
      <TopBar
        user={user}
        syncStatus={syncStatus}
        apiKey={apiKey}
        onSignOut={signOut}
        onOpenAuth={() => setShowAuth(true)}
        onSaveKey={setApiKey}
      />

      {/* Progress bar */}
      <div className="h-0.5 bg-bg3 flex-shrink-0">
        <div
          className="h-full bg-accent transition-all duration-300"
          style={{ width: isRunning ? '70%' : '0%' }}
        />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          currentAgentId={currentAgent.id}
          onSelect={selectAgent}
          getOutput={getOutput}
        />

        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Agent header */}
          <div className="px-4 py-3 border-b border-white/7 bg-bg2 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-bg3 border border-white/12 flex items-center justify-center text-base">
                {currentAgent.emoji}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{currentAgent.name}</div>
                <div className="text-xs text-white/40">{currentAgent.dept}</div>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full border border-white/12 text-white/40">
              {PIPELINE_NAMES[currentAgent.pipeline]}
            </span>
          </div>

          <ContextBar
            agent={currentAgent}
            loadedContext={loadedContext}
            onLoadContext={loadContext}
            getOutput={getOutput}
          />

          <ChatArea
            messages={messages}
            agent={currentAgent}
            onSave={handleSave}
            getOutput={getOutput}
          />

          <InputBar
            onSend={handleSend}
            onPass={handlePass}
            canPass={canPass}
            isRunning={isRunning}
            hasConversation={hasConversation}
            agentName={currentAgent.name}
          />
        </div>

        <OutputsPanel
          outputs={outputs}
          onSelect={selectAgent}
          onClear={clearOutputs}
        />
      </div>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          signIn={signIn}
          signUp={signUp}
        />
      )}

      {showApiKey && (
        <ApiKeyModal
          onSave={(key) => { setApiKey(key); setShowApiKey(false) }}
        />
      )}
    </div>
  )
}
