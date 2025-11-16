'use client';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { IoIosArrowDropleft, IoIosArrowDropright } from 'react-icons/io';

import { IGetAllTestimonials } from '@/actions/testimonials';
import { IGetAllSlides } from '@/app/actions/slides';
import { EmptyState, Loader } from '@/components/common';
import { Testimonial } from '@/components/index';

interface SliderProps {
  DescriptionComponent?: any;
  testimonialsData?: IGetAllTestimonials;
  slidesData?: IGetAllSlides;
  testimonials?: boolean;
}

const Slider: React.FC<SliderProps> = ({
  DescriptionComponent,
  testimonials = false,
  slidesData,
  testimonialsData,
}) => {
  const [activeImage, setActiveImage] = useState(0);

  const slides = testimonials
    ? testimonialsData?.testimonials
    : slidesData?.slides;

  const clickNext = useCallback(() => {
    if (slides && slides.length > 0) {
      setActiveImage(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }
  }, [slides]);

  const clickPrev = useCallback(() => {
    if (slides && slides.length > 0) {
      setActiveImage(prev => (prev === 0 ? slides.length - 1 : prev - 1));
    }
  }, [slides]);

  useEffect(() => {
    if (slides && slides.length > 0) {
      const timer = setTimeout(() => {
        clickNext();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [activeImage, slides, clickNext]);

  if (!slides) {
    return <Loader />;
  }

  if (slides.length === 0) {
    return <EmptyState showReset title="Відсутні слайди" />;
  }

  return (
    <main
      className={`grid place-items-center mt-[65px] ${
        testimonials ? 'grid-cols-1' : 'grid-cols-2'
      } w-full mx-auto max-w-5xl shadow-2xl rounded-2xl mt-[40px] relative mb-20`}
    >
      <div className="w-full flex justify-center items-center gap-4 transition-transform ease-in-out duration-500 md:rounded-2xl p-6 md:p-0">
        {slides.map((slide: any, idx: number) => (
          <div
            key={idx}
            className={`${
              idx === activeImage
                ? 'block w-full h-full object-cover transition-all duration-500 ease-in-out items-center'
                : 'hidden'
            }`}
          >
            {testimonials ? (
              <Testimonial
                key={idx}
                id={slide._id}
                name={slide.name}
                text={slide.text}
                stars={slide.rating}
              />
            ) : (
              <Image
                src={slide.src[0]}
                alt={slide.title}
                width={400}
                height={400}
                className="w-full h-[80vh] object-cover md:rounded-tl-2xl md:rounded-bl-2xl"
                priority={true}
              />
            )}
          </div>
        ))}
      </div>

      <div className="absolute bottom-2 lg:bottom-10 right-10 lg:right-0 w-full flex justify-center items-center">
        <div
          className="absolute z-50 bottom-2 right-10 cursor-pointer"
          onClick={clickPrev}
        >
          <div className="swiper-button-prev ">
            <IoIosArrowDropleft />
          </div>
        </div>
        <div
          className="absolute z-50 bottom-2 right-2 cursor-pointer"
          onClick={clickNext}
        >
          <div className="swiper-button-next">
            <IoIosArrowDropright />
          </div>
        </div>
      </div>

      {DescriptionComponent && (
        <DescriptionComponent
          activeImage={activeImage}
          clickNext={clickNext}
          clickPrev={clickPrev}
          slides={slides}
          testimonials={testimonials}
        />
      )}
    </main>
  );
};

export default Slider;
