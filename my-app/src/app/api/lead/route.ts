import { verifyToken } from '@/middleware/auth'
import {
  clientErrorHandler,
  createLead,
  getAllLeadsByCompanyId,
  getCompanyById,
  getEmployeeById,
  getMostRecentLead,
  serverErrorHandler,
} from '@/utils/helper'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const tokenCheck = verifyToken(req)

  if (tokenCheck.error) {
    return clientErrorHandler(tokenCheck.error, 403)
  }

  try {
    const { searchParams } = new URL(req.url)
    const companyId = tokenCheck.payload.id
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const location = searchParams.get('location')

    const company = await getCompanyById(companyId)

    if (!company.rowCount) {
      return clientErrorHandler('Company not found', 404)
    }

    const leads = await getAllLeadsByCompanyId(
      companyId,
      startDate,
      endDate,
      location
    )

    return new Response(JSON.stringify({ leads: leads.rows }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return serverErrorHandler(error)
  }
}

export async function POST(req: NextRequest) {
  const tokenCheck = verifyToken(req)

  if (tokenCheck.error) {
    return clientErrorHandler(tokenCheck.error, 403)
  }

  try {
    const body = await req.json()
    const {
      location,
      name,
      phone,
      email,
      cpf,
      birth,
      zip,
      street,
      complement,
      city,
      level,
      interest,
      employeeId,
    } = body

    if (!location || !name || !phone || !interest || !employeeId) {
      return clientErrorHandler('Missing fields in request body', 400)
    }

    const employee = await getEmployeeById(employeeId)

    if (!employee.rowCount) {
      return clientErrorHandler('Employee not found', 404)
    }

    await createLead(
      location,
      name,
      phone,
      email,
      cpf,
      birth,
      zip,
      street,
      complement,
      city,
      level,
      interest,
      employeeId
    )

    const lead = (await getMostRecentLead()).rows[0]

    return new Response(JSON.stringify({ lead }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return serverErrorHandler(error)
  }
}
