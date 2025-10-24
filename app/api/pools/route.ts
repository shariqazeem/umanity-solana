import { NextResponse } from 'next/server'
import { getAllPools } from '@/lib/storage'

export async function GET() {
  try {
    const pools = await getAllPools()

    return NextResponse.json({
      pools,
      totalDonations: pools.reduce((sum, pool) => sum + pool.totalDonated, 0),
      totalDonors: pools.reduce((sum, pool) => sum + pool.donorCount, 0)
    })
  } catch (error) {
    console.error('Get pools error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
