import { NextResponse } from 'next/server'
import { getTokenFromCookie } from '@/lib/auth'

export async function GET() {
  const token = getTokenFromCookie()

  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const data = await fetch('https://saba.nus.ac.ir/rest/users/me', {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!data.ok) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

  const student = await data.json()
  return NextResponse.json(student)
}
