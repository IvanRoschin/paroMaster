import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { FaPen, FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';

interface TestimonialProps {
  id: string;
  name: string;
  text: string;
  stars: number;
}

const Testimonial: React.FC<TestimonialProps> = ({ id, name, text, stars }) => {
  const { data: session } = useSession();
  const isAdmin = Boolean(session?.user);

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;

    return (
      <div className="flex items-center gap-1 text-yellow-400">
        {Array(full)
          .fill(0)
          .map((_, i) => (
            <FaStar key={`f-${i}`} />
          ))}
        {Array(half)
          .fill(0)
          .map((_, i) => (
            <FaStarHalfAlt key={`h-${i}`} />
          ))}
        {Array(empty)
          .fill(0)
          .map((_, i) => (
            <FaRegStar key={`e-${i}`} />
          ))}
      </div>
    );
  };

  return (
    <div className="relative w-full h-full px-6 py-8 md:py-10 md:px-12 bg-white shadow-md rounded-xl flex flex-col justify-between gap-4 text-center md:text-left">
      {isAdmin && (
        <Link href={`/admin/testimonials/${id}`}>
          <span className="absolute top-3 right-3 cursor-pointer w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center">
            <FaPen className="text-white text-sm" />
          </span>
        </Link>
      )}
      <div className="text-lg font-semibold text-gray-800">{name}</div>
      <div className="">{renderStars(stars)}</div>
      <p className="text-gray-600 italic text-sm md:text-base leading-relaxed line-clamp-5">
        “{text}”
      </p>
    </div>
  );
};

export default Testimonial;
