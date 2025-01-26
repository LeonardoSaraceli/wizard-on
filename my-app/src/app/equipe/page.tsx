'use client'

const Aside = dynamic(() => import('@/components/Aside'), {
  ssr: false,
})
import style from '../../assets/styles/equipe.module.css'
import Header from '@/components/Header'
import { FaPlus } from 'react-icons/fa6'
import { HiMiniAdjustmentsHorizontal } from 'react-icons/hi2'
import { IoIosArrowDown } from 'react-icons/io'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { FaRegEye } from 'react-icons/fa'
import { FiEdit2 } from 'react-icons/fi'
import { RiDeleteBin7Line } from 'react-icons/ri'
import { useCallback, useEffect, useState } from 'react'
import OrderByFilter from '@/components/OrderByFilter'
import { useRouter } from 'next/navigation'
const ViewEmployee = dynamic(() => import('@/components/ViewEmployee'), {
  ssr: false,
})
const EditEmployee = dynamic(() => import('@/components/EditEmployee'), {
  ssr: false,
})
const DeleteEmployee = dynamic(() => import('@/components/DeleteEmployee'), {
  ssr: false,
})
const CreateEmployee = dynamic(() => import('@/components/CreateEmployee'), {
  ssr: false,
})
import dynamic from 'next/dynamic'
import HeaderMobile from '@/components/HeaderMobile'
import AsideMobile from '@/components/AsideMobile'

interface Employee {
  id: number
  name: string
}

export default function Equipe() {
  const router = useRouter()

  const [openOrderByFilter, setOpenOrderByFilter] = useState(false)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [search, setSearch] = useState('')
  const [order, setOrder] = useState('ASC')
  const [inputText, setInputText] = useState('Ordem crescente')
  const [showViewEmployee, setShowViewEmployee] = useState(false)
  const [currentEmployeeId, setCurrentEmployeeId] = useState(0)
  const [showBlur, setShowBlur] = useState(false)
  const [showEditEmployee, setShowEditEmployee] = useState(false)
  const [showDeleteEmployee, setShowDeleteEmployee] = useState(false)
  const [showCreateEmployee, setShowCreateEmployee] = useState(false)

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1279)
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (
      showViewEmployee ||
      showEditEmployee ||
      showDeleteEmployee ||
      showCreateEmployee
    ) {
      setShowBlur(true)
    } else {
      setShowBlur(false)
    }
  }, [
    showViewEmployee,
    showEditEmployee,
    showDeleteEmployee,
    showCreateEmployee,
  ])

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tokenValue = window.localStorage.getItem('jwt')
      setToken(tokenValue)
    }
  }, [token])

  const fecthEmployees = useCallback(() => {
    if (!token) {
      return
    }

    fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/employee${
        order ? `?orderBy=${order}` : ''
      }`,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => {
        if (res.status === 403 || res.status === 404) {
          router.push('/')
          return
        }

        return res.json()
      })
      .then((data) => {
        if (data) {
          setEmployees(data.employees)
        }
      })
  }, [order, router, token])

  useEffect(() => {
    fecthEmployees()
  }, [fecthEmployees])

  const employeeNameEllipsis = (name: string): string => {
    if (!name) {
      return ''
    }

    if (name.trim().length >= 30 && !isMobile) {
      return name.trim().split('').slice(0, 27).join('') + '...'
    }

    if (name.trim().length >= 15 && isMobile) {
      return name.trim().split('').slice(0, 12).join('') + '...'
    }

    return name.trim()
  }

  const searchEmployeeOutput = employees.filter((employee) =>
    employee.name.trim().toLowerCase().includes(search.trim().toLowerCase())
  )

  const [showAsideMobile, setShowAsideMobile] = useState(false)

  return (
    <main className={style.main}>
      <Aside />
      {isMobile && <HeaderMobile setShowAsideMobile={setShowAsideMobile} />}

      {showAsideMobile && (
        <AsideMobile setShowAsideMobile={setShowAsideMobile} />
      )}

      <section className={style.section}>
        <Header />

        <div className={style.equipe}>
          <div className={style.funcionarios}>
            <div className={style.funcionariosName}>
              <span className={style.funcionariosSpan}>Funcionários</span>

              <FaPlus
                className={style.funcionariosAdd}
                onClick={() => setShowCreateEmployee(!showCreateEmployee)}
              />
            </div>

            <ul className={style.funcionariosFilter}>
              <li
                className={style.funcionariosInput}
                onClick={() => setOpenOrderByFilter(!openOrderByFilter)}
              >
                <div className={style.funcionariosDiv}>
                  <span className={style.funcionariosDivSpan}>Filtragem</span>

                  <div className={style.funcionariosName}>
                    <HiMiniAdjustmentsHorizontal className={style.inputSvg} />

                    <span>{inputText}</span>
                  </div>
                </div>

                <IoIosArrowDown
                  className={style.inputSvg}
                  style={
                    openOrderByFilter
                      ? { transform: 'rotate(180deg)' }
                      : undefined
                  }
                />
              </li>

              {openOrderByFilter && (
                <OrderByFilter
                  setOrder={setOrder}
                  setOpenOrderByFilter={setOpenOrderByFilter}
                  setInputText={setInputText}
                />
              )}

              <li className={style.funcionariosSearch}>
                <FaMagnifyingGlass />

                <input
                  type="search"
                  placeholder="Pesquisar"
                  className={style.funcionariosSearchInput}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </li>
            </ul>

            <ul className={style.funcionariosUl}>
              {searchEmployeeOutput.map((employee) => (
                <li key={employee.id} className={style.funcionariosUlLi}>
                  <h1 className={style.funcionariosUlLiDivH1}>
                    {employeeNameEllipsis(employee.name)}
                  </h1>

                  <div className={style.funcionariosUlLiDiv}>
                    <FaRegEye
                      className={style.funcionariosUlLiDivSvg}
                      onClick={() => [
                        setShowViewEmployee(true),
                        setCurrentEmployeeId(employee.id),
                      ]}
                    />

                    <FiEdit2
                      className={style.funcionariosUlLiDivSvg}
                      onClick={() => [
                        setShowEditEmployee(true),
                        setCurrentEmployeeId(employee.id),
                      ]}
                    />

                    <RiDeleteBin7Line
                      className={style.funcionariosUlLiDivSvg}
                      onClick={() => [
                        setShowDeleteEmployee(true),
                        setCurrentEmployeeId(employee.id),
                      ]}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {showViewEmployee && (
          <ViewEmployee
            currentEmployeeId={currentEmployeeId}
            setShowViewEmployee={setShowViewEmployee}
            employeeNameEllipsis={employeeNameEllipsis}
          />
        )}

        {showEditEmployee && (
          <EditEmployee
            currentEmployeeId={currentEmployeeId}
            setShowEditEmployee={setShowEditEmployee}
          />
        )}

        {showDeleteEmployee && (
          <DeleteEmployee
            currentEmployeeId={currentEmployeeId}
            setShowDeleteEmployee={setShowDeleteEmployee}
            fecthEmployees={fecthEmployees}
          />
        )}

        {showCreateEmployee && (
          <CreateEmployee
            setShowCreateEmployee={setShowCreateEmployee}
            fecthEmployees={fecthEmployees}
          />
        )}
      </section>

      {showBlur && <div className={style.blur}></div>}
    </main>
  )
}
