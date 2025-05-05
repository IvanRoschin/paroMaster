"use client"
import { useEffect, useState } from "react"

import WayForPayForm from "./WayForPayForm"

export const WayForPayWrapper = (props: any) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return <WayForPayForm {...props} />
}
