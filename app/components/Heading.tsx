"use client"

interface HeadingProps {
  title: string
  subtitle: string
  center?: boolean
  category?: string
}

const Heading: React.FC<HeadingProps> = ({ title, subtitle, center, category }) => {
  return (
    <div className={center ? "text-center" : "text-start"}>
      <div className="text-2xl font-bold">{title}</div>
      {category && <div className="text-lg text-neutral-700 mt-1"> в категорії {category}</div>}
      <div className="font-light text-neutral-500 mt-2">{subtitle}</div>
    </div>
  )
}

export default Heading
