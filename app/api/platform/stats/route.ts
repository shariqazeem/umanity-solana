import { NextResponse } from 'next/server'
import { getPlatformStats } from '@/lib/storage'

export async function GET() {
  try {
    const stats = await getPlatformStats()

    return NextResponse.json({
      success: true,
      stats
    })
  } catch (error) {
    console.error('Platform stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
