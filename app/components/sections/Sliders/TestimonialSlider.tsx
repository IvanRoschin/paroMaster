'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { IoIosArrowDropleft, IoIosArrowDropright } from 'react-icons/io';

import { Button } from '@/components';
import { ITestimonial } from '@/types';

interface TestimonialSliderProps {
  testimonials: ITestimonial[];
}

const TestimonialSlider: React.FC<TestimonialSliderProps> = ({
  testimonials,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const clickNext = useCallback(() => {
    setActiveIndex(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
  }, [testimonials.length]);

  const clickPrev = useCallback(() => {
    setActiveIndex(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
  }, [testimonials.length]);

  useEffect(() => {
    const timer = setTimeout(clickNext, 5000);
    return () => clearTimeout(timer);
  }, [activeIndex, clickNext]);

  if (!testimonials || testimonials.length === 0) return <div>Нет отзывов</div>;

  const currentTestimonial = testimonials[activeIndex];

  return (
    <section className="my-10 px-4 max-w-7xl mx-auto">
      <h2 className="subtitle-main">Відгуки клієнтів</h2>
      <div className="relative max-w-3xl mx-auto mt-12 p-6 bg-white rounded-2xl shadow-lg flex flex-col items-center gap-4">
        <div className="flex items-center w-full justify-between">
          <Button
            type="button"
            icon={IoIosArrowDropleft}
            small
            outline
            onClick={clickPrev}
          />
          <div className="flex-1 mx-4 text-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentTestimonial._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="italic text-gray-700 text-lg"
              >
                {currentTestimonial.text}
              </motion.p>
            </AnimatePresence>
            <div className="mt-2 font-semibold text-sm text-gray-500">
              {currentTestimonial.author?.length
                ? currentTestimonial.author.join(' ')
                : 'Анонім'}
            </div>
          </div>
          <Button
            type="button"
            icon={IoIosArrowDropright}
            small
            outline
            onClick={clickNext}
          />
        </div>

        {/* Точки навигации */}
        <div className="flex gap-2 mt-4">
          {testimonials.map((_, idx) => (
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
    </section>
  );
};

export default TestimonialSlider;
