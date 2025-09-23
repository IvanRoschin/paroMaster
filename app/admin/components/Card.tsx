import Link from 'next/link';
import { IconType } from 'react-icons';

import { Button } from '@/components/index';

interface CardProps {
  title: string;
  count: number;
  link: string;
  icon: IconType;
}

const Card: React.FC<CardProps> = ({ title, count, icon: Icon, link }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-4 bg-gray-200 rounded-md shadow-md h-full">
      <div className="flex flex-col items-center justify-center flex-grow gap-4">
        <Icon size={50} className="text-primaryAccentColor" />
        <div>
          <h3 className="text-2xl font-semibold">{title}</h3>
          <p className="text-gray-800">{count}</p>
        </div>
      </div>
      <Link href={link} passHref>
        <Button label="Переглянути" type="button" />
      </Link>
    </div>
  );
};

export default Card;
