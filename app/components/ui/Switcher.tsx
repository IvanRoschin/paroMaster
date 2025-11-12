'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface SwitcherProps {
  id?: string;
  label?: string;
  labels?: [string, string];
  checked: boolean;
  onChange: (checked: boolean) => void;
  labelPosition?: 'top' | 'left';
}

const Switcher: React.FC<SwitcherProps> = ({
  id,
  label,
  labels = ['Off', 'On'],
  checked,
  onChange,
  labelPosition = 'left',
}) => {
  const toggle = () => onChange(!checked);

  const switchBody = (
    <div
      onClick={toggle}
      className={`relative w-12 h-6 flex items-center rounded-full cursor-pointer transition-colors ${
        checked ? 'bg-green-500' : 'bg-gray-300'
      }`}
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 600, damping: 30 }}
        className={`absolute w-5 h-5 bg-white rounded-full shadow-md ${
          checked ? 'left-[calc(100%-1.25rem)]' : 'left-0.5'
        }`}
      />
    </div>
  );

  const stateLabel = (
    <span className="text-sm text-gray-600 select-none min-w-[2ch] text-center">
      {checked ? labels[1] : labels[0]}
    </span>
  );

  return (
    <div
      className={`flex items-center gap-2 ${
        labelPosition === 'top' ? 'flex-col items-start' : ''
      }`}
    >
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-800 select-none"
        >
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        {stateLabel}
        {switchBody}
      </div>
    </div>
  );
};

export default Switcher;
