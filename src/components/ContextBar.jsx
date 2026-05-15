import { AGENTS } from '../data/agents'

export default function ContextBar({ agent, loadedContext, onLoadContext, getOutput }) {
  if (agent.inputs.length === 0) {
    return (
      <div className="px-4 py-2 border-b border-white/7 bg-bg2 flex items-center min-h-9">
        <span className="text-xs text-white/25">No dependencies — ready to brief</span>
      </div>
    )
  }

  return (
    <div className="px-4 py-2 border-b border-white/7 bg-bg2 flex items-center gap-2 overflow-x-auto min-h-9">
      <span className="text-xs text-white/30 flex-shrink-0">Context:</span>
      {agent.inputs.map(inputId => {
        const inputAgent = AGENTS.find(a => a.id === inputId)
        if (!inputAgent) return null
        const hasSaved = !!getOutput(inputId)
        const isLoaded = !!loadedContext.find(c => c.agentId === inputId)

        let cls = 'flex-shrink-0 text-xs px-2.5 py-1 rounded-full border flex items-center gap-1.5 transition-all'
        if (isLoaded) {
          cls += ' border-success/40 text-success bg-success/10'
        } else if (hasSaved) {
          cls += ' border-white/15 text-white/60 bg-bg3 hover:border-accent hover:text-accent2 cursor-pointer'
        } else {
          cls += ' border-white/7 text-white/25 opacity-50'
        }

        return (
          <button
            key={inputId}
            className={cls}
            onClick={() => hasSaved && !isLoaded && onLoadContext(inputId)}
            title={isLoaded ? 'Loaded' : hasSaved ? 'Click to load as context' : `${inputAgent.name} hasn't run yet`}
            disabled={!hasSaved || isLoaded}
          >
            <span>{isLoaded ? '✓' : hasSaved ? '+' : '○'}</span>
            <span>{inputAgent.name}</span>
          </button>
        )
      })}
    </div>
  )
}
