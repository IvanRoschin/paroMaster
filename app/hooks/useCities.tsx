import { useEffect, useState } from "react"
import { toast } from "sonner"

export const useCities = (cityQuery: string) => {
  const [allCities, setCities] = useState<{ Ref: string; Description: string }[]>([])
  const [isCitiesLoading, setIsCitiesLoading] = useState(false)

  useEffect(() => {
    const fetchCities = async () => {
      if (!cityQuery.trim()) return
      try {
        setIsCitiesLoading(true)
        const response = await fetch("/api/cities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            city: cityQuery // Передаємо динамічне значення
          })
        })
        const result = await response.json()

        if (!result.success) throw new Error(result.message || "Failed to fetch cities")

        setCities(result.data || [])
      } catch (error) {
        console.error("Failed to fetch cities:", error)
        toast.error("Не вдалося завантажити міста")
        setCities([])
      } finally {
        setIsCitiesLoading(false)
      }
    }

    // Дебаунс для пошуку
    const debounceTimer = setTimeout(() => {
      fetchCities()
    }, 400)

    return () => clearTimeout(debounceTimer)
  }, [cityQuery])

  return { allCities, isCitiesLoading }
}
