import { useState, useCallback } from 'react'

export function useChat(agent, loadedContext, apiKey) {
  const [messages, setMessages] = useState([])
  const [isRunning, setIsRunning] = useState(false)

  const reset = useCallback((savedOutput = null) => {
    if (savedOutput) {
      setMessages([{ role: 'output', name: agent.name, content: savedOutput.content }])
    } else {
      setMessages([])
    }
  }, [agent])

  const buildApiMessages = useCallback((newUserText, currentMessages) => {
    const apiMsgs = []
    const isFirstTurn = currentMessages.filter(m => m.role === 'user').length === 0
    let contextBlock = ''
    if (isFirstTurn && loadedContext.length > 0) {
      contextBlock = '\n\n--- CONTEXT FROM PREVIOUS AGENTS ---\n' +
        loadedContext.map(c => `[${c.agentName} OUTPUT]\n${c.content}`).join('\n\n---\n')
    }
    for (const msg of currentMessages) {
      if (msg.role === 'user') {
        const isFirst = apiMsgs.length === 0
        apiMsgs.push({ role: 'user', content: msg.content + (isFirst ? contextBlock : '') })
      } else if (msg.role === 'output') {
        apiMsgs.push({ role: 'assistant', content: msg.content })
      }
    }
    const isFirst = apiMsgs.length === 0
    apiMsgs.push({ role: 'user', content: newUserText + (isFirst ? contextBlock : '') })
    return apiMsgs
  }, [loadedContext])

  const send = useCallback(async (userText) => {
    if (!userText.trim() || isRunning) return null

    const key = apiKey || localStorage.getItem('agentco_api_key') || ''
    if (!key) return 'NO_KEY'

    setIsRunning(true)
    const apiMessages = buildApiMessages(userText, messages)
    setMessages(prev => [...prev, { role: 'user', content: userText }, { role: 'typing' }])

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: agent.maxTokens || 8192,
          system: agent.prompt,
          messages: apiMessages,
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error.message)
      const text = (data.content || []).map(c => c.text || '').join('')
      setMessages(prev => [
        ...prev.filter(m => m.role !== 'typing'),
        { role: 'output', name: agent.name, content: text },
      ])
      setIsRunning(false)
      return text
    } catch (err) {
      let msg = err.message || 'Unknown error'
      if (msg.includes('401')) msg = 'Invalid API key. Check your key in the top bar.'
      if (msg.includes('429')) msg = 'Rate limited. Wait a moment and try again.'
      setMessages(prev => [
        ...prev.filter(m => m.role !== 'typing'),
        { role: 'error', text: msg },
      ])
      setIsRunning(false)
      return null
    }
  }, [agent, messages, isRunning, buildApiMessages, apiKey])

  const latestOutput = messages.filter(m => m.role === 'output').at(-1) || null

  return { messages, send, reset, isRunning, latestOutput }
}
