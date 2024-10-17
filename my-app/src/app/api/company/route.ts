import { db } from '@/lib/db'
import { omitPassword, serverErrorHandler } from '@/utils/helper'

export async function GET() {
  try {
    const companies = (await db.query('SELECT * FROM companies')).rows
    const companiesWithoutPassword = omitPassword(companies)

    return new Response(
      JSON.stringify({ companies: companiesWithoutPassword }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return serverErrorHandler(error)
  }
}
