import { useState, useRef } from 'react'

export default function InputBar({ onSend, onPass, canPass, isRunning, hasConversation, agentName }) {
  const [text, setText] = useState('')
  const ref = useRef(null)

  const handleSend = () => {
    if (!text.trim() || isRunning) return
    onSend(text)
    setText('')
    if (ref.current) { ref.current.style.height = 'auto' }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const handleInput = (e) => {
    setText(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
  }

  const placeholder = hasConversation
    ? 'Ask a follow-up, request changes, or refine the output…'
    : `Brief the ${agentName}…`

  return (
    <div className="px-4 py-3 border-t border-white/7 bg-bg2 flex gap-2 items-end">
      <textarea
        ref={ref}
        value={text}
        onChange={handleInput}
        onKeyDown={handleKey}
        placeholder={placeholder}
        disabled={isRunning}
        rows={1}
        className="flex-1 resize-none min-h-9 max-h-28 text-sm px-3 py-2 rounded-xl border border-white/12 bg-bg3 text-white placeholder-white/25 focus:outline-none focus:border-accent transition-colors disabled:opacity-50 leading-relaxed"
      />
      <button
        onClick={onPass}
        disabled={!canPass}
        title="Save and pass to next agent"
        className="h-9 px-3 rounded-xl border border-white/12 bg-transparent text-white/50 text-sm font-medium flex items-center gap-1.5 hover:bg-bg3 hover:text-white transition-all disabled:opacity-25 disabled:cursor-not-allowed flex-shrink-0"
      >
        → Pass
      </button>
      <button
        onClick={handleSend}
        disabled={isRunning || !text.trim()}
        className="h-9 px-4 rounded-xl border-none bg-accent text-white text-sm font-medium flex items-center gap-1.5 hover:bg-accent2 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
      >
        {isRunning ? '…' : hasConversation ? '▶ Send' : '▶ Brief'}
      </button>
    </div>
  )
}
