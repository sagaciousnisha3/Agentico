import { useState } from 'react'

const SYNC_LABELS = {
  local: { text: '○ local', cls: 'text-white/25' },
  syncing: { text: '↻ syncing…', cls: 'text-accent2' },
  synced: { text: '● synced', cls: 'text-success' },
  error: { text: '⚠ sync error', cls: 'text-danger' },
}

export default function TopBar({ syncStatus, apiKey, onSaveKey }) {
  const [keyVal, setKeyVal] = useState(apiKey || localStorage.getItem('agentco_api_key') || '')
  const [keySaved, setKeySaved] = useState(!!apiKey)

  const saveKey = () => {
    localStorage.setItem('agentco_api_key', keyVal)
    onSaveKey(keyVal)
    setKeySaved(true)
    setTimeout(() => setKeySaved(false), 2000)
  }

  const sync = SYNC_LABELS[syncStatus] || SYNC_LABELS.local

  return (
    <div className="h-12 flex items-center justify-between px-5 border-b border-white/7 bg-bg2 flex-shrink-0 gap-4">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="text-sm font-bold text-white tracking-tight">
          Agent<span className="text-accent2">Co</span> HQ
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full border border-white/10 text-white/40">
          40 Agents · 4 Pipelines
        </span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* API Key */}
        <input
          type="password"
          value={keyVal}
          onChange={e => { setKeyVal(e.target.value); setKeySaved(false) }}
          onKeyDown={e => e.key === 'Enter' && saveKey()}
          placeholder="sk-ant-… Anthropic API key"
          className="w-64 h-7 text-xs px-2.5 bg-bg3 border border-white/10 rounded-lg text-white placeholder-white/25 focus:outline-none focus:border-accent font-mono"
        />
        <button
          onClick={saveKey}
          className="h-7 px-3 text-xs rounded-lg bg-accent text-white font-medium hover:bg-accent2 transition-colors"
        >
          {keySaved ? '✓ Saved' : 'Save'}
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-white/10" />

        {/* Sync status */}
        <span className={`text-xs ${sync.cls}`}>{sync.text}</span>
      </div>
    </div>
  )
}
