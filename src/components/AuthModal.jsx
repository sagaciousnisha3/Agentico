import { useState } from 'react'

export default function AuthModal({ onClose, signIn, signUp }) {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!email || !password) { setError('Enter your email and password.'); return }
    setLoading(true); setError(''); setSuccess('')
    try {
      if (mode === 'signup') {
        const data = await signUp(email, password)
        if (data.user && !data.session) {
          setSuccess('Check your email to confirm your account, then sign in.')
          setMode('signin')
        }
      } else {
        await signIn(email, password)
        onClose()
      }
    } catch (e) {
      setError(e.message || 'Authentication failed.')
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-bg2 border border-white/12 rounded-2xl p-6 max-w-sm w-11/12">
        <h2 className="text-base font-semibold mb-1">☁ Sync to Supabase</h2>
        <p className="text-xs text-white/40 mb-5 leading-relaxed">
          Your outputs will be saved to your database and accessible from any device.
        </p>

        {/* Tabs */}
        <div className="flex gap-1.5 mb-4">
          {['signin', 'signup'].map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); setSuccess('') }}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                mode === m
                  ? 'bg-accent border-accent text-white'
                  : 'bg-transparent border-white/10 text-white/50 hover:text-white/80'
              }`}
            >
              {m === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        <div className="mb-3">
          <label className="text-xs text-white/50 block mb-1.5 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            autoFocus
            className="w-full h-9 text-sm px-3 bg-bg3 border border-white/12 rounded-lg text-white placeholder-white/25 focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <div className="mb-4">
          <label className="text-xs text-white/50 block mb-1.5 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            onKeyDown={e => e.key === 'Enter' && submit()}
            className="w-full h-9 text-sm px-3 bg-bg3 border border-white/12 rounded-lg text-white placeholder-white/25 focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        {error && <p className="text-xs text-danger mb-3">{error}</p>}
        {success && <p className="text-xs text-success mb-3">{success}</p>}

        <button
          onClick={submit}
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent2 transition-colors disabled:opacity-50"
        >
          {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
        </button>
        <button
          onClick={onClose}
          className="w-full text-xs text-white/25 hover:text-white/50 mt-3 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
