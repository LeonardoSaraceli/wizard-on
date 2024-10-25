import { LuLayoutGrid } from 'react-icons/lu'
import { BsPeople } from 'react-icons/bs'
import { IoFunnelOutline } from 'react-icons/io5'
import { HiMenu } from 'react-icons/hi'
import { FaArrowRightLong } from 'react-icons/fa6'
import { RiBuilding3Line } from 'react-icons/ri'
import { IoPower } from 'react-icons/io5'
import style from '../assets/styles/dashboard.module.css'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Aside() {
  const router = useRouter()
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])

  return (
    <aside className={style.aside}>
      <div className={style.menu}>
        <div className={style.menuName}>
          <HiMenu className={style.liSvg} />

          <span className={style.menuSpan}>Menu</span>
        </div>

        <FaArrowRightLong className={style.arrow} />
      </div>

      <ul className={style.menuNav}>
        <li className={style.li} onClick={() => router.push('/dashboard')}>
          <LuLayoutGrid className={style.liSvg} />

          <span
            className={style.liSpan}
            style={
              currentUrl.includes('dashboard')
                ? { fontWeight: 'bold' }
                : undefined
            }
          >
            Dashboard
          </span>
        </li>

        <li className={style.li} onClick={() => router.push('/equipe')}>
          <BsPeople className={style.liSvg} />

          <span
            className={style.liSpan}
            style={
              currentUrl.includes('equipe') ? { fontWeight: 'bold' } : undefined
            }
          >
            Equipe
          </span>
        </li>

        <li className={style.li} onClick={() => router.push('/leads')}>
          <IoFunnelOutline className={style.liSvg} />

          <span
            className={style.liSpan}
            style={
              currentUrl.includes('leads') ? { fontWeight: 'bold' } : undefined
            }
          >
            Leads
          </span>
        </li>
      </ul>

      <ul className={style.ul}>
        <li className={style.li}>
          <RiBuilding3Line className={style.liSvg} />

          <span className={style.liSpan}>Perfil</span>
        </li>

        <li className={style.li}>
          <IoPower className={style.liSvg} />

          <span className={style.liSpan}>Sair</span>
        </li>
      </ul>
    </aside>
  )
}
