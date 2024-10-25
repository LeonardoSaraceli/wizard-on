import { GrAscend } from 'react-icons/gr'
import { GrDescend } from 'react-icons/gr'
import style from '../assets/styles/equipe.module.css'

export default function OrderByFilter({
  setOrder,
  setOpenOrderByFilter,
  setInputText,
}) {
  return (
    <div className={style.orderByFilter}>
      <ul className={style.orderByFilterUl}>
        <li
          className={style.orderByFilterUlLi}
          onClick={() => [
            setOrder('ASC'),
            setInputText('Ordem crescente'),
            setOpenOrderByFilter(false),
          ]}
        >
          <GrAscend />

          <span className={style.orderByFilterUlLiSpan}>Ordem crescente</span>
        </li>

        <li
          className={style.orderByFilterUlLi}
          onClick={() => [
            setOrder('DESC'),
            setInputText('Ordem decrescente'),
            setOpenOrderByFilter(false),
          ]}
        >
          <GrDescend />

          <span className={style.orderByFilterUlLiSpan}>Ordem decrescente</span>
        </li>
      </ul>
    </div>
  )
}
