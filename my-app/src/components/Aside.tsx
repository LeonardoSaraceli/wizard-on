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
import EditCompany from './EditCompany'
import blur from '../assets/styles/equipe.module.css'

export default function Aside() {
  const router = useRouter()
  const [currentUrl, setCurrentUrl] = useState('')
  const [closedAside, setClosedAside] = useState(() => {
    const storedValue = localStorage.getItem('closedAside')
    return storedValue !== null ? storedValue === 'true' : false
  })
  const [showEditCompany, setShowEditCompany] = useState(false)
  const [showBlur, setShowBlur] = useState(false)

  useEffect(() => {
    if (showEditCompany) {
      setShowBlur(true)
    } else {
      setShowBlur(false)
    }
  }, [showEditCompany])

  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])

  useEffect(() => {
    if (closedAside) {
      localStorage.setItem('closedAside', 'true')
    } else {
      localStorage.setItem('closedAside', 'false')
    }
  }, [closedAside])

  const handleExit = () => {
    localStorage.clear()
    router.push('/')
  }

  return (
    <>
      <aside className={style.aside}>
        <div className={style.menu}>
          <div
            className={style.menuName}
            style={closedAside ? { display: 'none' } : undefined}
          >
            <HiMenu className={style.liSvg} />

            <span className={style.menuSpan}>Menu</span>
          </div>

          <FaArrowRightLong
            className={style.arrow}
            onClick={() => setClosedAside(!closedAside)}
            style={closedAside ? { transform: 'rotate(0deg)' } : undefined}
          />
        </div>

        <ul className={style.menuNav}>
          <li className={style.li} onClick={() => router.push('/dashboard')}>
            <LuLayoutGrid className={style.liSvg} />

            <span
              className={style.liSpan}
              style={
                closedAside
                  ? { display: 'none' }
                  : currentUrl.includes('dashboard')
                  ? {
                      fontWeight: 'bold',
                    }
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
                closedAside
                  ? { display: 'none' }
                  : currentUrl.includes('equipe')
                  ? {
                      fontWeight: 'bold',
                    }
                  : undefined
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
                closedAside
                  ? { display: 'none' }
                  : currentUrl.includes('leads')
                  ? {
                      fontWeight: 'bold',
                    }
                  : undefined
              }
            >
              Leads
            </span>
          </li>
        </ul>

        <ul className={style.ul}>
          <li
            className={style.li}
            onClick={() => setShowEditCompany(!showEditCompany)}
          >
            <RiBuilding3Line className={style.liSvg} />

            <span
              className={style.liSpan}
              style={closedAside ? { display: 'none' } : undefined}
            >
              Perfil
            </span>
          </li>

          <li className={style.li} onClick={() => handleExit()}>
            <IoPower className={style.liSvg} />

            <span
              className={style.liSpan}
              style={closedAside ? { display: 'none' } : undefined}
            >
              Sair
            </span>
          </li>
        </ul>
      </aside>

      {showEditCompany && (
        <EditCompany setShowEditCompany={setShowEditCompany} />
      )}

      {showBlur && <div className={blur.blur}></div>}
    </>
  )
}
