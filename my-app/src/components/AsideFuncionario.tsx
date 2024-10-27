import { IoFunnelOutline } from 'react-icons/io5'
import { HiMenu } from 'react-icons/hi'
import { FaArrowRightLong } from 'react-icons/fa6'
import { IoPower } from 'react-icons/io5'
import style from '../assets/styles/dashboard.module.css'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AsideFuncionario() {
  const router = useRouter()
  const [currentUrl, setCurrentUrl] = useState('')
  const [closedAside, setClosedAside] = useState(() => {
    const storedValue = localStorage.getItem('closedAside')
    return storedValue !== null ? storedValue === 'true' : false
  })

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
    router.push('/funcionario')
  }

  return (
    <>
      <aside className={style.aside}>
        <div
          className={style.menu}
          style={closedAside ? undefined : { gap: '2rem' }}
        >
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
          <li
            className={style.li}
            onClick={() => router.push('/funcionario/leads')}
          >
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
    </>
  )
}
