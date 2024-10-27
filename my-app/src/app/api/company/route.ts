import { verifyToken } from '@/middleware/auth'
import {
  clientErrorHandler,
  getCompanyById,
  omitPassword,
  serverErrorHandler,
} from '@/utils/helper'
import { JwtPayload } from 'jsonwebtoken'
import { NextRequest } from 'next/server'

interface JwtPayloadWithId extends JwtPayload {
  id: number
}

export async function GET(req: NextRequest) {
  const tokenCheck = verifyToken(req)

  if (tokenCheck.error) {
    return clientErrorHandler(tokenCheck.error, 403)
  }

  try {
    const id = (tokenCheck.payload as JwtPayloadWithId).id
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
