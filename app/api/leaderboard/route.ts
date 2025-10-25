import { NextResponse } from 'next/server'
import { getAllUsers, getAllDonations, getAllPoolDonations, getAllTips } from '@/lib/storage'

export async function GET() {
  try {
    const users = await getAllUsers()
    const oneTapDonations = await getAllDonations()
    const poolDonations = await getAllPoolDonations()
    const tips = await getAllTips()

    // Calculate total contribution per user (donations + tips sent)
    const userStats = users.map(user => {
      const totalDonated =
        oneTapDonations.filter(d => d.donor === user.address).reduce((sum, d) => sum + d.amount, 0) +
        poolDonations.filter(d => d.donor === user.address).reduce((sum, d) => sum + d.amount, 0)

      const totalTipped = tips.filter(t => t.sender === user.address).reduce((sum, t) => sum + t.amount, 0)

      return {
        address: user.address,
        username: user.username,
        displayName: user.displayName,
        totalContributed: totalDonated + totalTipped,
        totalDonated,
        totalTipped,
        rewardPoints: user.rewardPoints,
        donationCount: user.donationCount,
        tipCountSent: user.tipCountSent
      }
    })

    // Sort by total contributed
    const topDonors = userStats
      .filter(u => u.totalContributed > 0)
      .sort((a, b) => b.totalContributed - a.totalContributed)
      .slice(0, 10)

    // Sort by reward points
    const topEarners = [...userStats]
      .sort((a, b) => b.rewardPoints - a.rewardPoints)
      .slice(0, 10)

    // Most active (most transactions)
    const mostActive = [...userStats]
      .sort((a, b) => (b.donationCount + b.tipCountSent) - (a.donationCount + a.tipCountSent))
      .slice(0, 10)

    return NextResponse.json({
      success: true,
      leaderboards: {
        topDonors,
        topEarners,
        mostActive
      },
      stats: {
        totalUsers: users.length,
        activeUsers: userStats.filter(u => u.totalContributed > 0).length,
        totalVolume: userStats.reduce((sum, u) => sum + u.totalContributed, 0)
      }
    })
  } catch (error) {
    console.error('Leaderboard API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
