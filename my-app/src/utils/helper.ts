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
  const match = await bcrypt.compare(
    String(password),
    String(company.rows[0].password)
  )

  return !company.rowCount || !match ? false : company.rows[0]
}

export function createToken(companyId: number) {
  return jwt.sign({ id: companyId }, String(process.env.SECRET_KEY))
}

export async function getEmployeeByCpf(cpf: string) {
  return await db.query('SELECT * FROM employees WHERE cpf = $1', [cpf])
}

export async function getAllEmployeesByCompanyId(companyId: number) {
  return await db.query('SELECT * FROM employees WHERE companyId = $1', [
    companyId,
  ])
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
  return await db.query(
    'UPDATE employees SET cpf = $1, password = $2, name = $3, role = $4, companyId = $5 WHERE id = $6',
    [cpf, await bcrypt.hash(String(password), 10), name, role, companyId, id]
  )
}

export async function deleteEmployee(id: number) {
  return await db.query('DELETE FROM employees WHERE id = $1', [id])
}

export async function getAllLeadsByCompanyId(companyId: number) {
  return await db.query(
    'SELECT leads.* FROM leads JOIN employees ON leads.employeeId = employees.id WHERE employees.companyId = $1',
    [companyId]
  )
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
