import { verifyToken } from '@/middleware/auth'
import {
  clientErrorHandler,
  editCompany,
  getCompanyByEmail,
  getCompanyById,
  omitPassword,
  serverErrorHandler,
} from '@/utils/helper'
import { NextRequest } from 'next/server'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  const tokenCheck = verifyToken(req)

  if (tokenCheck.error) {
    return clientErrorHandler(tokenCheck.error, 403)
  }

  try {
    const { id } = params
    const company = await getCompanyById(id)

    if (!company.rowCount) {
      return clientErrorHandler('Company not found', 404)
    }

    const body = await req.json()
    const { unit, email, password } = body

    if (!unit || !email) {
      return clientErrorHandler('Missing fields in request body', 400)
    }

    const notUniqueCompanyEmail = await getCompanyByEmail(company.rows[0].email)

    if (notUniqueCompanyEmail && email !== company.rows[0].email) {
      return clientErrorHandler('Email already registered', 409)
    }

    const newCompany = await editCompany(unit, email, password, id)
    const companyWithoutPassword = omitPassword(newCompany)

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
