import { FaPlus } from 'react-icons/fa6'
import style from '../assets/styles/equipe.module.css'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CiCircleInfo } from 'react-icons/ci'
import error from '../assets/styles/form.module.css'

export default function EditCompany({ setShowEditCompany }) {
  const router = useRouter()

  const [company, setCompany] = useState({
    id: '',
    unit: '',
    email: '',
    password: '',
    created_at: '',
  })
  const [formData, setFormData] = useState({
    unit: '',
    email: '',
    password: '',
    created_at: '',
  })

  const [uniqueEmail, setUniqueEmail] = useState(true)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!uniqueEmail) {
      setUniqueEmail(true)
    }

    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_URL}/api/company/`, {
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
          setCompany(data.company)
        }
      })
  }, [router])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!company.id) {
      return
    }

    fetch(`${process.env.NEXT_PUBLIC_URL}/api/company/${company.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
      body: JSON.stringify({
        unit: formData.unit,
        email: formData.email,
        password: formData.password,
      }),
    })
      .then((res) => {
        if (res.status === 403 || res.status === 404) {
          router.push('/')
          return
        }

        if (res.status === 409) {
          setUniqueEmail(false)
          return
        }

        return res.json()
      })
      .then((data) => {
        if (data) {
          setShowEditCompany(false)
        }
      })
  }

  useEffect(() => {
    if (company) {
      setFormData({
        unit: company.unit,
        email: company.email,
        password: '',
        created_at: company.created_at,
      })
    }
  }, [company])

  return (
    <div className={style.editEmployee}>
      <div className={style.editEmployeeDiv}>
        <span className={style.funcionariosSpan}>Editar dados</span>

        <FaPlus
          className={style.viewEmployeeExit}
          onClick={() => setShowEditCompany(false)}
        />
      </div>

      <form className={style.editEmployeeForm} onSubmit={handleSubmit}>
        <ul className={style.editEmployeeFormUl} style={{ gridArea: 'ul1' }}>
          <li className={style.editEmployeeFormUlLi}>
            <span className={style.funcionariosDivSpan}>Nome da unidade</span>

            <input
              type="text"
              className={style.editEmployeeFormUlLiInput}
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              required
            />
          </li>

          <li className={style.editEmployeeFormUlLi}>
            <span className={style.funcionariosDivSpan}>Redefinir senha</span>

            <input
              type="password"
              className={style.editEmployeeFormUlLiInput}
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </li>
        </ul>

        <div
          className={style.viewEmployeeDataBreak}
          style={{ gridArea: 'br' }}
        ></div>

        <ul className={style.editEmployeeFormUl} style={{ gridArea: 'ul2' }}>
          <li className={style.editEmployeeFormUlLi}>
            <span className={style.funcionariosDivSpan}>E-mail</span>

            <input
              type="email"
              className={style.editEmployeeFormUlLiInput}
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </li>

          <li className={style.editEmployeeFormUlLi}>
            <span className={style.funcionariosDivSpan}>Criado em</span>

            <input
              type="text"
              className={style.editEmployeeFormUlLiInput}
              value={formData.created_at.split('T')[0]}
              readOnly
              style={{ cursor: 'not-allowed' }}
            />
          </li>

          {!uniqueEmail && (
            <div className={error.error}>
              <CiCircleInfo className={error.info} />

              <span className={error.errorMessage}>E-mail já registrado</span>
            </div>
          )}
        </ul>

        <button type="submit" className={style.editEmployeeFormButton}>
          Salvar
        </button>
      </form>
    </div>
  )
}
