import { NextRequest } from 'next/server'
import {
  clientErrorHandler,
  createCompany,
  getCompanyByEmail,
  omitPassword,
  serverErrorHandler,
} from '@/utils/helper'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, unit } = body

    if (!email || !password || !unit) {
      return clientErrorHandler('Missing fields in request body', 400)
    }

    const isEmailRegistered = await getCompanyByEmail(email)

    if (isEmailRegistered.rowCount) {
      return clientErrorHandler('Email already registered', 409)
    }

    await createCompany(email, password, unit)

    const company = await getCompanyByEmail(email)
    const companyWithoutPassword = omitPassword(company.rows)

    return new Response(
      JSON.stringify({ company: companyWithoutPassword[0] }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return serverErrorHandler(error)
  }
}
