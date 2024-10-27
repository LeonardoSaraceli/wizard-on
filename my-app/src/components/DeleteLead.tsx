import { FaPlus } from 'react-icons/fa6'
import style from '../assets/styles/equipe.module.css'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DeleteLead({
  currentLeadId,
  setOpenDeleteLead,
  fetchLeads,
}) {
  const router = useRouter()

  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])

  const handleDelete = () => {
    fetch(`${process.env.NEXT_PUBLIC_URL}/api/lead/${currentLeadId}`, {
      method: 'DELETE',
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
          fetchLeads()
          setOpenDeleteLead(false)
        }
      })
  }

  return (
    <div
      className={style.deleteEmployee}
      style={currentUrl.includes('equipe') ? { zIndex: '3' } : undefined}
    >
      <FaPlus
        className={style.viewEmployeeExit}
        onClick={() => setOpenDeleteLead(false)}
      />

      <span className={style.deleteEmployeeSpan}>
        Esta ação é irreversível, tem certeza que deseja excluir este
        funcionário?
      </span>

      <button className={style.deleteEmployeeBtn} onClick={handleDelete}>
        Deletar
      </button>
    </div>
  )
}
