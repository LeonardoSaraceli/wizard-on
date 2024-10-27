import style from '../assets/styles/equipe.module.css'

interface EnrollSelectorProps {
  setEnrollText: (show: string) => void
  setOpenEnrollSelector: (show: boolean) => void
  top: number
}

export default function EnrollSelector({
  setEnrollText,
  setOpenEnrollSelector,
  top,
}: EnrollSelectorProps) {
  return (
    <ul
      className={style.enrollSelector}
      style={top && top !== 0 ? { top: `${top}rem` } : undefined}
    >
      <li
        className={style.enrollSelectorLi}
        onClick={() => [setEnrollText('Sim'), setOpenEnrollSelector(false)]}
      >
        <span>Sim</span>
      </li>

      <li
        className={style.enrollSelectorLi}
        onClick={() => [setEnrollText('Não'), setOpenEnrollSelector(false)]}
      >
        <span>Não</span>
      </li>

      <li
        className={style.enrollSelectorLi}
        onClick={() => [
          setEnrollText('Indiferente'),
          setOpenEnrollSelector(false),
        ]}
      >
        <span>Indiferente</span>
      </li>
    </ul>
  )
}
