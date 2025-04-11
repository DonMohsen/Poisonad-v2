import { cookies } from 'next/headers'

export async function getTokenFromCookie() {
  const cookieStore =await cookies()
  return await cookieStore.get('token')?.value || null
}
