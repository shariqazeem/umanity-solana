import { NextRequest, NextResponse } from 'next/server'
import { createDonation, updateUserDonation, getAllDonations, getDonationStats } from '@/lib/storage'
import { PLATFORM_CONFIG } from '@/lib/constants'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { donor, amount, signature, type } = body

    if (!donor || !amount || !signature) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const solAmount = parseFloat(amount)

    // Calculate rewards
    const rewardPoints = Math.floor(solAmount * PLATFORM_CONFIG.POINTS_PER_SOL)

    // Create donation record
    const donation = await createDonation({
      donor,
      amount: solAmount,
      signature,
      type: type || 'one-tap',
      rewardPointsEarned: rewardPoints,
      status: 'pending',
    })

    if (!donation) {
      return NextResponse.json({ error: 'Failed to record donation' }, { status: 500 })
    }

    // Update donor stats
    await updateUserDonation(donor, solAmount, rewardPoints)

    return NextResponse.json({
      success: true,
      donation,
      rewardPointsEarned: rewardPoints,
      message: `Donation recorded! You earned ${rewardPoints} reward points!`
    })
  } catch (error) {
    console.error('Donation API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const donations = await getAllDonations()
    const stats = await getDonationStats()

    return NextResponse.json({
      donations,
      stats
    })
  } catch (error) {
    console.error('Get donations error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
