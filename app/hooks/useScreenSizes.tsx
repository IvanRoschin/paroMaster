import { useEffect, useState } from "react"

export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: 0,
    height: 0
  })

  useEffect(() => {
    // Check if the code is running on the client side
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setScreenSize({
          width: window.innerWidth,
          height: window.innerHeight
        })
      }

      // Set initial screen size
      handleResize()

      // Add event listener for window resize
      window.addEventListener("resize", handleResize)

      // Cleanup event listener on component unmount
      return () => {
        window.removeEventListener("resize", handleResize)
      }
    }
  }, [])

  return screenSize
}
