import { FaRegEye, FaRegCalendarAlt } from 'react-icons/fa'
import { FaMagnifyingGlass, FaPlus } from 'react-icons/fa6'
import { IoIosArrowDown } from 'react-icons/io'
import { FiEdit2 } from 'react-icons/fi'
import { RiDeleteBin7Line } from 'react-icons/ri'
import style from '../assets/styles/equipe.module.css'
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import DateSelector from './DateSelector'
import LocationSelector from './LocationSelector'
import EnrollSelector from './EnrollSelector'
import ViewLead from './ViewLead'
import EditLead from './EditLead'
import DeleteLead from './DeleteLead'

interface Employee {
  id: number
  name: string
  cpf: string
  role: string
}

interface Lead {
  id: string
  name: string
  location: string
  enroll: boolean
  interest: boolean
  city: string
}

interface Query {
  startDate: {
    day: number
    month: number
    year: number
  }
  endDate: {
    day: number
    month: number
    year: number
  }
}

interface ViewEmployeeProps {
  currentEmployeeId: number
  setShowViewEmployee: (show: boolean) => void
  employeeNameEllipsis: (name: string) => string
}

export default function ViewEmployee({
  currentEmployeeId,
  setShowViewEmployee,
  employeeNameEllipsis,
}: ViewEmployeeProps) {
  const date = useMemo(() => new Date(), [])

  const router = useRouter()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
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
  const [currentLeadId, setCurrentLeadId] = useState('')
  const [openViewLead, setOpenViewLead] = useState(false)
  const [openEditLead, setOpenEditLead] = useState(false)
  const [openDeleteLead, setOpenDeleteLead] = useState(false)
  const [blur, setBlur] = useState(false)

  useEffect(() => {
    if (openViewLead || openEditLead || openDeleteLead) {
      setBlur(true)
    } else {
      setBlur(false)
    }
  }, [openViewLead, openEditLead, openDeleteLead])

  const compareDates = (
    startDate: { day: number; month: number; year: number },
    endDate: { day: number; month: number; year: number },
    date: Date
  ) => {
    const formatDate = (d: { day: number; month: number; year: number }) =>
      `${d.day}/${d.month}/${d.year}`

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
    const [key, subKey] = name.split('.') as [
      keyof Query,
      keyof Query[keyof Query]
    ]

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

  const fetchLeads = useCallback(() => {
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
    fetchLeads()
  }, [fetchLeads])

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
              {employee ? employeeNameEllipsis(employee.name) : 'Loading...'}
            </p>
          </div>
        </div>

        <div className={style.viewEmployeeDataBreak}></div>

        <div className={style.viewEmployeeDataPersonalInfo}>
          <div className={style.viewEmployeeDataPersonalInfoDiv}>
            <span className={style.viewEmployeeDataDivNameDivSpan}>CPF</span>

            <p className={style.viewEmployeeDataDivNameDivP}>
              {employee ? employeeNameEllipsis(employee.cpf) : 'Loading...'}
            </p>
          </div>

          <div className={style.viewEmployeeDataDivNameDiv}>
            <span className={style.viewEmployeeDataDivNameDivSpan}>Função</span>

            <p className={style.viewEmployeeDataDivNameDivP}>
              {employee ? employeeNameEllipsis(employee.role) : 'Loading...'}
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
              top={0}
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

                <li
                  className={style.viewEmployeeLeadsListActionsLi}
                  onClick={() => [
                    setCurrentLeadId(lead.id),
                    setOpenViewLead(true),
                  ]}
                >
                  <FaRegEye className={style.funcionariosUlLiDivSvg} />
                </li>

                <li
                  className={style.viewEmployeeLeadsListActionsLi}
                  onClick={() => [
                    setCurrentLeadId(lead.id),
                    setOpenEditLead(true),
                  ]}
                >
                  <FiEdit2 className={style.funcionariosUlLiDivSvg} />
                </li>

                <li
                  className={style.viewEmployeeLeadsListActionsLi}
                  onClick={() => [
                    setCurrentLeadId(lead.id),
                    setOpenDeleteLead(true),
                  ]}
                >
                  <RiDeleteBin7Line className={style.funcionariosUlLiDivSvg} />
                </li>
              </ul>
            </li>
          ))}
        </ul>
      </div>

      {openViewLead && (
        <ViewLead
          currentLeadId={Number(currentLeadId)}
          setOpenViewLead={setOpenViewLead}
        />
      )}

      {openEditLead && (
        <EditLead
          currentLeadId={Number(currentLeadId)}
          setOpenEditLead={setOpenEditLead}
          fetchLeads={fetchLeads}
        />
      )}

      {openDeleteLead && (
        <DeleteLead
          currentLeadId={Number(currentLeadId)}
          setOpenDeleteLead={setOpenDeleteLead}
          fetchLeads={fetchLeads}
        />
      )}

      {blur && <div className={style.blur2}></div>}
    </div>
  )
}
