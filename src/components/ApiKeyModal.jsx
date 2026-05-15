import { useState } from 'react'

export default function ApiKeyModal({ onSave }) {
  const [key, setKey] = useState('')
  const [error, setError] = useState('')

  const save = () => {
    if (!key.startsWith('sk-ant-')) { setError('Key should start with sk-ant-'); return }
    localStorage.setItem('agentco_api_key', key)
    onSave(key)
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-bg2 border border-white/12 rounded-2xl p-6 max-w-md w-11/12">
        <h2 className="text-base font-semibold mb-2">🔑 Anthropic API Key Required</h2>
        <p className="text-sm text-white/50 leading-relaxed mb-4">
          AgentCo HQ calls Claude directly from your browser. Your key is stored locally and only sent to Anthropic's API.
        </p>
        <div className="bg-bg3 border border-white/7 rounded-lg px-3 py-2 text-xs font-mono text-accent2 mb-4">
          https://console.anthropic.com/settings/keys
        </div>
        <input
          type="password"
          value={key}
          onChange={e => setKey(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && save()}
          placeholder="sk-ant-api03-…"
          autoFocus
          className="w-full h-10 text-sm px-3 bg-bg3 border border-white/12 rounded-lg text-white placeholder-white/25 focus:outline-none focus:border-accent mb-3 font-mono"
        />
        {error && <p className="text-xs text-danger mb-3">{error}</p>}
        <p className="text-xs text-white/30 mb-4">Estimated cost: ~$2.40 for one full product cycle across all 40 agents.</p>
        <button
          onClick={save}
          className="w-full py-2.5 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent2 transition-colors"
        >
          Save Key & Continue
        </button>
      </div>
    </div>
  )
}
