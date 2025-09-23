import { Geist, Geist_Mono } from "next/font/google"
import localFont from "next/font/local"

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
})

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
})

export const eUkrainehead = localFont({
  src: "./e-ukrainehead-regular_w.woff",
  variable: "--font-eukrainehead",
  weight: "100 900"
})
export const eUkraine = localFont({
  src: "./e-ukraine-regular.woff",
  variable: "--font-eukraine",
  weight: "100 900"
})
export const manrope = localFont({
  src: "./Manrope-Regular.woff",
  variable: "--font-manrope",
  weight: "100 900"
})
