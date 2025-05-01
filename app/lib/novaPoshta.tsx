// lib/novaPoshta.ts
"use server"

import axios from "axios"

const novaPoshtaApi = axios.create({
  baseURL: "https://api.novaposhta.ua/v2.0/json/" // Общий базовый URL
})

export async function getData(body: any) {
  console.log("getData called with body:", body)
  try {
    const { data, status, config } = await novaPoshtaApi.post("", body)
    console.log("getData request URL:", config.url)
    if (status !== 200) {
      throw new Error(`Failed to fetch data: ${status}`)
    }
    return { success: true, data }
  } catch (error) {
    console.error("getData error:", error)
    return { success: false, error }
  }
}
