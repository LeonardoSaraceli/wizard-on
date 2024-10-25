import {
  getAllCompanies,
  omitPassword,
  serverErrorHandler,
} from '@/utils/helper'

export async function GET() {
  try {
    const companies = await getAllCompanies()
    const companiesWithoutPassword = omitPassword(companies.rows)

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
