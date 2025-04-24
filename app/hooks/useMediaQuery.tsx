import { useEffect, useState } from "react"

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const media = window.matchMedia(query)
    const handleChange = () => setMatches(media.matches)

    handleChange() // set initial value
    media.addEventListener("change", handleChange)

    return () => media.removeEventListener("change", handleChange)
  }, [query])

  return matches
}
