import { NextRequest, NextResponse } from 'next/server'
import { createTip, updateSenderStats, updateRecipientStats } from '@/lib/storage'
import { calculateRewardPoints } from '@/lib/constants'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sender, recipient, recipientUsername, amount, message, signature } = body

    if (!sender || !recipient || !amount || !signature) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const solAmount = parseFloat(amount)

    // Calculate rewards using unified formula: 1 SOL = 1000 points
    const totalReward = calculateRewardPoints(solAmount)

    // Create tip record
    const tip = await createTip({
      sender,
      recipient,
      recipientUsername: recipientUsername || 'Unknown',
      amount: solAmount,
      message: message || '',
      signature,
      rewardPointsEarned: totalReward,
    })

    if (!tip) {
      return NextResponse.json({ error: 'Failed to record tip' }, { status: 500 })
    }

    // Update sender stats and rewards
    await updateSenderStats(sender, solAmount, totalReward)

    // Update recipient stats
    await updateRecipientStats(recipient, solAmount)

    return NextResponse.json({
      success: true,
      tip,
      rewardPointsEarned: totalReward,
      message: `Tip sent! You earned ${totalReward} reward points!`
    })
  } catch (error) {
    console.error('Tip API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { getAllTips } = await import('@/lib/storage')
    const tips = await getAllTips()

    return NextResponse.json({
      tips,
      totalTips: tips.reduce((sum, t) => sum + t.amount, 0)
    })
  } catch (error) {
    console.error('Get tips error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
