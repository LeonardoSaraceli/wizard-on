import { verifyToken } from '@/middleware/auth'
import {
  clientErrorHandler,
  getCompanyById,
  omitPassword,
  serverErrorHandler,
} from '@/utils/helper'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const tokenCheck = verifyToken(req)

  if (tokenCheck.error) {
    return clientErrorHandler(tokenCheck.error, 403)
  }

  try {
    const id = tokenCheck.payload?.id
    const company = await getCompanyById(id)

    if (!company.rowCount) {
      return clientErrorHandler('Company not found', 404)
    }

    const companyWithoutPassword = omitPassword(company.rows)

    return new Response(
      JSON.stringify({ company: companyWithoutPassword[0] }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return serverErrorHandler(error)
  }
}
