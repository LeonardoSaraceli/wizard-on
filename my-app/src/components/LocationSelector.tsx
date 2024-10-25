import { FaMagnifyingGlass } from 'react-icons/fa6'
import style from '../assets/styles/dashboard.module.css'
import { useState } from 'react'

interface LocationSelectorProps {
  cities: string[]
  setLocation: (location: string) => void
  setOpenLocationSelector: (open: boolean) => void
}

export default function LocationSelector({
  cities,
  setLocation,
  setOpenLocationSelector,
}: LocationSelectorProps) {
  const [search, setSearch] = useState('')

  const searchQuery = cities?.filter((city: string) =>
    city?.trim().toLowerCase().includes(search.trim().toLowerCase())
  )

  return (
    <div className={style.locationSelector}>
      <div className={style.locationSelectorDiv}>
        <FaMagnifyingGlass className={style.inputSvg} />

        <input
          type="search"
          placeholder="Pesquisar"
          className={style.locationSelectorInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={style.locationSelectorBreak}></div>

      <div className={style.locationSelectorData}>
        <span
          className={style.locationSelectorDataSpan}
          onClick={() => [setLocation(''), setOpenLocationSelector(false)]}
        >
          Todas
        </span>

        {searchQuery.map((city: string) => (
          <span
            className={style.locationSelectorDataSpan}
            onClick={() => [setLocation(city), setOpenLocationSelector(false)]}
            key={city}
          >
            {city}
          </span>
        ))}
      </div>
    </div>
  )
}
