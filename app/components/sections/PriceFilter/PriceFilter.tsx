"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import "./PriceFilter.css"

interface PriceFilterProps {
  currencySymbol?: string
  minPrice: number
  maxPrice: number
}

const PriceFilter: React.FC<PriceFilterProps> = ({ currencySymbol = "₴", minPrice, maxPrice }) => {
  const [values, setValues] = useState<string[]>([
    minPrice.toString() || "0",
    maxPrice.toString() || "100"
  ])

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { push } = useRouter()

  const createQueryString = useCallback(
    (low: string, high: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (low) {
        params.set("low", low)
      } else {
        params.delete("low")
      }
      if (high) {
        params.set("high", high)
      } else {
        params.delete("high")
      }
      return params.toString()
    },
    [searchParams]
  )

  const handleRangeChange = (type: "min" | "max", value: string) => {
    const newValue = parseInt(value.replace(/\D/g, ""), 10) || 0
    if (type === "min") {
      setValues([Math.min(newValue, parseInt(values[1])).toString(), values[1]])
    } else {
      setValues([values[0], Math.max(parseInt(values[0]), newValue).toString()])
    }
  }

  useEffect(() => {
    if (minPrice !== null && maxPrice !== null) {
      setValues([minPrice.toString(), maxPrice.toString()])
    }
  }, [minPrice, maxPrice])

  // Когда значение в "до" меняется, обновляем "от" автоматически
  const handleMaxChange = (value: string) => {
    const newMax = parseInt(value.replace(/\D/g, ""), 10) || 0
    setValues([values[0], newMax.toString()])
  }

  useEffect(() => {
    if (values) {
      const handleClick = (low: string, high: string) => {
        const queryString = createQueryString(low, high)
        push(pathname + "?" + queryString, { scroll: false })
      }
      handleClick(values[0], values[1])
    }
  }, [values, createQueryString, pathname, push])

  return (
    <div className="double-slider-box">
      <h2 className="subtitle-main">Фільтр за ціною</h2>
      <div className="range-slider">
        <span className="slider-track"></span>
        <input
          type="range"
          name="min_val"
          className="min-val"
          min={minPrice || 0}
          max={maxPrice || 100}
          value={values[0]}
          onChange={e => handleRangeChange("min", e.target.value)}
        />
        <input
          type="range"
          name="max_val"
          className="max-val"
          min={minPrice || 0}
          max={maxPrice || 100}
          value={values[1]}
          onChange={e => handleRangeChange("max", e.target.value)}
        />
        <div className="tooltip min-tooltip">
          {values[0]} {currencySymbol}
        </div>
        <div className="tooltip max-tooltip">
          {values[1]} {currencySymbol}
        </div>
      </div>
      <div className="input-box">
        <div className="min-box">
          <div className="input-wrap">
            <span className="input-addon">від</span>
            <input
              type="text"
              name="min_input"
              className="input-field"
              value={values[0]}
              onChange={e => handleRangeChange("min", e.target.value)}
            />
          </div>
        </div>
        <div className="max-box">
          <div className="input-wrap">
            <span className="input-addon">до</span>
            <input
              type="text"
              name="max_input"
              className="input-field"
              value={values[1]}
              onChange={e => handleMaxChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PriceFilter
