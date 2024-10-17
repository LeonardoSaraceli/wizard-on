import { NextRequest } from 'next/server'
import jwt, { JwtPayload } from 'jsonwebtoken'

interface CustomRequest extends NextRequest {
  user?: string | JwtPayload
}

export function verifyToken(req: CustomRequest): {
  error?: string
  payload?: string | JwtPayload
} {
  try {
    const header = req.headers.get('authorization')

    if (!header) {
      return { error: 'No token provided' }
    }

    const token = header.split(' ')[1]

    if (!token) {
      return { error: 'Token missing' }
    }

    const payload = jwt.verify(token, String(process.env.SECRET_KEY))

    return { payload }
  } catch (error) {
    return { error: `Invalid token: ${error}` }
  }
}
