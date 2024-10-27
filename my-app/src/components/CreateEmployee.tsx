'use client'

import { FaPlus } from 'react-icons/fa6'
import { CiCircleInfo } from 'react-icons/ci'
import { ChangeEvent, FormEvent, useState } from 'react'
import style from '../assets/styles/equipe.module.css'
import error from '../assets/styles/form.module.css'
import { useRouter } from 'next/navigation'

interface CreateEmployeeProps {
  setShowCreateEmployee: (show: boolean) => void
  fecthEmployees: () => void
}

export default function CreateEmployee({
  setShowCreateEmployee,
  fecthEmployees,
}: CreateEmployeeProps) {
  const router = useRouter()

  const [formData, setFormData] = useState({
    cpf: '',
    name: '',
    password: '',
    role: '',
  })

  const [isCpfUnique, setIsCpfUnique] = useState(true)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isCpfUnique) {
      setIsCpfUnique(true)
    }

    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    fetch(`${process.env.NEXT_PUBLIC_URL}/api/employee`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
      body: JSON.stringify({
        cpf: formData.cpf,
        name: formData.name,
        password: formData.password,
        role: formData.role,
      }),
    })
      .then((res) => {
        if (res.status === 403 || res.status === 404) {
          router.push('/')
          return
        }

        if (res.status === 409) {
          setIsCpfUnique(false)
          return
        }

        return res.json()
      })
      .then((data) => {
        if (data) {
          fecthEmployees()
          setShowCreateEmployee(false)
        }
      })
  }

  return (
    <div className={style.editEmployee}>
      <div className={style.editEmployeeDiv}>
        <span className={style.funcionariosSpan}>Cadastrar funcionário</span>

        <FaPlus
          className={style.viewEmployeeExit}
          onClick={() => setShowCreateEmployee(false)}
        />
      </div>

      <form className={style.editEmployeeForm} onSubmit={handleSubmit}>
        <ul className={style.editEmployeeFormUl} style={{ gridArea: 'ul1' }}>
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
            <span className={style.funcionariosDivSpan}>Função</span>

            <input
              type="text"
              className={style.editEmployeeFormUlLiInput}
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            />
          </li>
        </ul>

        <div
          className={style.viewEmployeeDataBreak}
          style={{ gridArea: 'br' }}
        ></div>

        <ul className={style.editEmployeeFormUl} style={{ gridArea: 'ul2' }}>
          <li className={style.editEmployeeFormUlLi}>
            <span className={style.funcionariosDivSpan}>CPF</span>

            <input
              type="text"
              className={style.editEmployeeFormUlLiInput}
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              required
            />
          </li>

          <li className={style.editEmployeeFormUlLi}>
            <span className={style.funcionariosDivSpan}>Senha</span>

            <input
              type="password"
              className={style.editEmployeeFormUlLiInput}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </li>

          {!isCpfUnique && (
            <div className={error.error}>
              <CiCircleInfo className={error.info} />

              <span className={error.errorMessage}>CPF já cadastrado.</span>
            </div>
          )}
        </ul>

        <button type="submit" className={style.editEmployeeFormButton}>
          Registrar
        </button>
      </form>
    </div>
  )
}
