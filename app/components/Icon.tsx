import { type IconName } from "@/types/name"
import { type SVGProps } from "react"

export { IconName }

/**
 * Renders an SVG icon. The icon defaults to the size of the font. To make it
 * align vertically with neighboring text, you can pass the text as a child of
 * the icon and it will be automatically aligned.
 * Alternatively, if you're not ok with the icon being to the left of the text,
 * you need to wrap the icon and text in a common parent and set the parent to
 * display "flex" (or "inline-flex") with "items-center" and a reasonable gap.
 */
export function Icon({
  name,
  childClassName,
  className,
  children,
  ...props
}: SVGProps<SVGSVGElement> & {
  name: string
  childClassName?: string
}) {
  if (children) {
    return (
      <span className={childClassName}>
        <Icon name={name} className={className} {...props} />
        {children}
      </span>
    )
  }
  return (
    <svg {...props} className={className}>
      <use href={`${process.env.PUBLIC_URL}/icons/sprite.svg#${name}`} />
    </svg>
  )
}
