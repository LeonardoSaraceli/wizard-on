import {
  clientErrorHandler,
  createToken,
  serverErrorHandler,
  verifyEmployeeLogin,
} from '@/utils/helper'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { cpf, password } = body

    if (!cpf || !password) {
      return clientErrorHandler('Missing fields in request body', 400)
    }

    const employee = await verifyEmployeeLogin(cpf, password)

    if (!employee) {
      return clientErrorHandler('Employee not found', 404)
    }

    const token = createToken(employee.id)

    return new Response(JSON.stringify({ token }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return serverErrorHandler(error)
  }
}
