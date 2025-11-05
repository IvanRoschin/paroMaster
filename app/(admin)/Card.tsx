'use client';

import Link from 'next/link';
import { IconType } from 'react-icons';

interface CardProps {
  title: string;
  count: number;
  link: string;
  icon: IconType;
}

export const Card: React.FC<CardProps> = ({
  title,
  count,
  link,
  icon: Icon,
}) => {
  return (
    <Link
      href={link}
      className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition-transform transform hover:-translate-y-1 flex items-center justify-between"
    >
      <div className="flex flex-col">
        <span className="text-lg font-semibold text-gray-700">{title}</span>
        <span className="text-3xl font-bold text-primaryAccentColor">
          {count}
        </span>
      </div>
      <Icon className="text-5xl text-primaryAccentColor opacity-80" />
    </Link>
  );
};
