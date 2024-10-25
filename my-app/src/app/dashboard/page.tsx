'use client'

import { FaRegCalendarAlt } from 'react-icons/fa'
import { IoIosArrowDown } from 'react-icons/io'
import style from '../../assets/styles/dashboard.module.css'
import DateSelector from '@/components/DateSelector'
import { ChangeEvent, useEffect, useState } from 'react'
import LocationSelector from '@/components/LocationSelector'
import { useRouter } from 'next/navigation'
import Aside from '@/components/Aside'
import Header from '@/components/Header'

interface Lead {
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

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_URL}/api/lead`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          const newCities = data.leads.reduce((acc: string[], lead: Lead) => {
            const city = lead.city.trim()
            if (!acc.includes(city)) {
              acc.push(city)
            }
            return acc
          }, [])
          setCities(newCities)
        }
      })
  }, [])

  const date = new Date()

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
  }, [query.endDate, location, query.startDate, router])

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
  const medianEnrolled = enrolled > 0 ? leads?.length / enrolled : 0
  const enrolledBasedOnGoal = (enrolled / meta) * 100
  const gap = enrolled - meta

  return (
    <main className={style.main}>
      <Aside />

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
                  {isFinite(medianEnrolled) ? medianEnrolled.toFixed(2) : 0}%
                </h1>
              </li>

              <li className={style.dashboardDataLi}>
                <span className={style.dateInputDivSpan}>
                  Realizado da meta
                </span>

                <h1 className={style.data}>
                  {isFinite(enrolledBasedOnGoal)
                    ? enrolledBasedOnGoal.toFixed(2)
                    : 0}
                  %
                </h1>
              </li>

              <li className={style.dashboardDataLi}>
                <span className={style.dateInputDivSpan}>Gap</span>

                <h1 className={style.data}>{gap}</h1>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}
