import { NextRequest } from 'next/server'
import {
  clientErrorHandler,
  createToken,
  serverErrorHandler,
  verifyCompanyLogin,
} from '@/utils/helper'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return clientErrorHandler('Missing fields in request body', 400)
    }

    const company = await verifyCompanyLogin(email, password)

    if (!company) {
      return clientErrorHandler('Email and password do not match', 404)
    }

    const token = createToken(company.id)

    return new Response(JSON.stringify({ token }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return serverErrorHandler(error)
  }
}
