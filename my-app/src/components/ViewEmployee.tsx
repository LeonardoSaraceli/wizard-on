import { FaRegEye, FaRegCalendarAlt } from 'react-icons/fa'
import { FaMagnifyingGlass, FaPlus } from 'react-icons/fa6'
import { IoIosArrowDown } from 'react-icons/io'
import { FiEdit2 } from 'react-icons/fi'
import { RiDeleteBin7Line } from 'react-icons/ri'
import style from '../assets/styles/equipe.module.css'
import { ChangeEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DateSelector from './DateSelector'
import LocationSelector from './LocationSelector'
import EnrollSelector from './EnrollSelector'

export default function ViewEmployee({
  currentEmployeeId,
  setShowViewEmployee,
  employeeNameEllipsis,
}) {
  const date = new Date()

  const router = useRouter()
  const [employee, setEmployee] = useState([])
  const [leads, setLeads] = useState([])
  const [query, setQuery] = useState({
    startDate: {
      day: 1,
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    },
    endDate: {
      day: date.getDate() + 1,
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    },
  })
  const [openDateSelector, setOpenDateSelector] = useState(false)
  const [openLocationSelector, setOpenLocationSelector] = useState(false)
  const [openEnrollSelector, setOpenEnrollSelector] = useState(false)
  const [dateText, setDateText] = useState('')
  const [location, setLocation] = useState('')
  const [cities, setCities] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [enrollText, setEnrollText] = useState('')

  const compareDates = (startDate, endDate, date) => {
    const formatDate = (d) => `${d.day}/${d.month}/${d.year}`

    const today = {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    }

    const tomorrow = {
      day: date.getDate() + 1,
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    }

    const yesterday = {
      day: date.getDate() - 1,
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    }

    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay())
    const week = {
      day: startOfWeek.getDate() + 1,
      month: startOfWeek.getMonth() + 1,
      year: startOfWeek.getFullYear(),
    }

    const startOfMonth = {
      day: 1,
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    }

    const startOfYear = { day: 1, month: 1, year: date.getFullYear() }

    if (
      formatDate(startDate) === formatDate(today) &&
      formatDate(endDate) === formatDate(tomorrow)
    ) {
      return 'Hoje'
    } else if (
      formatDate(startDate) === formatDate(yesterday) &&
      formatDate(endDate) === formatDate(today)
    ) {
      return 'Ontem'
    } else if (
      formatDate(startDate) === formatDate(week) &&
      formatDate(endDate) === formatDate(tomorrow)
    ) {
      return 'Esta semana'
    } else if (
      formatDate(startDate) === formatDate(startOfMonth) &&
      formatDate(endDate) === formatDate(tomorrow)
    ) {
      return 'Este mês'
    } else if (
      formatDate(startDate) === formatDate(startOfYear) &&
      formatDate(endDate) === formatDate(tomorrow)
    ) {
      return 'Este ano'
    } else {
      return `${startDate.day}/${startDate.month}/${startDate.year} - ${endDate.day}/${endDate.month}/${endDate.year}`
    }
  }

  useEffect(() => {
    const text = compareDates(query.startDate, query.endDate, date)
    setDateText(text)
  }, [date, query])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const [key, subKey] = name.split('.')

    setQuery({
      ...query,
      [key]: {
        ...query[key],
        [subKey]: value,
      },
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
  }, [currentEmployeeId, router])

  useEffect(() => {
    fetch(
      `${
        process.env.NEXT_PUBLIC_URL
      }/api/employeeleads?employeeId=${currentEmployeeId}${
        query.startDate.day && query.startDate.month && query.startDate.year
          ? `&startDate=${query.startDate.year}-${query.startDate.month}-${query.startDate.day}`
          : ''
      }${
        query.endDate.day && query.endDate.month && query.endDate.year
          ? `&endDate=${query.endDate.year}-${query.endDate.month}-${query.endDate.day}`
          : ''
      }${location ? `&location=${location}` : ''}${
        enrollText && enrollText !== 'Indiferente'
          ? `&enroll=${enrollText === 'Sim' ? 'true' : 'false'}`
          : ''
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
          setLeads(data.leads)
        }
      })
  }, [
    query.startDate,
    query.endDate,
    router,
    enrollText,
    location,
    currentEmployeeId,
  ])

  useEffect(() => {
    const newCities: string[] = []

    leads.forEach((lead) => {
      if (!newCities.includes(lead.city)) {
        newCities.push(lead.city)
      }
    })

    setCities(newCities)
  }, [leads])

  const searchLeadsOutput = leads?.filter((lead) =>
    lead.name.trim().toLowerCase().includes(search.trim().toLowerCase())
  )

  return (
    <div className={style.viewEmployee}>
      <FaPlus
        className={style.viewEmployeeExit}
        onClick={() => setShowViewEmployee(false)}
      />

      <div className={style.viewEmployeeData}>
        <div className={style.viewEmployeeDataDiv}>
          <span className={style.viewEmployeeDataDivSpan}>Dados</span>

          <div className={style.viewEmployeeDataDivNameDiv}>
            <span className={style.viewEmployeeDataDivNameDivSpan}>Nome</span>

            <p className={style.viewEmployeeDataDivNameDivP}>
              {employeeNameEllipsis(employee.name)}
            </p>
          </div>
        </div>

        <div className={style.viewEmployeeDataBreak}></div>

        <div className={style.viewEmployeeDataPersonalInfo}>
          <div className={style.viewEmployeeDataPersonalInfoDiv}>
            <span className={style.viewEmployeeDataDivNameDivSpan}>CPF</span>

            <p className={style.viewEmployeeDataDivNameDivP}>
              {employeeNameEllipsis(employee.cpf)}3
            </p>
          </div>

          <div className={style.viewEmployeeDataDivNameDiv}>
            <span className={style.viewEmployeeDataDivNameDivSpan}>Função</span>

            <p className={style.viewEmployeeDataDivNameDivP}>
              {employeeNameEllipsis(employee.role)}
            </p>
          </div>
        </div>
      </div>

      <div className={style.viewEmployeeLeads}>
        <span className={style.viewEmployeeDataDivSpan}>Leads</span>

        <ul className={style.viewEmployeeLeadsUl}>
          <li
            className={style.viewEmployeeLeadsUlLi}
            onClick={() => setOpenDateSelector(!openDateSelector)}
          >
            <div className={style.viewEmployeeLeadsUlLiDiv}>
              <span className={style.viewEmployeeDataDivNameDivSpan}>
                Intervalo de dados
              </span>

              <div className={style.viewEmployeeLeadsUlLiDivInput}>
                <FaRegCalendarAlt
                  className={style.viewEmployeeLeadsUlLiDivInputSvg}
                />

                <span className={style.orderByFilterUlLiSpan}>{dateText}</span>
              </div>
            </div>

            <IoIosArrowDown
              className={style.viewEmployeeLeadsUlLiDivInputSvg}
              style={
                openDateSelector ? { transform: 'rotate(180deg)' } : undefined
              }
            />
          </li>

          {openDateSelector && (
            <DateSelector
              startDate={query.startDate}
              endDate={query.endDate}
              handleChange={handleChange}
              date={date}
              setOpenDateSelector={setOpenDateSelector}
              setDateText={setDateText}
              top={25}
              setQuery={setQuery}
            />
          )}

          <li
            className={style.viewEmployeeLeadsUlLi}
            onClick={() => setOpenLocationSelector(!openLocationSelector)}
          >
            <div className={style.viewEmployeeLeadsUlLiDiv}>
              <span className={style.viewEmployeeDataDivNameDivSpan}>
                Localidade
              </span>

              <span className={style.orderByFilterUlLiSpan}>
                {!location ? 'Todas' : location}
              </span>
            </div>

            <IoIosArrowDown
              className={style.viewEmployeeLeadsUlLiDivInputSvg}
              style={
                openLocationSelector
                  ? { transform: 'rotate(180deg)' }
                  : undefined
              }
            />
          </li>

          {openLocationSelector && (
            <LocationSelector
              cities={cities}
              setLocation={setLocation}
              setOpenLocationSelector={setOpenLocationSelector}
              top={25}
              right={12.4}
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

          <li
            className={style.viewEmployeeLeadsUlLi}
            onClick={() => setOpenEnrollSelector(!openEnrollSelector)}
          >
            <div className={style.viewEmployeeLeadsUlLiDiv}>
              <span className={style.viewEmployeeDataDivNameDivSpan}>
                Matriculado
              </span>

              <span className={style.orderByFilterUlLiSpan}>
                {enrollText ? enrollText : 'Indiferente'}
              </span>
            </div>

            <IoIosArrowDown
              className={style.viewEmployeeLeadsUlLiDivInputSvg}
              style={
                openEnrollSelector ? { transform: 'rotate(180deg)' } : undefined
              }
            />
          </li>

          {openEnrollSelector && (
            <EnrollSelector
              setEnrollText={setEnrollText}
              setOpenEnrollSelector={setOpenEnrollSelector}
            />
          )}
        </ul>

        <div className={style.viewEmployeeLeadsResults}>
          <span className={style.viewEmployeeDataDivNameDivSpan}>
            {searchLeadsOutput?.length !== 1
              ? searchLeadsOutput?.length + ' resultados'
              : searchLeadsOutput?.length + ' resultado'}
          </span>

          <ul className={style.viewEmployeeLeadsResultsUl}>
            <li className={style.viewEmployeeLeadsResultsUlLi}>
              <div className={style.viewEmployeeLeadsResultsUlLiDivGreen}></div>

              <span>Matriculado</span>
            </li>

            <li className={style.viewEmployeeLeadsResultsUlLi}>
              <div
                className={style.viewEmployeeLeadsResultsUlLiDivYellow}
              ></div>

              <span>Interessado</span>
            </li>

            <li className={style.viewEmployeeLeadsResultsUlLi}>
              <div className={style.viewEmployeeLeadsResultsUlLiDivRed}></div>

              <span>Não matriculado</span>
            </li>
          </ul>
        </div>

        <ul className={style.viewEmployeeLeadsList}>
          {searchLeadsOutput?.map((lead) => (
            <li key={lead.id} className={style.viewEmployeeLeadsListLi}>
              <h1 className={style.viewEmployeeLeadsListH1}>
                {employeeNameEllipsis(lead.name)}
              </h1>

              <ul className={style.viewEmployeeLeadsListActions}>
                <li className={style.viewEmployeeLeadsListActionsLi}>
                  <div
                    className={style.viewEmployeeLeadsListActionsEnroll}
                    style={
                      lead.enroll
                        ? { backgroundColor: '#9dcd5a' }
                        : lead.interest
                        ? { backgroundColor: '#ffff00' }
                        : { backgroundColor: '#e62331' }
                    }
                  ></div>
                </li>

                <li className={style.viewEmployeeLeadsListActionsLi}>
                  <FaRegEye className={style.funcionariosUlLiDivSvg} />
                </li>

                <li className={style.viewEmployeeLeadsListActionsLi}>
                  <FiEdit2 className={style.funcionariosUlLiDivSvg} />
                </li>

                <li className={style.viewEmployeeLeadsListActionsLi}>
                  <RiDeleteBin7Line className={style.funcionariosUlLiDivSvg} />
                </li>
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
