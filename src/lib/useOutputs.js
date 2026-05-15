import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseEnabled } from '../lib/supabase'

const LOCAL_KEY = 'agentco_v2'

function loadLocal() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]') } catch { return [] }
}

function saveLocal(outputs) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(outputs))
}

export function useOutputs(user) {
  const [outputs, setOutputs] = useState(loadLocal)
  const [syncStatus, setSyncStatus] = useState('local') // local | syncing | synced | error

  // Sync from Supabase when user signs in
  useEffect(() => {
    if (!user || !isSupabaseEnabled) return
    setSyncStatus('syncing')
    supabase
      .from('agent_outputs')
      .select('*')
      .eq('user_id', user.id)
      .then(({ data, error }) => {
        if (error) { setSyncStatus('error'); return }
        if (!data?.length) { setSyncStatus('synced'); return }
        const remoteMap = {}
        data.forEach(row => {
          remoteMap[row.agent_id] = {
            agentId: row.agent_id,
            agentName: row.agent_name,
            content: row.content,
            time: new Date(row.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
        })
        setOutputs(prev => {
          const merged = prev.filter(o => !remoteMap[o.agentId])
          Object.values(remoteMap).forEach(r => merged.push(r))
          saveLocal(merged)
          return merged
        })
        setSyncStatus('synced')
      })
  }, [user])

  const saveOutput = useCallback(async (record) => {
    setOutputs(prev => {
      const next = prev.filter(o => o.agentId !== record.agentId)
      next.push(record)
      saveLocal(next)
      return next
    })
    if (user && isSupabaseEnabled) {
      setSyncStatus('syncing')
      const { error } = await supabase.from('agent_outputs').upsert({
        user_id: user.id,
        agent_id: record.agentId,
        agent_name: record.agentName,
        content: record.content,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,agent_id' })
      setSyncStatus(error ? 'error' : 'synced')
    }
  }, [user])

  const clearOutputs = useCallback(async () => {
    setOutputs([])
    localStorage.removeItem(LOCAL_KEY)
    if (user && isSupabaseEnabled) {
      await supabase.from('agent_outputs').delete().eq('user_id', user.id)
    }
  }, [user])

  const getOutput = useCallback((agentId) => {
    return outputs.find(o => o.agentId === agentId) || null
  }, [outputs])

  return { outputs, saveOutput, clearOutputs, getOutput, syncStatus }
}
