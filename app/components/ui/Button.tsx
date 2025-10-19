'use client';

import { IconType } from 'react-icons';

interface ButtonProps {
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  icon?: IconType;
  color?: string;
  width?: string;
  type?: 'submit' | 'reset' | 'button';
  bg?: string;
  children?: React.ReactNode;
  className?: string;
  variant?: 'solid' | 'outline' | 'ghost'; // ✅ добавили
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled,
  outline,
  small,
  icon: Icon,
  color,
  width,
  type = 'button',
  bg,
  children,
  className,
  variant = 'solid', // ✅ дефолт
}) => {
  // Если variant передан, игнорируем старый outline
  const isOutline = variant === 'outline' || outline;

  const baseClasses = `flex items-center justify-center rounded-lg transition disabled:opacity-70 disabled:cursor-not-allowed ${
    small ? 'text-sm py-1 px-2 border' : 'text-md py-2 px-4 border-2'
  }`;

  const widthClass = width ? `w-[${width}px]` : 'w-full';
  const bgClass = isOutline ? 'bg-white' : bg ? bg : 'bg-orange-600 text-white';
  const borderClass = isOutline
    ? color || 'border-orange-600'
    : color
      ? color
      : 'border-orange-600';
  const textClass = isOutline ? color || 'text-orange-600' : 'text-white';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${widthClass} ${bgClass} ${borderClass} ${textClass} ${className || ''} hover:opacity-80`}
    >
      {Icon && <Icon size={small ? 14 : 18} className="mr-2" />}
      {label || children}
    </button>
  );
};

export default Button;
