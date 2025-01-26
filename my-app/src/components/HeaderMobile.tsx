import { HiMenu } from 'react-icons/hi'
import style from '../assets/styles/dashboard.module.css'

interface HeaderMobileProps {
  setShowAsideMobile: (show: boolean) => void
}

export default function HeaderMobile({
  setShowAsideMobile,
}: HeaderMobileProps) {
  return (
    <header className={style.headerMobile}>
      <HiMenu
        className={style.liSvgMobile}
        onClick={() => setShowAsideMobile(true)}
      />
    </header>
  )
}
