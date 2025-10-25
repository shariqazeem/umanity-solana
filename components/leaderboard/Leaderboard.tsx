'use client'

import { useState, useEffect } from 'react'

interface LeaderboardUser {
  address: string
  username: string
  displayName: string
  totalContributed: number
  totalDonated: number
  totalTipped: number
  rewardPoints: number
  donationCount: number
  tipCountSent: number
}

interface LeaderboardData {
  topDonors: LeaderboardUser[]
  topEarners: LeaderboardUser[]
  mostActive: LeaderboardUser[]
}

export function Leaderboard() {
  const [leaderboards, setLeaderboards] = useState<LeaderboardData>({
    topDonors: [],
    topEarners: [],
    mostActive: []
  })
  const [activeTab, setActiveTab] = useState<'donors' | 'earners' | 'active'>('donors')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard')
      const data = await response.json()
      if (data.success) {
        setLeaderboards(data.leaderboards)
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMedalEmoji = (index: number) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `${index + 1}`
  }

  const renderLeaderboardList = (users: LeaderboardUser[], type: 'donors' | 'earners' | 'active') => {
    if (users.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-3">🏆</div>
          <p>No data yet. Be the first!</p>
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {users.map((user, index) => (
          <div
            key={user.address}
            className={`glass-card rounded-xl p-4 flex items-center justify-between transition-all hover:shadow-lg ${
              index < 3 ? 'border-2 border-yellow-400' : ''
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 flex items-center justify-center font-bold text-xl">
                {getMedalEmoji(index)}
              </div>
              <div>
                <div className="font-bold text-lg">{user.displayName || user.username}</div>
                <div className="text-sm text-gray-500">@{user.username}</div>
              </div>
            </div>

            <div className="text-right">
              {type === 'donors' && (
                <>
                  <div className="font-bold text-lg text-green-600">
                    {user.totalContributed.toFixed(3)} SOL
                  </div>
                  <div className="text-xs text-gray-500">
                    {user.donationCount} donations + {user.tipCountSent} tips
                  </div>
                </>
              )}
              {type === 'earners' && (
                <>
                  <div className="font-bold text-lg text-yellow-600">
                    {user.rewardPoints} points
                  </div>
                  <div className="text-xs text-gray-500">
                    {(user.rewardPoints / 100).toFixed(1)} tokens at launch
                  </div>
                </>
              )}
              {type === 'active' && (
                <>
                  <div className="font-bold text-lg text-blue-600">
                    {user.donationCount + user.tipCountSent} actions
                  </div>
                  <div className="text-xs text-gray-500">
                    {user.totalContributed.toFixed(3)} SOL total
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="glass-card rounded-3xl p-12">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-3xl p-8">
      <div className="mb-8">
        <h2 className="text-4xl font-black mb-3 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
          🏆 Leaderboard
        </h2>
        <p className="text-gray-600">
          Top contributors making the biggest impact
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('donors')}
          className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'donors'
              ? 'bg-black text-white'
              : 'bg-black/5 text-gray-700 hover:bg-black/10'
          }`}
        >
          💝 Top Donors
        </button>
        <button
          onClick={() => setActiveTab('earners')}
          className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'earners'
              ? 'bg-black text-white'
              : 'bg-black/5 text-gray-700 hover:bg-black/10'
          }`}
        >
          ⭐ Top Earners
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'active'
              ? 'bg-black text-white'
              : 'bg-black/5 text-gray-700 hover:bg-black/10'
          }`}
        >
          🔥 Most Active
        </button>
      </div>

      {/* Leaderboard Content */}
      {activeTab === 'donors' && renderLeaderboardList(leaderboards.topDonors, 'donors')}
      {activeTab === 'earners' && renderLeaderboardList(leaderboards.topEarners, 'earners')}
      {activeTab === 'active' && renderLeaderboardList(leaderboards.mostActive, 'active')}

      {/* Info Banner */}
      <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">🎯</div>
          <div className="text-sm text-gray-700">
            <div className="font-bold mb-1">Climb the leaderboard!</div>
            <p>
              Every donation and tip earns you reward points. Top earners get exclusive perks at token launch!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
