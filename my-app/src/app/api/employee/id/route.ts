import { verifyToken } from '@/middleware/auth'
import {
  clientErrorHandler,
  getEmployeeById,
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
    const employee = await getEmployeeById(id)

    if (!employee.rowCount) {
      return clientErrorHandler('Employee not found', 404)
    }

    const employeeWithoutPassword = omitPassword(employee.rows)

    return new Response(
      JSON.stringify({ employee: employeeWithoutPassword[0] })
    )
  } catch (error) {
    return serverErrorHandler(error)
  }
}
