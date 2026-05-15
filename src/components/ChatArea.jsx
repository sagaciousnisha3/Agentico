import { useEffect, useRef, useState } from 'react'

function UserMsg({ content }) {
  return (
    <div className="flex gap-2.5">
      <div className="w-7 h-7 rounded-lg bg-bg3 border border-white/10 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">👤</div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-white/50 mb-1 font-medium">You (CEO)</div>
        <div className="text-sm text-white bg-accent/10 border border-accent/25 rounded-xl px-3 py-2.5 leading-relaxed">{content}</div>
      </div>
    </div>
  )
}

function AgentMsg({ msg, agentEmoji, onSave, isSaved }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(msg.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex gap-2.5">
      <div className="w-7 h-7 rounded-lg bg-bg3 border border-white/10 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">{agentEmoji}</div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-white/50 mb-1 font-medium">{msg.name}</div>
        <div className="text-[12.5px] text-white bg-bg2 border border-white/7 rounded-xl px-3 py-2.5 leading-relaxed whitespace-pre-wrap">{msg.content}</div>
        <div className="flex gap-2 mt-2">
          <button
            onClick={onSave}
            className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-all ${
              isSaved
                ? 'text-success border-success/35 bg-success/8'
                : 'text-white/50 border-white/12 hover:text-white hover:bg-bg3'
            }`}
          >
            {isSaved ? '✓ Saved' : '↓ Save output'}
          </button>
          <button
            onClick={copy}
            className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
              copied
                ? 'text-accent2 border-accent/35'
                : 'text-white/50 border-white/12 hover:text-white hover:bg-bg3'
            }`}
          >
            {copied ? '✓ Copied' : '⎘ Copy'}
          </button>
        </div>
      </div>
    </div>
  )
}

function TypingMsg({ emoji }) {
  return (
    <div className="flex gap-2.5">
      <div className="w-7 h-7 rounded-lg bg-bg3 border border-white/10 flex items-center justify-center text-sm flex-shrink-0">{emoji}</div>
      <div className="flex-1">
        <div className="text-xs text-white/50 mb-1 font-medium">Thinking…</div>
        <div className="flex gap-1 py-3 px-3">
          <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

export default function ChatArea({ messages, agent, onSave, getOutput }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 p-8">
        <div className="text-4xl">{agent.emoji}</div>
        <div className="text-sm font-semibold text-white/80">{agent.name}</div>
        <div className="text-xs text-white/35 leading-relaxed max-w-xs">
          {agent.dept}
          {agent.inputs.length > 0
            ? ` · Load context from previous agents above, then brief me.`
            : ` · No dependencies — type your brief below to get started.`}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4 scrollbar-thin">
      {messages.map((msg, i) => {
        if (msg.role === 'user') return <UserMsg key={i} content={msg.content} />
        if (msg.role === 'typing') return <TypingMsg key={i} emoji={agent.emoji} />
        if (msg.role === 'error') return (
          <div key={i} className="text-center text-xs text-danger/80 py-1">⚠ {msg.text}</div>
        )
        if (msg.role === 'output') {
          const saved = getOutput(agent.id)
          const isSaved = saved?.content === msg.content
          return (
            <AgentMsg
              key={i}
              msg={msg}
              agentEmoji={agent.emoji}
              onSave={() => onSave(msg.content)}
              isSaved={isSaved}
            />
          )
        }
        if (msg.role === 'system') return (
          <div key={i} className="text-center text-xs text-white/25 py-0.5">{msg.text}</div>
        )
        return null
      })}
      <div ref={bottomRef} />
    </div>
  )
}
