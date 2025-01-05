"use client"

import { useRouter } from "next/navigation"
import Button from "./Button"
import Heading from "./Heading"

interface EmptyStateProps {
  title?: string
  subtitle?: string
  showReset?: boolean
  category?: string
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Відсутні товари 🤷‍♂️",
  subtitle = "Спробуйте змінити фільтри ⚙️",
  showReset,
  category
}) => {
  const router = useRouter()
  return (
    <div
      className="
  h-[60vh]
  flex
  flex-col
  gap-2
  justify-center
  items-center
    "
    >
      <Heading center title={title} subtitle={subtitle} category={category} />
      <div className="w-48 mt-4">
        {showReset && (
          <Button type="button" outline label="Видалити фільтри" onClick={() => router.push("/")} />
        )}
      </div>
    </div>
  )
}

export default EmptyState
