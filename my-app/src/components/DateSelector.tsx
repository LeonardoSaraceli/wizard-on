import style from '../assets/styles/dashboard.module.css'
import { ChangeEvent } from 'react'

interface DateSelectorProps {
  startDate: { day: number; month: number; year: number }
  endDate: { day: number; month: number; year: number }
  handleChange: (change: ChangeEvent<HTMLInputElement>) => void
  date: Date
  setOpenDateSelector: (open: boolean) => void
  setDateText: (text: string) => void
  top: number
  setQuery: (query: any) => void
}

export default function DateSelector({
  startDate,
  endDate,
  handleChange,
  date,
  setOpenDateSelector,
  setDateText,
  top,
  setQuery,
}: DateSelectorProps) {
  const yesterday = new Date(date)
  yesterday.setDate(date.getDate() - 1)

  const dayOfWeek = date.getDay()
  const distanceToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  const startOfWeek = new Date(date)
  startOfWeek.setDate(date.getDate() - distanceToMonday)

  return (
    <div
      className={style.selectDate}
      style={top ? { top: `${top}rem` } : undefined}
    >
      <ul className={style.selectDateUl}>
        <li
          onClick={() => {
            const newStartDate = {
              day: date.getDate(),
              month: date.getMonth() + 1,
              year: date.getFullYear(),
            }
            const newEndDate = {
              day: date.getDate() + 1,
              month: date.getMonth() + 1,
              year: date.getFullYear(),
            }

            setQuery({ startDate: newStartDate, endDate: newEndDate })
            setDateText('Hoje')
            setOpenDateSelector(false)
          }}
          className={style.selectDateLi}
        >
          <span>Hoje</span>
        </li>

        <li
          onClick={() => {
            const newStartDate = {
              day: yesterday.getDate(),
              month: yesterday.getMonth() + 1,
              year: yesterday.getFullYear(),
            }
            const newEndDate = {
              day: yesterday.getDate() + 1,
              month: yesterday.getMonth() + 1,
              year: yesterday.getFullYear(),
            }

            setQuery({ startDate: newStartDate, endDate: newEndDate })
            setDateText('Ontem')
            setOpenDateSelector(false)
          }}
          className={style.selectDateLi}
        >
          <span>Ontem</span>
        </li>

        <li
          onClick={() => {
            const newStartDate = {
              day: startOfWeek.getDate(),
              month: startOfWeek.getMonth() + 1,
              year: startOfWeek.getFullYear(),
            }
            const newEndDate = {
              day: date.getDate() + 1,
              month: date.getMonth() + 1,
              year: date.getFullYear(),
            }

            setQuery({ startDate: newStartDate, endDate: newEndDate })
            setDateText('Esta semana')
            setOpenDateSelector(false)
          }}
          className={style.selectDateLi}
        >
          <span>Esta semana</span>
        </li>

        <li
          onClick={() => {
            const newStartDate = {
              day: 1,
              month: date.getMonth() + 1,
              year: date.getFullYear(),
            }
            const newEndDate = {
              day: date.getDate() + 1,
              month: date.getMonth() + 1,
              year: date.getFullYear(),
            }

            setQuery({ startDate: newStartDate, endDate: newEndDate })
            setDateText('Este mês')
            setOpenDateSelector(false)
          }}
          className={style.selectDateLi}
        >
          <span>Este mês</span>
        </li>

        <li
          onClick={() => {
            const newStartDate = { day: 1, month: 1, year: date.getFullYear() }
            const newEndDate = {
              day: date.getDate() + 1,
              month: date.getMonth() + 1,
              year: date.getFullYear(),
            }

            setQuery({ startDate: newStartDate, endDate: newEndDate })
            setDateText('Este ano')
            setOpenDateSelector(false)
          }}
          className={style.selectDateLi}
        >
          <span>Este ano</span>
        </li>
      </ul>

      <div className={style.selectDateBreak}></div>

      <div className={style.selectDateMain}>
        <div className={style.selectDateMainDiv}>
          <div className={style.selectDateMainInput}>
            <span className={style.selectDateMainInputSpan}>De</span>

            <ul className={style.selectDateMainInputUl}>
              <li className={style.selectDateMainInputLi}>
                <input
                  type="number"
                  placeholder="DD"
                  className={style.selectDateMainInputNum}
                  name="startDate.day"
                  value={startDate.day}
                  onChange={handleChange}
                  min={1}
                  max={31}
                  minLength={1}
                  maxLength={2}
                />
              </li>

              <li className={style.selectDateMainInputLi}>
                <input
                  type="number"
                  placeholder="MM"
                  className={style.selectDateMainInputNum}
                  name="startDate.month"
                  value={startDate.month}
                  onChange={handleChange}
                  min={1}
                  max={12}
                  minLength={1}
                  maxLength={2}
                />
              </li>

              <li className={style.selectDateMainInputLi}>
                <input
                  type="number"
                  placeholder="YY"
                  className={style.selectDateMainInputNum}
                  name="startDate.year"
                  value={startDate.year}
                  onChange={handleChange}
                  min={2024}
                  max={date.getFullYear()}
                  minLength={4}
                  maxLength={4}
                />
              </li>
            </ul>
          </div>

          <div className={style.selectDateMainInput}>
            <span className={style.selectDateMainInputSpan}>Até</span>

            <ul className={style.selectDateMainInputUl}>
              <li className={style.selectDateMainInputLi}>
                <input
                  type="number"
                  placeholder="DD"
                  className={style.selectDateMainInputNum}
                  name="endDate.day"
                  value={endDate.day}
                  onChange={handleChange}
                  min={1}
                  max={31}
                  minLength={1}
                  maxLength={2}
                />
              </li>

              <li className={style.selectDateMainInputLi}>
                <input
                  type="number"
                  placeholder="MM"
                  className={style.selectDateMainInputNum}
                  name="endDate.month"
                  value={endDate.month}
                  onChange={handleChange}
                  min={1}
                  max={12}
                  minLength={1}
                  maxLength={2}
                />
              </li>

              <li className={style.selectDateMainInputLi}>
                <input
                  type="number"
                  placeholder="YY"
                  className={style.selectDateMainInputNum}
                  name="endDate.year"
                  value={endDate.year}
                  onChange={handleChange}
                  min={2024}
                  max={date.getFullYear()}
                  minLength={4}
                  maxLength={4}
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
