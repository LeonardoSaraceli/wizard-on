import { FaPlus } from 'react-icons/fa6'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import style from '../assets/styles/equipe.module.css'
import { useRouter } from 'next/navigation'

interface EditLeadEmployeeProps {
  currentLeadId: number
  setOpenEditLead: (show: boolean) => void
  fetchLeads: () => void
}

export default function EditLeadEmployee({
  setOpenEditLead,
  fetchLeads,
  currentLeadId,
}: EditLeadEmployeeProps) {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    cpf: '',
    interest: false,
    zip: '',
    city: '',
    location: '',
    email: '',
    birth: '',
    street: '',
    complement: '',
    level: '',
  })
  const [lead, setLead] = useState({
    name: '',
    phone: '',
    cpf: '',
    interest: false,
    zip: '',
    city: '',
    location: '',
    email: '',
    birth: '',
    street: '',
    complement: '',
    level: '',
    enroll: '',
    price: '',
  })

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
    fetch(`${process.env.NEXT_PUBLIC_URL}/api/lead/${currentLeadId}`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('jwtlead')}`,
      },
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
          setLead(data.lead)
        }
      })
  }, [currentLeadId, router])

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name,
        phone: lead.phone,
        cpf: lead.cpf,
        interest: lead.interest,
        zip: lead.zip,
        city: lead.city,
        location: lead.location,
        email: lead.email,
        birth: lead.birth,
        street: lead.street,
        complement: lead.complement,
        level: lead.level,
      })
    }
  }, [lead])

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    let newValue: string | boolean = value

    if (name === 'interest') {
      newValue = value === 'true'
    }

    setFormData({
      ...formData,
      [name]: newValue,
    })
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (!lead) {
      return
    }

    e.preventDefault()

    fetch(`${process.env.NEXT_PUBLIC_URL}/api/lead/${currentLeadId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('jwtlead')}`,
      },
      body: JSON.stringify({
        name: formData.name,
        phone: formData.phone,
        cpf: formData.cpf,
        interest: formData.interest,
        zip: formData.zip,
        city: formData.city,
        location: formData.location,
        email: formData.email,
        birth: formData.birth,
        street: formData.street,
        complement: formData.complement,
        level: formData.level,
        enroll: lead.enroll,
        price: lead.price,
      }),
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
          fetchLeads()
          setOpenEditLead(false)
        }
      })
  }

  return (
    <div className={style.editEmployee}>
      <div className={style.editEmployeeDiv}>
        <span className={style.funcionariosSpan}>Editar dados</span>

        <FaPlus
          className={style.viewEmployeeExit}
          onClick={() => setOpenEditLead(false)}
        />
      </div>

      <form className={style.editEmployeeForm} onSubmit={handleSubmit}>
        <ul
          className={style.editEmployeeFormUl}
          style={isMobile ? undefined : { gridArea: 'ul1' }}
        >
          <li className={style.editEmployeeFormUlLi}>
            <span className={style.funcionariosDivSpan}>Nome</span>

            <input
              type="text"
              className={style.editEmployeeFormUlLiInput}
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </li>

          <li className={style.editEmployeeFormUlLi}>
            <span className={style.funcionariosDivSpan}>Telefone</span>

            <input
              type="tel"
              className={style.editEmployeeFormUlLiInput}
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </li>

          <li className={style.editEmployeeFormUlLi}>
            <span className={style.funcionariosDivSpan}>CPF</span>

            <input
              type="text"
              className={style.editEmployeeFormUlLiInput}
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
            />
          </li>

          <li className={style.editEmployeeFormUlLi}>
            <span className={style.funcionariosDivSpan}>Interesse</span>

            <select
              name="interest"
              className={style.editEmployeeFormUlLiInput}
              value={formData.interest ? 'true' : 'false'}
              onChange={handleChange}
              required
            >
              <option value="true">Sim</option>
              <option value="false">Não</option>
            </select>
          </li>

          <li className={style.editEmployeeFormUlLi}>
            <span className={style.funcionariosDivSpan}>CEP</span>

            <input
              type="text"
              className={style.editEmployeeFormUlLiInput}
              name="zip"
              value={formData.zip}
              onChange={handleChange}
            />
          </li>

          <li className={style.editEmployeeFormUlLi}>
            <span className={style.funcionariosDivSpan}>Cidade</span>

            <input
              type="text"
              className={style.editEmployeeFormUlLiInput}
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </li>
        </ul>

        <div
          className={style.viewEmployeeDataBreak}
          style={isMobile ? undefined : { gridArea: 'br' }}
        ></div>

        <ul
          className={style.editEmployeeFormUl}
          style={isMobile ? undefined : { gridArea: 'ul2' }}
        >
          <li className={style.editEmployeeFormUlLi}>
            <span className={style.funcionariosDivSpan}>Localidade</span>

            <input
              type="text"
              className={style.editEmployeeFormUlLiInput}
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </li>

          <li className={style.editEmployeeFormUlLi}>
            <span className={style.funcionariosDivSpan}>E-mail</span>

            <input
              type="email"
              className={style.editEmployeeFormUlLiInput}
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </li>

          <li className={style.editEmployeeFormUlLi}>
            <span className={style.funcionariosDivSpan}>
              Data de nascimento
            </span>

            <input
              type="date"
              className={style.editEmployeeFormUlLiInput}
              name="birth"
              value={formData.birth}
              onChange={handleChange}
            />
          </li>

          <li className={style.editEmployeeFormUlLi}>
            <span className={style.funcionariosDivSpan}>Rua</span>

            <input
              type="text"
              name="street"
              className={style.editEmployeeFormUlLiInput}
              value={formData.street}
              onChange={handleChange}
            />
          </li>

          <li className={style.editEmployeeFormUlLi}>
            <span className={style.funcionariosDivSpan}>Complemento</span>

            <input
              type="text"
              className={style.editEmployeeFormUlLiInput}
              name="complement"
              value={formData.complement}
              onChange={handleChange}
            />
          </li>

          <li className={style.editEmployeeFormUlLi}>
            <span className={style.funcionariosDivSpan}>Nível</span>

            <input
              type="text"
              className={style.editEmployeeFormUlLiInput}
              name="level"
              value={formData.level}
              onChange={handleChange}
            />
          </li>
        </ul>

        <button type="submit" className={style.editEmployeeFormButton}>
          Salvar
        </button>
      </form>
    </div>
  )
}
