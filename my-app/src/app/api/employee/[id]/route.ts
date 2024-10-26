import { NextRequest } from 'next/server'
import { verifyToken } from '@/middleware/auth'
import {
  clientErrorHandler,
  deleteEmployee,
  getCompanyById,
  getEmployeeById,
  omitPassword,
  serverErrorHandler,
  updateEmployee,
} from '@/utils/helper'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  const tokenCheck = verifyToken(req)

  if (tokenCheck.error) {
    return clientErrorHandler(tokenCheck.error, 403)
  }

  try {
    const { id } = params
    const employee = await getEmployeeById(id)

    if (!employee.rowCount) {
      return clientErrorHandler('Employee not found', 404)
    }

    const employeeWithoutPassword = omitPassword(employee.rows)

    return new Response(
      JSON.stringify({ employee: employeeWithoutPassword[0] }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return serverErrorHandler(error)
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  const tokenCheck = verifyToken(req)

  if (tokenCheck.error) {
    return clientErrorHandler(tokenCheck.error, 403)
  }

  try {
    const companyId = tokenCheck.payload?.id
    const body = await req.json()
    const { cpf, password, name, role } = body
    const { id } = params

    const employee = await getEmployeeById(id)

    if (!employee.rowCount) {
      return clientErrorHandler('Employee not found', 404)
    }

    if (!cpf || !name || !role) {
      return clientErrorHandler('Missing fields in request body', 400)
    }

    const company = await getCompanyById(companyId)

    if (!company.rowCount) {
      return clientErrorHandler('Company not found', 404)
    }

    await updateEmployee(cpf, password, name, role, companyId, id)

    const newEmployee = await getEmployeeById(id)
    const employeeWithoutPassword = omitPassword(newEmployee.rows)

    return new Response(
      JSON.stringify({ employee: employeeWithoutPassword[0] }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return serverErrorHandler(error)
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  const tokenCheck = verifyToken(req)

  if (tokenCheck.error) {
    return clientErrorHandler(tokenCheck.error, 403)
  }

  try {
    const { id } = params
    const employee = await getEmployeeById(id)

    if (!employee.rowCount) {
      return clientErrorHandler('Employee not found', 404)
    }

    await deleteEmployee(id)

    const employeeWithoutPassword = omitPassword(employee.rows)

    return new Response(
      JSON.stringify({ employee: employeeWithoutPassword[0] }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return serverErrorHandler(error)
  }
}