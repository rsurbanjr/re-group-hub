'use client'

import { useState, useEffect } from 'react'
import REGroupHub from './components/REGroupHub'
import Auth from './components/Auth'
import { supabase, isSupabaseConfigured } from './lib/supabase'

export default function Home() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false)
      return
    }

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  // If Supabase not configured, show app without auth
  if (!isSupabaseConfigured()) {
    return <REGroupHub />
  }

  // Show auth screen if not logged in
  if (!user) {
    return <Auth />
  }

  // Show app if logged in
  return <REGroupHub user={user} />
}
