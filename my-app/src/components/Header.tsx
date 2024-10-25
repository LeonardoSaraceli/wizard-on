import Image from 'next/image'
import wizardIcon from '../assets/images/wizard-icon.png'
import style from '../assets/styles/dashboard.module.css'

export default function Header() {
  return (
    <header className={style.header}>
      <Image
        src={wizardIcon}
        alt="Wizard icon"
        className={style.img}
        priority
      />
    </header>
  )
}
