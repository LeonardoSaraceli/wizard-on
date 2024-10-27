'use client'

import { FaPlus } from 'react-icons/fa6'
import style from '../assets/styles/equipe.module.css'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CiCircleInfo } from 'react-icons/ci'
import error from '../assets/styles/form.module.css'

interface EditEmployeeProps {
  currentEmployeeId: number
  setShowEditEmployee: (show: boolean) => void
}

export default function EditEmployee({
  currentEmployeeId,
  setShowEditEmployee,
}: EditEmployeeProps) {
  const router = useRouter()
  const [employee, setEmployee] = useState({
    name: '',
    cpf: '',
    password: '',
    role: '',
  })
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    password: '',
    role: '',
  })

  const [uniqueCpf, setUniqueCpf] = useState(true)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!uniqueCpf) {
      setUniqueCpf(true)
    }

    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    fetch(`${process.env.NEXT_PUBLIC_URL}/api/employee/${currentEmployeeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
      body: JSON.stringify({
        name: formData.name,
        cpf: formData.cpf,
        password: formData.password,
        role: formData.role,
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
          setShowEditEmployee(false)
        }
      })
  }

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_URL}/api/employee/${currentEmployeeId}`, {
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

        if (res.status === 409) {
          setUniqueCpf(false)
          return
        }

        return res.json()
      })
      .then((data) => {
        if (data) {
          setEmployee(data.employee)
        }
      })
  }, [currentEmployeeId, router])

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        cpf: employee.cpf,
        password: '',
        role: employee.role,
      })
    }
  }, [employee])

  return (
    <div className={style.editEmployee}>
      <div className={style.editEmployeeDiv}>
        <span className={style.funcionariosSpan}>Editar dados</span>

        <FaPlus
          className={style.viewEmployeeExit}
          onClick={() => setShowEditEmployee(false)}
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
            />
          </li>

          {!uniqueCpf && (
            <div className={error.error}>
              <CiCircleInfo className={error.info} />

              <span className={error.errorMessage}>CPF já cadastrado.</span>
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
