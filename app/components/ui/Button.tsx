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
  variant?: 'solid' | 'outline' | 'ghost';
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
  variant = 'solid',
}) => {
  const isOutline = variant === 'outline' || outline;

  const hasText = Boolean(label || children);

  const baseClasses = `flex items-center justify-center transition disabled:opacity-70 disabled:cursor-not-allowed rounded-lg ${
    small ? 'text-sm py-1 px-2 border' : 'text-md py-2 px-4 border-2'
  }`;

  // ⚡ Если width передан, используем Tailwind, иначе убираем w-full для маленьких кнопок
  const widthClass = width ? `w-[${width}px]` : small ? '' : 'w-full';

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
      {Icon && (
        <Icon size={small ? 14 : 18} className={hasText ? 'mr-2' : 'mx-auto'} />
      )}
      {label || children}
    </button>
  );
};

export default Button;
