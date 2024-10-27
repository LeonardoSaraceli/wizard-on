/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from '@/lib/db'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export function serverErrorHandler(error: unknown) {
  if (error instanceof Error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ error: 'An unknown error occurred' }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  })
}

interface Row {
  [key: string]: unknown
  password?: string
}

export function omitPassword(rows: Row[]) {
  return rows.map((row) => {
    const { password, ...rest } = row
    return rest
  })
}

export function clientErrorHandler(message: string, statusCode: number) {
  return new Response(JSON.stringify({ error: message }), {
    status: statusCode,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function getCompanyById(id: number) {
  return await db.query('SELECT * FROM companies WHERE id = $1', [id])
}

export async function getCompanyByEmail(email: string) {
  return await db.query('SELECT * FROM companies WHERE email = $1', [email])
}

export async function createCompany(
  email: string,
  password: string,
  unit: string
) {
  return await db.query(
    'INSERT INTO companies (email, password, unit) VALUES ($1, $2, $3)',
    [email, await bcrypt.hash(String(password), 10), unit]
  )
}

export async function verifyCompanyLogin(email: string, password: string) {
  const company = await getCompanyByEmail(email)

  if (!company.rowCount) {
    return false
  }

  const match = await bcrypt.compare(
    String(password),
    String(company.rows[0].password)
  )

  return !match ? false : company.rows[0]
}

export function createToken(companyId: number) {
  return jwt.sign({ id: companyId }, String(process.env.SECRET_KEY))
}

export async function getEmployeeByCpf(cpf: string) {
  return await db.query('SELECT * FROM employees WHERE cpf = $1', [cpf])
}

export async function getAllEmployeesByCompanyId(
  companyId: number,
  orderBy: string
) {
  let query = 'SELECT * FROM employees WHERE companyId = $1'

  if (orderBy) {
    query += ` ORDER BY name ${orderBy}`
  }

  console.log(query)

  return await db.query(query, [companyId])
}

export async function createEmployee(
  cpf: string,
  password: string,
  name: string,
  role: string,
  companyId: number
) {
  return await db.query(
    'INSERT INTO employees (cpf, password, name, role, companyId) VALUES ($1, $2, $3, $4, $5)',
    [cpf, await bcrypt.hash(String(password), 10), name, role, companyId]
  )
}

export async function getEmployeeById(id: number) {
  return await db.query('SELECT * FROM employees WHERE id = $1', [id])
}

export async function updateEmployee(
  cpf: string,
  password: string,
  name: string,
  role: string,
  companyId: number,
  id: number
) {
  let query = 'UPDATE employees SET cpf = $1, name = $2, role = $3'
  let paramIndex = 4
  const queryArr: (string | number)[] = [cpf, name, role]

  if (password) {
    query += `, password = $${paramIndex}`
    queryArr.push(await bcrypt.hash(String(password), 10))
    paramIndex++
  }

  if (companyId) {
    query += `, companyId = $${paramIndex}`
    queryArr.push(companyId)
    paramIndex++
  }

  query += ` WHERE id = $${paramIndex}`
  queryArr.push(id)

  return await db.query(query, queryArr)
}

export async function deleteEmployee(id: number) {
  return await db.query('DELETE FROM employees WHERE id = $1', [id])
}

export async function getAllLeadsByCompanyId(
  companyId: number,
  startDate: string | null,
  endDate: string | null,
  location: string | null,
  enroll: string | null
) {
  let query =
    'SELECT leads.* FROM leads JOIN employees ON leads.employeeId = employees.id WHERE employees.companyId = $1'

  const params: (string | number | null)[] = [companyId]
  let paramIndex = 2

  if (startDate) {
    query += ` AND leads.created_at >= $${paramIndex}`
    params.push(startDate)
    paramIndex++
  } else {
    query += " AND leads.created_at >= '1970-01-01'"
  }

  if (endDate) {
    query += ` AND leads.created_at <= $${paramIndex}`
    params.push(endDate)
    paramIndex++
  } else {
    query += ' AND leads.created_at <= NOW()'
  }

  if (location) {
    query += ` AND leads.location = $${paramIndex}`
    params.push(location)
    paramIndex++
  }

  if (enroll) {
    query += ` AND leads.enroll = $${paramIndex}`
    params.push(enroll)
  }

  return await db.query(query, params)
}

export async function createLead(
  location: string,
  name: string,
  phone: string,
  email: string,
  cpf: string,
  birth: string,
  zip: string,
  street: string,
  complement: string,
  city: string,
  level: string,
  interest: boolean,
  employeeId: number
) {
  return await db.query(
    'INSERT INTO leads (location, name, phone, email, cpf, birth, zip, street, complement, city, level, interest, employeeId) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
    [
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
    ]
  )
}

export async function getMostRecentLead() {
  return await db.query('SELECT * FROM leads ORDER BY created_at DESC LIMIT 1')
}

export async function getLeadById(id: number) {
  return await db.query('SELECT * FROM leads WHERE id = $1', [id])
}

export async function updateLead(
  location: string,
  name: string,
  phone: string,
  email: string,
  cpf: string,
  birth: string,
  zip: string,
  street: string,
  complement: string,
  city: string,
  level: string,
  interest: boolean,
  enroll: boolean,
  price: number,
  leadId: object
) {
  return await db.query(
    'UPDATE leads SET location = $1, name = $2, phone = $3, email = $4, cpf = $5, birth = $6, zip = $7, street = $8, complement = $9, city = $10, level = $11, interest = $12, enroll = $13, price = $14 WHERE id = $15',
    [
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
      enroll,
      price,
      leadId,
    ]
  )
}

export async function deleteLead(id: number) {
  return await db.query('DELETE FROM leads WHERE id = $1', [id])
}

export async function getAllCompanies() {
  return await db.query('SELECT * FROM companies')
}

export async function getEmployeeLeads(
  employeeId: number,
  startDate: string | null,
  endDate: string | null,
  location: string | null,
  enroll: string | null
) {
  let query = 'SELECT * FROM leads WHERE employeeId = $1'

  const params: (string | number | null)[] = [employeeId]
  let paramIndex = 2

  if (startDate) {
    query += ` AND leads.created_at >= $${paramIndex}`
    params.push(startDate)
    paramIndex++
  } else {
    query += " AND leads.created_at >= '1970-01-01'"
  }

  if (endDate) {
    query += ` AND leads.created_at <= $${paramIndex}`
    params.push(endDate)
    paramIndex++
  } else {
    query += ' AND leads.created_at <= NOW()'
  }

  if (location) {
    query += ` AND leads.location = $${paramIndex}`
    params.push(location)
    paramIndex++
  }

  if (enroll) {
    query += ` AND leads.enroll = $${paramIndex}`
    params.push(enroll)
  }

  return (await db.query(query, params)).rows
}

export async function editCompany(
  unit: string,
  email: string,
  password: string | null,
  companyId: number
) {
  let query = 'UPDATE companies SET unit = $1, email = $2'
  const params: (string | number)[] = [unit, email]
  let paramIdx = 3

  if (password) {
    query += `, password = $${paramIdx}`
    params.push(await bcrypt.hash(String(password), 10))
    paramIdx++
  }

  query += ` WHERE id = $${paramIdx}`
  params.push(companyId)

  return (await db.query(query, params)).rows
}

export async function verifyEmployeeLogin(cpf: string, password: string) {
  const employee = await getEmployeeByCpf(cpf)

  if (!employee.rowCount) {
    return false
  }

  const match = await bcrypt.compare(
    String(password),
    String(employee.rows[0].password)
  )

  return !match ? false : employee.rows[0]
}
