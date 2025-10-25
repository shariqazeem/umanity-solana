'use client'

import { useState, useEffect } from 'react'

interface Activity {
  id: string
  type: 'donation' | 'pool_donation' | 'tip'
  user: string
  username?: string
  amount: number
  poolName?: string
  recipient?: string
  recipientUsername?: string
  message?: string
  timestamp: string
  signature: string
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivities()
    // Refresh every 30 seconds
    const interval = setInterval(fetchActivities, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/activity')
      const data = await response.json()
      if (data.success) {
        setActivities(data.activities)
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    if (type === 'donation') return '💝'
    if (type === 'pool_donation') return '🌍'
    if (type === 'tip') return '⚡'
    return '🎁'
  }

  const getActivityText = (activity: Activity) => {
    const username = activity.username || 'Anonymous'

    if (activity.type === 'donation') {
      return (
        <>
          <span className="font-bold">{username}</span> donated{' '}
          <span className="font-bold text-green-600">{activity.amount.toFixed(3)} SOL</span>{' '}
          via One-Tap
        </>
      )
    }

    if (activity.type === 'pool_donation') {
      return (
        <>
          <span className="font-bold">{username}</span> donated{' '}
          <span className="font-bold text-green-600">{activity.amount.toFixed(3)} SOL</span>{' '}
          to <span className="font-bold">{activity.poolName}</span>
        </>
      )
    }

    if (activity.type === 'tip') {
      return (
        <>
          <span className="font-bold">{username}</span> tipped{' '}
          <span className="font-bold text-purple-600">{activity.amount.toFixed(3)} SOL</span>{' '}
          to <span className="font-bold">@{activity.recipientUsername}</span>
        </>
      )
    }
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const then = new Date(timestamp)
    const diffMs = now.getTime() - then.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`

    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  if (loading) {
    return (
      <div className="glass-card rounded-3xl p-8">
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-gray-600">Loading activity...</p>
        </div>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-8">
        <h3 className="text-2xl font-bold mb-6">📊 Recent Activity</h3>
        <div className="text-center py-12 text-gray-500">
          <div className="text-5xl mb-3">🎯</div>
          <p className="font-bold mb-2">No activity yet</p>
          <p className="text-sm">Be the first to donate or tip!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-3xl p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold">📊 Recent Activity</h3>
          <p className="text-sm text-gray-600">Live updates from the community</p>
        </div>
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-3 p-4 bg-black/5 hover:bg-black/10 rounded-xl transition-all"
          >
            <div className="text-2xl">{getActivityIcon(activity.type)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800">
                {getActivityText(activity)}
              </p>
              {activity.message && (
                <p className="text-xs text-gray-600 mt-1 italic">
                  &ldquo;{activity.message}&rdquo;
                </p>
              )}
              <div className="flex items-center space-x-3 mt-2">
                <span className="text-xs text-gray-500">{getTimeAgo(activity.timestamp)}</span>
                <a
                  href={`https://solscan.io/tx/${activity.signature}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  View TX →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activities.length > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={fetchActivities}
            className="text-sm text-gray-600 hover:text-black transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      )}
    </div>
  )
}
