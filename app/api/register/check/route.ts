import { NextRequest, NextResponse } from 'next/server'
import { findUser } from '@/lib/storage'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')

    if (!address) {
      return NextResponse.json({ error: 'Address required' }, { status: 400 })
    }

    const user = await findUser(address)

    return NextResponse.json({
      registered: !!user,
      user: user || null,
    })
  } catch (error) {
    console.error('Check registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
