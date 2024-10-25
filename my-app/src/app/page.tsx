'use client'

import Image from 'next/image'
import wizardLogo from '../assets/images/wizard-logo.png'
import style from '../assets/styles/form.module.css'
import { ChangeEvent, FormEvent, useState } from 'react'
import { CiCircleInfo } from 'react-icons/ci'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: '',
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

    fetch(`${process.env.NEXT_PUBLIC_URL}/api/company/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    })
      .then((res) => {
        if (res.status === 404) {
          setWrongLogin(true)
          return
        }

        return res.json()
      })
      .then((data) => {
        if (data?.token) {
          localStorage.setItem('jwt', data.token)
          router.push('/dashboard')
        }
      })
  }

  return (
    <main className={style.main}>
      <Image
        src={wizardLogo}
        alt="Logo wizard"
        className={style.img}
        priority
      />

      <form className={style.form} onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          autoComplete="current-email"
          className={style.input}
          value={formData.email}
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
              E-mail e senha não coincidem
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
