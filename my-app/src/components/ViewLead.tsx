import { FaPlus } from 'react-icons/fa6'
import style from '../assets/styles/leads.module.css'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ViewLead({ currentLeadId, setOpenViewLead }) {
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
  const [employee, setEmployee] = useState({ name: '' })
  const [currentUrl, setCurrentUrl] = useState('')

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
    if (!lead.employeeid) {
      return
    }

    fetch(`${process.env.NEXT_PUBLIC_URL}/api/employee/${lead?.employeeid}`, {
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
  }, [lead, router])

  return (
    <div
      className={style.viewLead}
      style={currentUrl.includes('equipe') ? { zIndex: '3' } : undefined}
    >
      <div className={style.viewLeadDiv}>
        <span className={style.viewLeadDivSpan}>Dados</span>

        <FaPlus
          className={style.viewLeadDivExit}
          onClick={() => setOpenViewLead(false)}
        />
      </div>

      <div className={style.viewLeadData}>
        <ul className={style.viewLeadDataUl}>
          <li className={style.viewLeadDataUlLi}>
            <span className={style.viewLeadDataUlLiSpan}>Nome</span>

            <input
              type="text"
              className={style.viewLeadDataUlLiInput}
              value={lead.name || ''}
              readOnly
            />
          </li>

          <li className={style.viewLeadDataUlLi}>
            <span className={style.viewLeadDataUlLiSpan}>Telefone</span>

            <input
              type="text"
              className={style.viewLeadDataUlLiInput}
              value={lead.phone || ''}
              readOnly
            />
          </li>

          <li className={style.viewLeadDataUlLi}>
            <span className={style.viewLeadDataUlLiSpan}>CPF</span>

            <input
              type="text"
              className={style.viewLeadDataUlLiInput}
              value={lead.cpf || ''}
              readOnly
            />
          </li>

          <li className={style.viewLeadDataUlLi}>
            <span className={style.viewLeadDataUlLiSpan}>Interesse</span>

            <input
              type="text"
              className={style.viewLeadDataUlLiInput}
              value={lead.interest ? 'Sim' : 'Não'}
              readOnly
            />
          </li>

          <li className={style.viewLeadDataUlLi}>
            <span className={style.viewLeadDataUlLiSpan}>CEP</span>

            <input
              type="text"
              className={style.viewLeadDataUlLiInput}
              value={lead.zip || ''}
              readOnly
            />
          </li>

          <li className={style.viewLeadDataUlLi}>
            <span className={style.viewLeadDataUlLiSpan}>Cidade</span>

            <input
              type="text"
              className={style.viewLeadDataUlLiInput}
              value={lead.city || ''}
              readOnly
            />
          </li>

          <li className={style.viewLeadDataUlLi}>
            <span className={style.viewLeadDataUlLiSpan}>
              Preço do contrato
            </span>

            <input
              type="text"
              className={style.viewLeadDataUlLiInput}
              value={lead.price || ''}
              readOnly
            />
          </li>
        </ul>

        <div className={style.viewLeadDataBreak}></div>

        <ul className={style.viewLeadDataUl}>
          <li className={style.viewLeadDataUlLi}>
            <span className={style.viewLeadDataUlLiSpan}>Localidade</span>

            <input
              type="text"
              className={style.viewLeadDataUlLiInput}
              value={lead.location || ''}
              readOnly
            />
          </li>

          <li className={style.viewLeadDataUlLi}>
            <span className={style.viewLeadDataUlLiSpan}>E-mail</span>

            <input
              type="text"
              className={style.viewLeadDataUlLiInput}
              value={lead.email || ''}
              readOnly
            />
          </li>

          <li className={style.viewLeadDataUlLi}>
            <span className={style.viewLeadDataUlLiSpan}>
              Data de nascimento
            </span>

            <input
              type="text"
              className={style.viewLeadDataUlLiInput}
              value={lead.birth || ''}
              readOnly
            />
          </li>

          <li className={style.viewLeadDataUlLi}>
            <span className={style.viewLeadDataUlLiSpan}>Matricula</span>

            <input
              type="text"
              className={style.viewLeadDataUlLiInput}
              value={lead.enroll ? 'Sim' : 'Não'}
              readOnly
            />
          </li>

          <li className={style.viewLeadDataUlLi}>
            <span className={style.viewLeadDataUlLiSpan}>Rua</span>

            <input
              type="text"
              className={style.viewLeadDataUlLiInput}
              value={lead.street || ''}
              readOnly
            />
          </li>

          <li className={style.viewLeadDataUlLi}>
            <span className={style.viewLeadDataUlLiSpan}>Complemento</span>

            <input
              type="text"
              className={style.viewLeadDataUlLiInput}
              value={lead.complement || ''}
              readOnly
            />
          </li>

          <li className={style.viewLeadDataUlLi}>
            <span className={style.viewLeadDataUlLiSpan}>Nível</span>

            <input
              type="text"
              className={style.viewLeadDataUlLiInput}
              value={lead.level || ''}
              readOnly
            />
          </li>
        </ul>
      </div>

      <div className={style.viewLeadDataUlLi}>
        <span className={style.viewLeadDataUlLiSpan}>Funcionário</span>

        <input
          type="text"
          className={style.viewLeadDataInput}
          value={employee.name || ''}
          readOnly
        />
      </div>
    </div>
  )
}
