'use client'

import { FaPlus } from 'react-icons/fa6'
import { useEffect, useState } from 'react'
import style from '../assets/styles/equipe.module.css'
import { useRouter } from 'next/navigation'

interface ViewLeadEmployeeProps {
  setOpenViewLead: (show: boolean) => void
  currentLeadId: number
}

export default function ViewLeadEmployee({
  setOpenViewLead,
  currentLeadId,
}: ViewLeadEmployeeProps) {
  const router = useRouter()

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

  return (
    <div className={style.editEmployee}>
      <div className={style.editEmployeeDiv}>
        <span className={style.funcionariosSpan}>Dados</span>

        <FaPlus
          className={style.viewEmployeeExit}
          onClick={() => setOpenViewLead(false)}
        />
      </div>

      <div className={style.editEmployeeFormFuncionario}>
        <ul className={style.editEmployeeFormUl}>
          <li className={style.editEmployeeFormUlLi}>
            <span className={style.funcionariosDivSpan}>Nome</span>

            <input
              type="text"
              className={style.editEmployeeFormUlLiInput}
              name="name"
              value={lead.name || ''}
              readOnly
              style={{ cursor: 'not-allowed' }}
            />
          </li>

          <li className={style.editEmployeeFormUlLi}>
            <span className={style.funcionariosDivSpan}>Telefone</span>

            <input
              type="tel"
              className={style.editEmployeeFormUlLiInput}
              name="phone"
              value={lead.phone || ''}
              readOnly
              style={{ cursor: 'not-allowed' }}
            />
          </li>

          <li className={style.editEmployeeFormUlLi}>
            <span className={style.funcionariosDivSpan}>CPF</span>

            <input
              type="text"
              className={style.editEmployeeFormUlLiInput}
              name="cpf"
              value={lead.cpf || ''}
              readOnly
              style={{ cursor: 'not-allowed' }}
            />
          </li>

          <li className={style.editEmployeeFormUlLi}>
            <span className={style.funcionariosDivSpan}>Interesse</span>

            <input
              type="text"
              name="interest"
              className={style.editEmployeeFormUlLiInput}
              value={lead.interest ? 'Sim' : 'Não'}
              readOnly
              style={{ cursor: 'not-allowed' }}
            />
          </li>

          <li className={style.editEmployeeFormUlLi}>
            <span className={style.funcionariosDivSpan}>CEP</span>

            <input
              type="text"
              className={style.editEmployeeFormUlLiInput}
              name="zip"
              value={lead.zip || ''}
              readOnly
              style={{ cursor: 'not-allowed' }}
            />
          </li>

          <li className={style.editEmployeeFormUlLi}>
            <span className={style.funcionariosDivSpan}>Cidade</span>

            <input
              type="text"
              className={style.editEmployeeFormUlLiInput}
              name="city"
              value={lead.city || ''}
              readOnly
              style={{ cursor: 'not-allowed' }}
            />
          </li>
        </ul>

        <div className={style.viewEmployeeDataBreak}></div>

        <ul className={style.editEmployeeFormUl}>
          <li className={style.editEmployeeFormUlLi}>
            <span className={style.funcionariosDivSpan}>Localidade</span>

            <input
              type="text"
              className={style.editEmployeeFormUlLiInput}
              name="location"
              value={lead.location || ''}
              readOnly
              style={{ cursor: 'not-allowed' }}
            />
          </li>

          <li className={style.editEmployeeFormUlLi}>
            <span className={style.funcionariosDivSpan}>E-mail</span>

            <input
              type="email"
              className={style.editEmployeeFormUlLiInput}
              name="email"
              value={lead.email || ''}
              readOnly
              style={{ cursor: 'not-allowed' }}
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
              value={lead.birth || ''}
              readOnly
              style={{ cursor: 'not-allowed' }}
            />
          </li>

          <li className={style.editEmployeeFormUlLi}>
            <span className={style.funcionariosDivSpan}>Rua</span>

            <input
              type="text"
              name="street"
              className={style.editEmployeeFormUlLiInput}
              value={lead.street || ''}
              readOnly
              style={{ cursor: 'not-allowed' }}
            />
          </li>

          <li className={style.editEmployeeFormUlLi}>
            <span className={style.funcionariosDivSpan}>Complemento</span>

            <input
              type="text"
              className={style.editEmployeeFormUlLiInput}
              name="complement"
              value={lead.complement || ''}
              readOnly
              style={{ cursor: 'not-allowed' }}
            />
          </li>

          <li className={style.editEmployeeFormUlLi}>
            <span className={style.funcionariosDivSpan}>Nível</span>

            <input
              type="text"
              className={style.editEmployeeFormUlLiInput}
              name="level"
              value={lead.level || ''}
              readOnly
              style={{ cursor: 'not-allowed' }}
            />
          </li>
        </ul>
      </div>
    </div>
  )
}
