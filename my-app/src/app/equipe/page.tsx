'use client'

import Aside from '@/components/Aside'
import style from '../../assets/styles/equipe.module.css'
import Header from '@/components/Header'
import { FaPlus } from 'react-icons/fa6'
import { HiMiniAdjustmentsHorizontal } from 'react-icons/hi2'
import { IoIosArrowDown } from 'react-icons/io'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { FaRegEye } from 'react-icons/fa'
import { FiEdit2 } from 'react-icons/fi'
import { RiDeleteBin7Line } from 'react-icons/ri'
import { useEffect, useState } from 'react'
import OrderByFilter from '@/components/OrderByFilter'
import { useRouter } from 'next/navigation'
import ViewEmployee from '@/components/ViewEmployee'

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

  useEffect(() => {
    if (showViewEmployee) {
      setShowBlur(true)
    } else {
      setShowBlur(false)
    }
  }, [showViewEmployee])

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/employee${
        order ? `?orderBy=${order}` : ''
      }`,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('jwt')}`,
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
  }, [order, router])

  const employeeNameEllipsis = (name: string) => {
    if (!name) {
      return
    }

    if (name.trim().length >= 30) {
      return name.trim().split('').slice(0, 27).join('') + '...'
    }

    return name.trim()
  }

  const searchEmployeeOutput = employees.filter((employee) =>
    employee.name.trim().toLowerCase().includes(search.trim().toLowerCase())
  )

  return (
    <main className={style.main}>
      <Aside />

      <section className={style.section}>
        <Header />

        <div className={style.equipe}>
          <div className={style.funcionarios}>
            <div className={style.funcionariosName}>
              <span className={style.funcionariosSpan}>Funcionários</span>

              <FaPlus className={style.funcionariosAdd} />
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

                    <FiEdit2 className={style.funcionariosUlLiDivSvg} />

                    <RiDeleteBin7Line
                      className={style.funcionariosUlLiDivSvg}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {showViewEmployee && (
          <ViewEmployee currentEmployeeId={currentEmployeeId} setShowViewEmployee={setShowViewEmployee} employeeNameEllipsis={employeeNameEllipsis} />
        )}
      </section>

      {showBlur && <div className={style.blur}></div>}
    </main>
  )
}
