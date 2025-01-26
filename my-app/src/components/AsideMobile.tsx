import { FaPlus } from 'react-icons/fa6'
import { LuLayoutGrid } from 'react-icons/lu'
import { BsPeople } from 'react-icons/bs'
import { IoFunnelOutline } from 'react-icons/io5'
import { IoPower } from 'react-icons/io5'
import style from '../assets/styles/dashboard.module.css'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface AsideMobileProps {
  setShowAsideMobile: (show: boolean) => void
}

export default function AsideMobile({ setShowAsideMobile }: AsideMobileProps) {
  const router = useRouter()
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])

  const handleExit = () => {
    localStorage.clear()
    router.push(currentUrl.includes('funcionario') ? '/funcionario' : '/')
  }

  return (
    <aside className={style.asideMobile}>
      <FaPlus
        className={style.exitAsideMobile}
        onClick={() => setShowAsideMobile(false)}
      />

      <ul className={style.asideMobileNavUl}>
        {currentUrl.includes('funcionario') ? undefined : (
          <>
            <li
              className={style.asideMobileNavUlLi}
              onClick={() => router.push('/dashboard')}
            >
              <LuLayoutGrid />

              <span
                style={
                  currentUrl.includes('dashboard')
                    ? {
                        fontWeight: 'bold',
                      }
                    : undefined
                }
              >
                Dashboard
              </span>
            </li>

            <li
              className={style.asideMobileNavUlLi}
              onClick={() => router.push('/equipe')}
            >
              <BsPeople />

              <span
                style={
                  currentUrl.includes('equipe')
                    ? {
                        fontWeight: 'bold',
                      }
                    : undefined
                }
              >
                Equipe
              </span>
            </li>

            <li
              className={style.asideMobileNavUlLi}
              onClick={() => router.push('/leads')}
            >
              <IoFunnelOutline />

              <span
                style={
                  currentUrl.includes('leads')
                    ? {
                        fontWeight: 'bold',
                      }
                    : undefined
                }
              >
                Leads
              </span>
            </li>
          </>
        )}

        <li className={style.asideMobileNavUlLi} onClick={() => handleExit()}>
          <IoPower />

          <span>Sair</span>
        </li>
      </ul>
    </aside>
  )
}
