import { NextRequest } from 'next/server'
import { verifyToken } from '@/middleware/auth'
import {
  clientErrorHandler,
  createEmployee,
  getAllEmployeesByCompanyId,
  getCompanyById,
  getEmployeeByCpf,
  omitPassword,
  serverErrorHandler,
} from '@/utils/helper'
import { JwtPayload } from 'jsonwebtoken'

interface JwtPayloadWithId extends JwtPayload {
  id: number
}

export async function GET(req: NextRequest) {
  const tokenCheck = verifyToken(req)

  if (tokenCheck.error) {
    return clientErrorHandler(tokenCheck.error, 403)
  }

  try {
    const { searchParams } = new URL(req.url)
    const orderBy = searchParams.get('orderBy')
    const companyId = (tokenCheck.payload as JwtPayloadWithId).id
    const company = await getCompanyById(companyId)

    if (!company.rowCount) {
      return clientErrorHandler('Company not found', 404)
    }

    const employees = await getAllEmployeesByCompanyId(
      companyId,
      String(orderBy)
    )
    const employeesWithoutPassword = omitPassword(employees.rows)

    return new Response(
      JSON.stringify({ employees: employeesWithoutPassword }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
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
    const companyId = (tokenCheck.payload as JwtPayloadWithId).id
    const body = await req.json()
    const { cpf, password, name, role } = body

    if (!cpf || !password || !name || !role) {
      return clientErrorHandler('Missing fields in request body', 400)
    }

    const existingCpf = await getEmployeeByCpf(cpf)

    if (existingCpf.rowCount) {
      return clientErrorHandler('CPF already registered', 409)
    }

    const company = await getCompanyById(companyId)

    if (!company.rowCount) {
      return clientErrorHandler('Company not found', 404)
    }

    await createEmployee(cpf, password, name, role, companyId)

    const employee = await getEmployeeByCpf(cpf)
    const employeeWithoutPassword = omitPassword(employee.rows)

    return new Response(
      JSON.stringify({ employee: employeeWithoutPassword[0] }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return serverErrorHandler(error)
  }
}
