import { verifyToken } from '@/middleware/auth'
import {
  clientErrorHandler,
  getEmployeeById,
  getEmployeeLeads,
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
    const employeeId = searchParams.get('employeeId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const location = searchParams.get('location')
    const enroll = searchParams.get('enroll')

    const employee = await getEmployeeById(Number(employeeId))

    if (!employee.rowCount) {
      return clientErrorHandler('Employee not found', 404)
    }

    const leads = await getEmployeeLeads(
      employee.rows[0].id,
      startDate,
      endDate,
      location,
      enroll
    )

    return new Response(JSON.stringify({ leads }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return serverErrorHandler(error)
  }
}
