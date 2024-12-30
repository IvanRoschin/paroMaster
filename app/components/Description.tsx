import { motion } from "framer-motion"
// import left from '../public/left.svg'
// import right from '../public/right.svg'
import Link from "next/link"
// import { slides } from '../config/constants'
import { ISlider } from "@/types/index"
import { useSession } from "next-auth/react"
import { ReactNode } from "react"
import { FaPen } from "react-icons/fa"
import Button from "./Button"

type Props = {
  activeImage: number
  clickNext: () => void
  clickPrev: () => void
  slides: (ISlider | ReactNode)[]
}

const Description = ({ activeImage, clickNext, clickPrev, slides }: Props) => {
  const { data: session } = useSession()

  const isAdmin = session?.user

  const isISlider = (item: ISlider | ReactNode): item is ISlider =>
    typeof item === "object" && item !== null && "_id" in item

  return (
    <div className="grid place-items-start w-full bg-white relative md:rounded-tr-3xl md:rounded-br-3xl">
      <div className="uppercase text-sm absolute right-4 top-2 underline-offset-4 underline"></div>
      {slides &&
        slides.map((elem, idx) => (
          <div key={idx}>
            {isISlider(elem) && isAdmin && (
              <Link
                href={`/admin/slider/${elem?._id}`}
                className="absolute top-0 right-0 flex items-center justify-center"
              >
                <span className="cursor-pointer w-[30px] h-[30px] rounded-full bg-orange-600 flex justify-center items-center hover:opacity-80">
                  <FaPen size={12} color="white" />
                </span>
              </Link>
            )}
            <div
              key={idx}
              className={`${
                idx === activeImage ? "block w-full  py-10 md:px-20 px-10 text-left" : "hidden"
              }`}
            >
              <motion.div
                initial={{
                  opacity: idx === activeImage ? 0 : 0.5,
                  scale: idx === activeImage ? 0.5 : 0.3
                }}
                animate={{
                  opacity: idx === activeImage ? 1 : 0.5,
                  scale: idx === activeImage ? 1 : 0.3
                }}
                transition={{
                  ease: "linear",
                  duration: 2,
                  x: { duration: 1 }
                }}
                className="w-full relative"
              >
                {/* @ts-ignore */}
                <div className="py-16 text-5xl font-extrabold">{(elem as ISlider).title}</div>
                {/* @ts-ignore */}
                <div className="leading-relaxed font-medium text-base tracking-wide h-60 md:h-40 italic text-gray-600">
                  {(elem as ISlider).desc}
                </div>
                <div className="absolute bottom-0 left-20">
                  <Link
                    href="/#footer"
                    className="flex items-center justify-center p-2  focus:outline-none group-hover:bg-primaryAccentColor group-hover:text-secondaryBackground scroll-smooth"
                  >
                    <Button type={"button"} label="Замовити" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        ))}
    </div>
  )
}

export default Description
