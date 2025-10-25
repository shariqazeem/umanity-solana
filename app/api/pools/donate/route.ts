import { NextRequest, NextResponse } from 'next/server'
import { createPoolDonation, updatePoolStats, updateUserDonation, getAllPoolDonations } from '@/lib/storage'
import { calculateRewardPoints } from '@/lib/constants'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { donor, pool, poolName, amount, signature } = body

    if (!donor || !pool || !amount || !signature) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const solAmount = parseFloat(amount)

    // Calculate rewards using unified formula: 1 SOL = 1000 points
    const rewardPoints = calculateRewardPoints(solAmount)

    // Create pool donation record
    const donation = await createPoolDonation({
      donor,
      poolId: pool,
      poolName: poolName || 'Unknown Pool',
      amount: solAmount,
      signature,
      rewardPointsEarned: rewardPoints
    })

    if (!donation) {
      return NextResponse.json({ error: 'Failed to record donation' }, { status: 500 })
    }

    // Update pool stats (total raised)
    // Donor count is calculated dynamically from pool_donations table
    await updatePoolStats(pool, solAmount)

    // Update donor stats and reward points
    await updateUserDonation(donor, solAmount, rewardPoints)

    return NextResponse.json({
      success: true,
      donation,
      rewardPointsEarned: rewardPoints,
      message: `Successfully donated ${amount} SOL. You earned ${rewardPoints} reward points!`
    })
  } catch (error) {
    console.error('Pool donation API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const donations = await getAllPoolDonations()

    const stats = {
      totalDonations: donations.reduce((sum, d) => sum + d.amount, 0),
      totalDonors: new Set(donations.map(d => d.donor)).size,
      totalRewardsDistributed: donations.reduce((sum, d) => sum + d.rewardPointsEarned, 0),
      recentDonations: donations.slice(0, 10)
    }

    return NextResponse.json({
      donations,
      stats
    })
  } catch (error) {
    console.error('Get pool donations error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
