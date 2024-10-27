import { FaPlus } from 'react-icons/fa6'
import style from '../assets/styles/equipe.module.css'
import { useRouter } from 'next/navigation'

interface DeleteEmployeeProps {
  currentEmployeeId: number
  setShowDeleteEmployee: (show: boolean) => void
  fecthEmployees: () => void
}

export default function DeleteEmployee({
  currentEmployeeId,
  setShowDeleteEmployee,
  fecthEmployees,
}: DeleteEmployeeProps) {
  const router = useRouter()

  const handleDelete = () => {
    fetch(`${process.env.NEXT_PUBLIC_URL}/api/employee/${currentEmployeeId}`, {
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
          fecthEmployees()
          setShowDeleteEmployee(false)
        }
      })
  }

  return (
    <div className={style.deleteEmployee}>
      <FaPlus
        className={style.viewEmployeeExit}
        onClick={() => setShowDeleteEmployee(false)}
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
