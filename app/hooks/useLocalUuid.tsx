"use client"

import { create } from "zustand"

interface UuidKeyStore {
  uuidKey: string
  setKey: (key: string) => void
}

const useLocalUuid = create<UuidKeyStore>(set => ({
  uuidKey: "",
  setKey: (key: string) => set({ uuidKey: key })
}))

export default useLocalUuid
