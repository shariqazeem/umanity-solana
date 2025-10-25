import { NextResponse } from 'next/server'
import { getAllDonations, getAllPoolDonations, getAllTips, findUser } from '@/lib/storage'

export async function GET() {
  try {
    const oneTapDonations = await getAllDonations()
    const poolDonations = await getAllPoolDonations()
    const tips = await getAllTips()

    // Combine all activities
    const activities: Array<{
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
    }> = []

    // Add one-tap donations
    for (const donation of oneTapDonations) {
      const user = await findUser(donation.donor)
      activities.push({
        id: donation.id,
        type: 'donation',
        user: donation.donor,
        username: user?.username,
        amount: donation.amount,
        timestamp: donation.timestamp,
        signature: donation.signature
      })
    }

    // Add pool donations
    for (const donation of poolDonations) {
      const user = await findUser(donation.donor)
      activities.push({
        id: donation.id,
        type: 'pool_donation',
        user: donation.donor,
        username: user?.username,
        amount: donation.amount,
        poolName: donation.poolName,
        timestamp: donation.timestamp,
        signature: donation.signature
      })
    }

    // Add tips
    for (const tip of tips) {
      const sender = await findUser(tip.sender)
      activities.push({
        id: tip.id,
        type: 'tip',
        user: tip.sender,
        username: sender?.username,
        amount: tip.amount,
        recipient: tip.recipient,
        recipientUsername: tip.recipientUsername,
        message: tip.message,
        timestamp: tip.timestamp,
        signature: tip.signature
      })
    }

    // Sort by timestamp (most recent first)
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Return recent 20 activities
    const recentActivities = activities.slice(0, 20)

    return NextResponse.json({
      success: true,
      activities: recentActivities,
      total: activities.length
    })
  } catch (error) {
    console.error('Activity feed API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
