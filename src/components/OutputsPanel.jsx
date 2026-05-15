import { AGENTS } from '../data/agents'

export default function OutputsPanel({ outputs, onSelect, onClear }) {
  return (
    <div className="w-48 min-w-48 border-l border-white/7 bg-bg2 flex flex-col overflow-hidden">
      <div className="px-3 py-3 border-b border-white/7">
        <div className="text-xs font-semibold text-white">Saved outputs</div>
        <div className="text-[11px] text-white/30 mt-0.5">Click to revisit</div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
        {outputs.length === 0 ? (
          <div className="text-[11px] text-white/25 text-center p-4 leading-relaxed">
            Outputs you save appear here. Load them as context for the next agent.
          </div>
        ) : (
          <>
            <button
              onClick={() => { if (confirm('Clear all saved outputs?')) onClear() }}
              className="w-full text-[11px] text-white/25 hover:text-danger py-1.5 transition-colors mb-1"
            >
              Clear all
            </button>
            {[...outputs].reverse().map(out => {
              const agent = AGENTS.find(a => a.id === out.agentId)
              return (
                <button
                  key={out.agentId}
                  onClick={() => agent && onSelect(agent)}
                  className="w-full text-left p-2 rounded-lg border border-white/7 bg-bg3 mb-1.5 hover:border-white/15 transition-all"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: agent?.color || '#888' }} />
                    <span className="text-[11px] font-medium text-white truncate">{out.agentName}</span>
                  </div>
                  <div className="text-[11px] text-white/40 leading-relaxed line-clamp-2">{out.content.slice(0, 80)}…</div>
                  <div className="text-[10px] text-white/20 mt-1">{out.time}</div>
                </button>
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}
