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

export async function GET(req: NextRequest) {
  const tokenCheck = verifyToken(req)

  if (tokenCheck.error) {
    return clientErrorHandler(tokenCheck.error, 403)
  }

  try {
    const { searchParams } = new URL(req.url)
    const companyId = searchParams.get('companyId')
    const company = await getCompanyById(Number(companyId))

    if (!company.rowCount) {
      return clientErrorHandler('Company not found', 404)
    }

    const employees = await getAllEmployeesByCompanyId(Number(companyId))
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
    const body = await req.json()
    const { cpf, password, name, role, companyId } = body

    if (!cpf || !password || !name || !role || !companyId) {
      return clientErrorHandler('Missing fields in request body', 400)
    }

    const existingCpf = await getEmployeeByCpf(cpf)

    if (existingCpf.rowCount) {
      return clientErrorHandler('CPF already registered', 409)
    }

    const company = await getCompanyById(Number(companyId))

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
