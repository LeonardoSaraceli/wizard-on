'use client'

import { FaRegCalendarAlt } from 'react-icons/fa'
import { IoIosArrowDown } from 'react-icons/io'
import style from '../../assets/styles/dashboard.module.css'
const DateSelector = dynamic(() => import('@/components/DateSelector'), {
  ssr: false,
})
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
const LocationSelector = dynamic(
  () => import('@/components/LocationSelector'),
  {
    ssr: false,
  }
)
import { useRouter } from 'next/navigation'
const Aside = dynamic(() => import('@/components/Aside'), {
  ssr: false,
})
import Header from '@/components/Header'
import dynamic from 'next/dynamic'
import HeaderMobile from '@/components/HeaderMobile'
import AsideMobile from '@/components/AsideMobile'

interface Lead {
  location: string
  city: string
  price: number | null
  enroll: boolean
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

export default function Dashboard() {
  const router = useRouter()

  const [openDateSelector, setOpenDateSelector] = useState(false)
  const [openLocationSelector, setOpenLocationSelector] = useState(false)
  const [cities, setCities] = useState<string[]>([])
  const [dateText, setDateText] = useState('Este mês')
  const [meta, setMeta] = useState(0)
  const [showAsideMobile, setShowAsideMobile] = useState(false)

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

  const date = useMemo(() => new Date(), [])

  const [query, setQuery] = useState<Query>({
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
  }, [query, date])

  const [location, setLocation] = useState('')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const [key, subKey] = name.split('.') as [
      keyof Query,
      keyof Query['startDate'] | keyof Query['endDate']
    ]

    setQuery({
      ...query,
      [key]: {
        ...query[key],
        [subKey]: value,
      },
    })
  }

  const [leads, setLeads] = useState<Lead[]>([])

