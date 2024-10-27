import { verifyToken } from '@/middleware/auth'
import {
  clientErrorHandler,
  deleteLead,
  getLeadById,
  serverErrorHandler,
  updateLead,
} from '@/utils/helper'
import { NextRequest } from 'next/server'

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
    const lead = await getLeadById(id)

    if (!lead.rowCount) {
      return clientErrorHandler('Lead not found', 404)
    }

    return new Response(JSON.stringify({ lead: lead.rows[0] }), {
      headers: { 'Content-Type': 'application/json' },
    })
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
    const { id } = params
    const lead = await getLeadById(id)

    if (!lead.rowCount) {
      return clientErrorHandler('Lead not found', 404)
    }

    const body = await req.json()
    const {
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
    } = body

    if (!location || !name || !phone || typeof interest === 'undefined') {
      return clientErrorHandler('Missing fields in request body', 400)
    }

    await updateLead(
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
      lead.rows[0].id
    )

    const newLead = await getLeadById(id)

    return new Response(JSON.stringify({ lead: newLead.rows[0] }), {
      headers: { 'Content-Type': 'application/json' },
    })
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
    const lead = await getLeadById(id)

    if (!lead.rowCount) {
      return clientErrorHandler('Lead not found', 404)
    }

    await deleteLead(id)

    return new Response(JSON.stringify({ lead: lead.rows[0] }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return serverErrorHandler(error)
  }
}
