import { FaPlus } from 'react-icons/fa6'
import style from '../assets/styles/equipe.module.css'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function EditEmployee({
  currentEmployeeId,
  setShowEditEmployee,
}) {
  const router = useRouter()
  const [employee, setEmployee] = useState({})
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    password: '',
    role: '',
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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

        return res.json()
      })
      .then((data) => {
        if (data) {
          setEmployee(data.employee)
        }
      })
  }, [currentEmployeeId])

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
        </ul>

        <button type="submit" className={style.editEmployeeFormButton}>
          Salvar
        </button>
      </form>
    </div>
  )
}
