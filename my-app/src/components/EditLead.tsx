import { FaPlus } from 'react-icons/fa6'
import style from '../assets/styles/leads.module.css'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface EditLeadProps {
  currentLeadId: number
  setOpenEditLead: (show: boolean) => void
  fetchLeads: () => void
}

export default function EditLead({
  currentLeadId,
  setOpenEditLead,
  fetchLeads,
}: EditLeadProps) {
  const router = useRouter()
  const [lead, setLead] = useState({
    name: '',
    phone: '',
    cpf: '',
    interest: false,
    zip: '',
    city: '',
    price: '',
    location: '',
    email: '',
    birth: '',
    enroll: false,
    street: '',
    complement: '',
    level: '',
    employeeid: '',
  })

  const [formData, setFormData] = useState({
    name: lead.name || '',
    phone: lead.phone || '',
    cpf: lead.cpf || '',
    interest: lead.interest || false,
    zip: lead.zip || '',
    city: lead.city || '',
    price: lead.price || '',
    location: lead.location || '',
    email: lead.email || '',
    birth: lead.birth || '',
    enroll: lead.enroll || false,
    street: lead.street || '',
    complement: lead.complement || '',
    level: lead.level || '',
    employeeid: lead.employeeid || '',
  })

  const [currentUrl, setCurrentUrl] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1279)
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_URL}/api/lead/${currentLeadId}`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    })
      .then((res) => {
        if (res.status === 403 || res.status === 404) {
          router.push('/')
          return
        }

        return res.json()
      })
      .then((data) => {
        if (data) {
          setLead(data.lead)
        }
      })
  }, [currentLeadId, router])

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    let newValue: string | boolean = value

    if (name === 'interest' || name === 'enroll') {
      newValue = value === 'true'
    }

    setFormData({
      ...formData,
      [name]: newValue,
    })
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    fetch(`${process.env.NEXT_PUBLIC_URL}/api/lead/${currentLeadId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
      body: JSON.stringify({
        location: formData.location,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        cpf: formData.cpf,
        birth: formData.birth,
        zip: formData.zip,
        street: formData.street,
        complement: formData.complement,
        city: formData.city,
        level: formData.level,
        interest: formData.interest,
        enroll: formData.enroll,
        price: formData.price,
      }),
    })
      .then((res) => {
        if (res.status === 403) {
          router.push('/')
          return
        }

        if (res.status === 404) {
          return
        }

        return res.json()
      })
      .then((data) => {
        if (data) {
          fetchLeads()
          setOpenEditLead(false)
        }
      })
  }

  useEffect(() => {
    setFormData({
      name: lead.name,
      phone: lead.phone,
      cpf: lead.cpf,
      interest: lead.interest,
      zip: lead.zip,
      city: lead.city,
      price: lead.price,
      location: lead.location,
      email: lead.email,
      birth: lead.birth,
      enroll: lead.enroll,
      street: lead.street,
      complement: lead.complement,
      level: lead.level,
      employeeid: lead.employeeid,
    })
  }, [lead])

  return (
    <div
      className={style.viewLead}
      style={currentUrl.includes('equipe') ? { zIndex: '3' } : undefined}
    >
      <div className={style.viewLeadDiv}>
        <span className={style.viewLeadDivSpan}>Dados</span>

        <FaPlus
          className={style.viewLeadDivExit}
          onClick={() => setOpenEditLead(false)}
        />
      </div>

      <form className={style.viewLeadDataEdit} onSubmit={handleSubmit}>
        <ul
          className={style.viewLeadDataUl}
          style={isMobile ? undefined : { gridArea: 'ul1' }}
        >
          <li className={style.viewLeadDataUlLi}>
            <span className={style.viewLeadDataUlLiSpan}>Nome</span>

            <input
              type="text"
              className={style.viewLeadDataUlLiInputEdit}
              name="name"
              onChange={handleChange}
              value={formData.name}
              required
            />
          </li>

          <li className={style.viewLeadDataUlLi}>
            <span className={style.viewLeadDataUlLiSpan}>Telefone</span>

            <input
              type="text"
              className={style.viewLeadDataUlLiInputEdit}
              name="phone"
              onChange={handleChange}
              value={formData.phone}
              required
            />
          </li>

          <li className={style.viewLeadDataUlLi}>
            <span className={style.viewLeadDataUlLiSpan}>CPF</span>

            <input
              type="text"
              className={style.viewLeadDataUlLiInputEdit}
              name="cpf"
              onChange={handleChange}
              value={formData.cpf}
            />
          </li>

          <li className={style.viewLeadDataUlLi}>
            <span className={style.viewLeadDataUlLiSpan}>Interesse</span>

            <select
              className={style.viewLeadDataUlLiInputEdit}
              name="interest"
              onChange={handleChange}
              value={formData.interest ? 'true' : 'false'}
              required
            >
              <option value="true">Sim</option>

              <option value="false">Não</option>
            </select>
          </li>

          <li className={style.viewLeadDataUlLi}>
            <span className={style.viewLeadDataUlLiSpan}>CEP</span>

            <input
              type="text"
              className={style.viewLeadDataUlLiInputEdit}
              name="zip"
              onChange={handleChange}
              value={formData.zip}
            />
          </li>

          <li className={style.viewLeadDataUlLi}>
            <span className={style.viewLeadDataUlLiSpan}>Cidade</span>

            <input
              type="text"
              className={style.viewLeadDataUlLiInputEdit}
              name="city"
              onChange={handleChange}
              value={formData.city}
            />
          </li>

          <li className={style.viewLeadDataUlLi}>
            <span className={style.viewLeadDataUlLiSpan}>
              Preço do contrato
            </span>

            <input
              type="number"
              className={style.viewLeadDataUlLiInputEdit}
              name="price"
              onChange={handleChange}
              value={formData.price}
            />
          </li>
        </ul>

        <div
          className={style.viewLeadDataBreak}
          style={isMobile ? undefined : { gridArea: 'br' }}
        ></div>

        <ul
          className={style.viewLeadDataUl}
          style={isMobile ? undefined : { gridArea: 'ul2' }}
        >
          <li className={style.viewLeadDataUlLi}>
            <span className={style.viewLeadDataUlLiSpan}>Localidade</span>

            <input
              type="text"
              className={style.viewLeadDataUlLiInputEdit}
              name="location"
              onChange={handleChange}
              value={formData.location}
              required
            />
          </li>

          <li className={style.viewLeadDataUlLi}>
            <span className={style.viewLeadDataUlLiSpan}>E-mail</span>

            <input
              type="text"
              className={style.viewLeadDataUlLiInputEdit}
              name="email"
              onChange={handleChange}
              value={formData.email}
            />
          </li>

          <li className={style.viewLeadDataUlLi}>
            <span className={style.viewLeadDataUlLiSpan}>
              Data de nascimento
            </span>

            <input
              type="text"
              className={style.viewLeadDataUlLiInputEdit}
              name="birth"
              onChange={handleChange}
              value={formData.birth}
            />
          </li>

          <li className={style.viewLeadDataUlLi}>
            <span className={style.viewLeadDataUlLiSpan}>Matricula</span>

            <select
              className={style.viewLeadDataUlLiInputEdit}
              name="enroll"
              onChange={handleChange}
              value={formData.enroll ? 'true' : 'false'}
            >
              <option value="true">Sim</option>

              <option value="false">Não</option>
            </select>
          </li>

          <li className={style.viewLeadDataUlLi}>
            <span className={style.viewLeadDataUlLiSpan}>Rua</span>

            <input
              type="text"
              className={style.viewLeadDataUlLiInputEdit}
              name="street"
              onChange={handleChange}
              value={formData.street}
            />
          </li>

          <li className={style.viewLeadDataUlLi}>
            <span className={style.viewLeadDataUlLiSpan}>Complemento</span>

            <input
              type="text"
              className={style.viewLeadDataUlLiInputEdit}
              name="complement"
              onChange={handleChange}
              value={formData.complement}
            />
          </li>

          <li className={style.viewLeadDataUlLi}>
            <span className={style.viewLeadDataUlLiSpan}>Nível</span>

            <input
              type="text"
              className={style.viewLeadDataUlLiInputEdit}
              name="level"
              onChange={handleChange}
              value={formData.level}
            />
          </li>
        </ul>

        <button type="submit" className={style.editLeadFormButton}>
          Salvar
        </button>
      </form>
    </div>
  )
}
