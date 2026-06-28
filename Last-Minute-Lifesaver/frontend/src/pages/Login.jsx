import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { Zap, Mail, Lock, AlertCircle } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    const result = await login(email, password)
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error || 'Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-violet shadow-lg shadow-brand-500/30 mb-3">
            <Zap className="w-7 h-7 text-white" />
            <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse opacity-50" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Welcome to LifeSaver</h1>
          <p className="text-sm text-zinc-400 mt-1">AI-powered productivity rescue assistant</p>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-2xl p-6 border border-white/5 space-y-6">
          <h2 className="text-lg font-semibold text-zinc-200">Sign in to your account</h2>

          {error && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-medium">Email address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass text-sm text-zinc-200 bg-transparent outline-none border border-white/5 focus:border-brand-500/30 focus:ring-2 focus:ring-brand-500/10 transition-all"
                  placeholder="name@domain.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-medium">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass text-sm text-zinc-200 bg-transparent outline-none border border-white/5 focus:border-brand-500/30 focus:ring-2 focus:ring-brand-500/10 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-zinc-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-brand-400 hover:text-brand-300 transition-colors font-medium">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
