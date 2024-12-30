"use client"
import ReactDom from "react-dom"

export function PreloadedResourses() {
  ReactDom.preload("/icons/sprite.svg", { as: "image" })
  return null
}

export default PreloadedResourses
