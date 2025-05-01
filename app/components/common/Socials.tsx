import Link from "next/link"

import { Icon } from "@/components/ui"

interface SocialsProps {
  color?: string
}

const Socials: React.FC<SocialsProps> = ({ color }) => {
  const phone = process.env.NEXT_PUBLIC_ADMIN_PHONE
  const email = process.env.NEXT_PUBLIC_ADMIN_EMAIL

  if (!phone || !email) {
    console.error("Missing required environment variables: ADMIN_PHONE or ADMIN_EMAIL")
    return null
  }

  const textColor = color ? "text-white" : "text-black"

  return (
    <ul>
      <li>
        <Link
          href={`tel:${phone}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-start ${textColor}`}
        >
          <Icon name="lucide/phone" className={`w-5 h-5 mr-3 ${textColor}`} />
          <span className={`nav font-semibold ${textColor}`}>{phone}</span>
        </Link>
      </li>
      <li>
        <Link
          href={`mailto:${email}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-start ${textColor}`}
        >
          <Icon name="lucide/email" className={`w-5 h-5 mr-3 ${textColor}`} />
          <span className={`nav font-semibold ${textColor}`}>{email}</span>
        </Link>
      </li>
    </ul>
  )
}

export default Socials
