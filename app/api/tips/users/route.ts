import { NextResponse } from 'next/server'
import { getAllUsers } from '@/lib/storage'

export async function GET() {
  try {
    const users = await getAllUsers()

    return NextResponse.json({
      users: users.filter(u => u.isActive),
      totalUsers: users.length
    })
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
