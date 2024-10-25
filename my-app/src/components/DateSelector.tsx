import style from '../assets/styles/dashboard.module.css'
import { ChangeEvent } from 'react'

interface DateSelectorProps {
  startDate: { day: number; month: number; year: number }
  endDate: { day: number; month: number; year: number }
  handleChange: (change: ChangeEvent<HTMLInputElement>) => void
  date: Date
  setOpenDateSelector: (open: boolean) => void
  setDateText: (text: string) => void
}

export default function DateSelector({
  startDate,
  endDate,
  handleChange,
  date,
  setOpenDateSelector,
  setDateText,
}: DateSelectorProps) {
  const yesterday = new Date(date)
  yesterday.setDate(date.getDate() - 1)

  const dayOfWeek = date.getDay()
  const distanceToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  const startOfWeek = new Date(date)
  startOfWeek.setDate(date.getDate() - distanceToMonday)

  return (
    <div className={style.selectDate}>
      <ul className={style.selectDateUl}>
        <li
          onClick={() => [
            (startDate.day = date.getDate()),
            (startDate.month = date.getMonth() + 1),
            (startDate.year = date.getFullYear()),
            (endDate.day = date.getDate() + 1),
            (endDate.month = date.getMonth() + 1),
            (endDate.year = date.getFullYear()),
            setDateText('Hoje'),
            setOpenDateSelector(false),
          ]}
          className={style.selectDateLi}
        >
          <span>Hoje</span>
        </li>

        <li
          onClick={() => [
            (startDate.day = yesterday.getDate()),
            (startDate.month = yesterday.getMonth() + 1),
            (startDate.year = yesterday.getFullYear()),
            (endDate.day = yesterday.getDate() + 1),
            (endDate.month = yesterday.getMonth() + 1),
            (endDate.year = yesterday.getFullYear()),
            setDateText('Ontem'),
            setOpenDateSelector(false),
          ]}
          className={style.selectDateLi}
        >
          <span>Ontem</span>
        </li>

        <li
          onClick={() => [
            (startDate.day = startOfWeek.getDate()),
            (startDate.month = startOfWeek.getMonth() + 1),
            (startDate.year = startOfWeek.getFullYear()),
            (endDate.day = date.getDate() + 1),
            (endDate.month = date.getMonth() + 1),
            (endDate.year = date.getFullYear()),
            setDateText('Esta semana'),
            setOpenDateSelector(false),
          ]}
          className={style.selectDateLi}
        >
          <span>Esta semana</span>
        </li>

        <li
          onClick={() => [
            (startDate.day = 1),
            (startDate.month = date.getMonth() + 1),
            (startDate.year = date.getFullYear()),
            (endDate.day = date.getDate() + 1),
            (endDate.month = date.getMonth() + 1),
            (endDate.year = date.getFullYear()),
            setDateText('Este mês'),
            setOpenDateSelector(false),
          ]}
          className={style.selectDateLi}
        >
          <span>Este mês</span>
        </li>

        <li
          onClick={() => [
            (startDate.day = 1),
            (startDate.month = 1),
            (startDate.year = date.getFullYear()),
            (endDate.day = date.getDate() + 1),
            (endDate.month = date.getMonth() + 1),
            (endDate.year = date.getFullYear()),
            setDateText('Este ano'),
            setOpenDateSelector(false),
          ]}
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
