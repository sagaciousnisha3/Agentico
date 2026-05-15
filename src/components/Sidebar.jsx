import { AGENTS, DEPT_ORDER } from '../data/agents'
import { useState } from 'react'

const PIPELINE_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'build', label: 'Build' },
  { id: 'market', label: 'Mkt' },
  { id: 'sell', label: 'Sell' },
  { id: 'retain', label: 'Keep' },
]

export default function Sidebar({ currentAgentId, onSelect, getOutput }) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = AGENTS.filter(a => {
    const matchPipeline = filter === 'all' || a.pipeline === filter || a.pipeline === 'all'
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.dept.toLowerCase().includes(search.toLowerCase())
    return matchPipeline && matchSearch
  })

  const depts = DEPT_ORDER.filter(d => filtered.some(a => a.dept === d))

  return (
    <div className="w-56 min-w-56 bg-bg2 border-r border-white/7 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-3 py-3 border-b border-white/7">
        <div className="text-sm font-bold text-white tracking-tight">Agent<span className="text-accent2">Co</span> HQ</div>
        <div className="text-xs text-white/40 mt-0.5">40 agents · 4 pipelines</div>
      </div>

      {/* Pipeline tabs */}
      <div className="flex gap-1 p-2 pb-1">
        {PIPELINE_FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex-1 text-[10px] py-1 rounded-md border font-medium transition-all ${
              filter === f.id
                ? 'bg-accent border-accent text-white'
                : 'bg-transparent border-white/10 text-white/50 hover:text-white/80 hover:bg-bg3'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="px-2 pb-2">
        <input
          type="text"
          placeholder="Search agents…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full h-7 text-xs px-2.5 bg-bg3 border border-white/10 rounded-lg text-white placeholder-white/25 focus:outline-none focus:border-accent"
        />
      </div>

      {/* Agent list */}
      <div className="flex-1 overflow-y-auto px-1.5 pb-3 scrollbar-thin">
        {depts.map(dept => (
          <div key={dept}>
            <div className="text-[10px] text-white/25 font-semibold uppercase tracking-widest px-2 pt-2.5 pb-1">
              {dept}
            </div>
            {filtered.filter(a => a.dept === dept).map(agent => {
              const saved = getOutput(agent.id)
              const isActive = agent.id === currentAgentId
              return (
                <button
                  key={agent.id}
                  onClick={() => onSelect(agent)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg mb-0.5 text-left transition-all border ${
                    isActive
                      ? 'bg-bg3 border-white/12'
                      : 'bg-transparent border-transparent hover:bg-bg3/60'
                  }`}
                >
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: agent.color }} />
                  <span className="text-xs text-white flex-1 truncate">{agent.name}</span>
                  {saved && (
                    <span className="text-[10px] text-success border border-success/30 bg-success/10 px-1.5 py-0.5 rounded-full">✓</span>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
