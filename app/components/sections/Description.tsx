'use client';

import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ReactNode } from 'react';
import { FaPen } from 'react-icons/fa';

import { Button } from '@/components/index';
import { ISlider } from '@/types/index';

type Props = {
  activeImage: number;
  clickNext: () => void;
  clickPrev: () => void;
  slides: (ISlider | ReactNode)[];
};

const Description = ({ activeImage, clickNext, clickPrev, slides }: Props) => {
  const { data: session } = useSession();
  const isAdmin = Boolean(session?.user);

  // Type guard для ISlider
  const isISlider = (item: ISlider | ReactNode): item is ISlider =>
    typeof item === 'object' && item !== null && '_id' in item;

  return (
    <div className="grid place-items-start w-full bg-white relative md:rounded-tr-3xl md:rounded-br-3xl">
      {slides.map((elem, idx) => {
        if (!isISlider(elem)) return null;

        return (
          <div
            key={elem._id}
            className={
              idx === activeImage
                ? 'block w-full py-10 md:px-20 px-8 text-left'
                : 'hidden'
            }
          >
            {isAdmin && (
              <Link
                href={`/admin/slider/${elem._id}`}
                className="absolute top-2 right-4 z-10"
              >
                <span className="cursor-pointer w-8 h-8 rounded-full bg-orange-600 flex justify-center items-center hover:opacity-80">
                  <FaPen size={12} color="white" />
                </span>
              </Link>
            )}

            <div className="w-full flex flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ ease: 'linear', duration: 1.2 }}
              >
                <div className="text-4xl md:text-5xl font-extrabold leading-tight">
                  {elem.title}
                </div>
                <div className="font-medium text-base tracking-wide italic text-gray-600 whitespace-pre-wrap break-words">
                  {elem.desc}
                </div>
                <div className="my-4">
                  <Link href="/#footer" className="inline-block">
                    <Button type="button" label="Замовити" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Description;