  useEffect(() => {
    const token = localStorage.getItem('jwt')

    if (!token) {
      return
    }

    fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/lead?${
        query.startDate.day && query.startDate.month && query.startDate.year
          ? `startDate=${query.startDate.year}-${
              query.startDate.month > 9
                ? query.startDate.month
                : 0 + query.startDate.month
            }-${
              query.startDate.day > 9
                ? query.startDate.day
                : 0 + query.startDate.day
            }&`
          : ''
      }${
        query.endDate.day && query.endDate.month && query.endDate.year
          ? `endDate=${query.endDate.year}-${
              query.endDate.month > 9
                ? query.endDate.month
                : 0 + query.endDate.month
            }-${
              query.endDate.day > 9 ? query.endDate.day : 0 + query.endDate.day
            }&`
          : ''
      }${location ? `location=${location}` : ''}`,
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
          setLeads(data.leads)
        }
      })
  }, [query.endDate, location, query.startDate, router])

  const [nonQueriedLeads, setNonQueriedLeads] = useState<Lead[]>([])

  useEffect(() => {
    const token = localStorage.getItem('jwt')

    if (!token) {
      return
    }

    fetch(`${process.env.NEXT_PUBLIC_URL}/api/lead`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
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
          setNonQueriedLeads(data.leads)
        }
      })
  }, [router])

  useEffect(() => {
    const newCities: string[] = []

    nonQueriedLeads.forEach((lead) => {
      if (!newCities.includes(lead.location) && lead.location !== location) {
        newCities.push(lead.location)
      }
    })

    setCities(newCities)
  }, [location, nonQueriedLeads])

  const enrolled = leads?.filter((lead) => lead.enroll).length
  const prices = leads
    ?.map((lead) => lead.price)
    .filter((price) => price !== null && price !== undefined)

  prices?.sort((a, b) => a - b)

  const calculateMedianPrice = (arr: number[]) => {
    if (!arr || arr.length === 0) {
      return null
    }

    const mid = Math.floor(arr.length / 2)

    return arr.length % 2 !== 0
      ? Number(arr[mid])
      : Number(arr[mid - 1]) + Number(arr[mid] / 2)
  }

  const medianPrice = calculateMedianPrice(prices)
  const medianEnrolled = enrolled > 0 ? (enrolled / leads?.length) * 100 : 0
  const enrolledBasedOnGoal = (enrolled / meta) * 100
  const gap = enrolled - meta

  return (
    <main className={style.main}>
      <Aside />
      {isMobile && <HeaderMobile setShowAsideMobile={setShowAsideMobile} />}

      {showAsideMobile && (
        <AsideMobile setShowAsideMobile={setShowAsideMobile} />
      )}

      <section className={style.section}>
        <Header />

        <div className={style.mainDashboard}>
          <div className={style.dashboard}>
            <span className={style.dashboardSpan}>Painel de vendas</span>

            <ul className={style.dashboardInputs}>
              <li
                className={style.dateInput}
                onClick={() => setOpenDateSelector(!openDateSelector)}
              >
                <div className={style.dateInputDiv}>
                  <span className={style.dateInputDivSpan}>
                    Intervalo de dados
                  </span>

                  <div className={style.dateInputName}>
                    <FaRegCalendarAlt className={style.inputSvg} />

                    <span>{dateText}</span>
                  </div>
                </div>

                <IoIosArrowDown
                  className={style.inputSvg}
                  style={
                    openDateSelector
                      ? { transform: 'rotate(180deg)' }
                      : undefined
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
                  top={isMobile ? 16.8 : 20}
                  setQuery={setQuery}
                />
              )}

              <li
                className={style.dateInput}
                onClick={() => setOpenLocationSelector(!openLocationSelector)}
              >
                <div className={style.dateInputDiv}>
                  <span className={style.dateInputDivSpan}>Localidade</span>

                  <span style={{ fontWeight: 500 }}>
                    {!location ? 'Todas' : location}
                  </span>
                </div>

                <IoIosArrowDown
                  className={style.inputSvg}
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
                  top={isMobile ? 21.8 : 20}
                  right={
                    isMobile
                      ? 'unset'
                      : localStorage.getItem('closedAside') === 'false'
                      ? 31.8
                      : 34.8
                  }
                />
              )}

              <li className={style.metaInput}>
                <span className={style.dateInputDivSpan}>Meta</span>

                <input
                  type="number"
                  min={0}
                  className={style.metaInputNum}
                  value={meta}
                  onChange={(e) => setMeta(Number(e.target.value))}
                />
              </li>
            </ul>

            <ul className={style.dashboardData}>
              <li className={style.dashboardDataLi}>
                <span className={style.dateInputDivSpan}>Total de leads</span>

                <h1 className={style.data}>{leads?.length}</h1>
              </li>

              <li className={style.dashboardDataLi}>
                <span className={style.dateInputDivSpan}>
                  Total de matrículas
                </span>

                <h1 className={style.data}>{enrolled}</h1>
              </li>

              <li className={style.dashboardDataLi}>
                <span className={style.dateInputDivSpan}>
                  Média de contrato
                </span>

                <h1 className={style.data}>
                  R${(medianPrice ?? 0).toFixed(2)}
                </h1>
              </li>

              <li className={style.dashboardDataLi}>
                <span className={style.dateInputDivSpan}>
                  Taxa de conversão
                </span>

                <h1 className={style.data}>
                  {isFinite(medianEnrolled)
                    ? medianEnrolled.toFixed(2)
                    : '0.00'}
                  %
                </h1>
              </li>

              <li className={style.dashboardDataLi}>
                <span className={style.dateInputDivSpan}>
                  Realizado da meta
                </span>

                <h1 className={style.data}>
                  {isFinite(enrolledBasedOnGoal)
                    ? enrolledBasedOnGoal.toFixed(2)
                    : '0.00'}
                  %
                </h1>
              </li>

              <li className={style.dashboardDataLi}>
                <span className={style.dateInputDivSpan}>Gap</span>

                <h1 className={style.data}>{gap > 0 ? '+' + gap : gap}</h1>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}
