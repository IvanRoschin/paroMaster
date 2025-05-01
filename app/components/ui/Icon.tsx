import { type IconName } from "@/types/name"
import { type SVGProps } from "react"

export { IconName }

const Icon = ({
  name,
  childClassName,
  className,
  children,
  ...props
}: SVGProps<SVGSVGElement> & {
  name: string
  childClassName?: string
}) => {
  const baseUrl = process.env.BASE_URL || ""

  const svgElement = (
    <svg {...props} className={className}>
      <use href={`${baseUrl}/icons/sprite.svg#${name}`} />
    </svg>
  )

  if (children) {
    return (
      <span className={childClassName}>
        {svgElement}
        {children}
      </span>
    )
  }

  return svgElement
}

export default Icon
