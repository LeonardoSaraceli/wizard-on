'use client'

import Image from 'next/image'
import style from '../../assets/styles/form.module.css'
import wizardLogo from '../../assets/images/wizard-logo.png'
import { ChangeEvent, FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CiCircleInfo } from 'react-icons/ci'

export default function Funcionario() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    cpf: '',
    password: '',
  })

  const [wrongLogin, setWrongLogin] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (wrongLogin) {
      setWrongLogin(false)
    }

    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    fetch(`${process.env.NEXT_PUBLIC_URL}/api/employee/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cpf: formData.cpf,
        password: formData.password,
      }),
    })
      .then((res) => {
        if (res.status === 404 || res.status === 400) {
          setWrongLogin(true)
          return
        }

        return res.json()
      })
      .then((data) => {
        if (data) {
          localStorage.setItem('jwtlead', data.token)
          router.push('/funcionario/leads')
        }
      })
  }

  return (
    <main className={style.mainFuncionario}>
      <div className={style.mainFuncionarioDiv}>
        <Image
          src={wizardLogo}
          alt="Logo wizard"
          className={style.img}
          priority
        />

        <span className={style.mainFuncionarioDivSpan}>
          Área de acesso exclusivo para funcionários de cada filial Wizard.
        </span>
      </div>

      <form className={style.form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="cpf"
          placeholder="CPF"
          autoComplete="current-cpf"
          className={style.input}
          value={formData.cpf}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Senha"
          autoComplete="current-password"
          className={style.input}
          value={formData.password}
          onChange={handleChange}
          required
        />

        {wrongLogin && (
          <div className={style.error}>
            <CiCircleInfo className={style.info} />

            <span className={style.errorMessage}>
              CPF e senha não coincidem
            </span>
          </div>
        )}

        <button type="submit" className={style.btn}>
          Entrar
        </button>
      </form>
    </main>
  )
}
