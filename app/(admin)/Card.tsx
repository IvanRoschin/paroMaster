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
      className="p-4 bg-white shadow rounded hover:shadow-md transition flex items-center justify-between"
    >
      <div className="flex flex-col">
        <span className="text-lg font-semibold">{title}</span>
        <span className="text-2xl font-bold">{count}</span>
      </div>
      <Icon className="text-4xl text-primaryAccentColor" />
    </Link>
  );
};
