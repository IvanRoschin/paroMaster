'use client';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { FaPen, FaTrash } from 'react-icons/fa';

import { useSlideDelete } from '@/app/hooks/useDeleteSlide';
import { Button, NextImage } from '@/components';
import { ISlider } from '@/types';
import { UserRole } from '@/types/IUser';

interface BannerSliderProps {
  slides: ISlider[];
  role?: UserRole;
  refetch?: () => void;
}

const BannerSlider: React.FC<BannerSliderProps> = ({
  slides,
  role,
  refetch,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { slideToDelete, handleDelete, handleDeleteConfirm, deleteModal } =
    useSlideDelete(refetch);

  const clickNext = useCallback(() => {
    setActiveIndex(prev => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const clickPrev = useCallback(() => {
    setActiveIndex(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  useEffect(() => {
    const timer = setTimeout(clickNext, 5000);
    return () => clearTimeout(timer);
  }, [activeIndex, clickNext]);

  if (!slides || slides.length === 0) return <div>Нет баннеров</div>;

  const currentSlide = slides[activeIndex];

  return (
    <section className="hidden lg:block">
      <div className="relative w-full max-w-5xl mx-auto rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
        {/* Слайд */}
        <div className="relative w-full h-[50vh] md:h-[60vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide._id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full"
            >
              <NextImage
                useSkeleton
                src={currentSlide.src[0]}
                alt={currentSlide.title}
                className="w-full h-full object-cover md:rounded-l-2xl"
                width={800}
                height={600}
                priority
              />

              {/* Админ кнопки */}
              {role === UserRole.ADMIN && currentSlide._id && (
                <div className="absolute top-2 right-2 flex gap-1 z-50">
                  <Link href={`/admin/slides/${currentSlide._id}`}>
                    <Button
                      type="button"
                      icon={FaPen}
                      small
                      outline
                      color="border-yellow-400"
                    />
                  </Link>
                  <Button
                    type="button"
                    icon={FaTrash}
                    small
                    outline
                    color="border-red-400"
                    onClick={() =>
                      handleDelete(currentSlide._id!, currentSlide.title)
                    }
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Описание */}
        <div className="flex flex-col justify-center p-8 md:p-12 bg-white md:rounded-r-2xl">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            {currentSlide.title}
          </h2>
          <p className="text-gray-600 italic mb-6">{currentSlide.desc}</p>
          <Link href="/#footer">
            <Button type="button" label="Замовити" />
          </Link>

          {/* Точки навигации */}
          <div className="flex gap-2 mt-6">
            {slides.map((_, idx) => (
              <span
                key={idx}
                className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                  idx === activeIndex ? 'bg-orange-500' : 'bg-gray-300'
                }`}
                onClick={() => setActiveIndex(idx)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSlider;
