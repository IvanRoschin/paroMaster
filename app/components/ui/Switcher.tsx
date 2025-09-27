import React from 'react';

import { AnimatePresence, motion } from 'framer-motion';

interface SwitcherProps {
  id?: string;
  labels?: [string, string];
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Switcher: React.FC<SwitcherProps> = ({
  id,
  labels = ['Off', 'On'],
  checked,
  onChange,
}) => {
  const handleToggle = () => {
    onChange(!checked);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Лейбл с анимацией появления/исчезновения */}
      <div className="h-5 mb-1 flex justify-center items-center relative w-12">
        <AnimatePresence mode="wait">
          <div className="absolute text-xs font-medium">
            <motion.span
              key={checked ? 'on' : 'off'}
              initial={{ opacity: 0, x: checked ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: checked ? -20 : 20 }}
              transition={{ duration: 0.2 }}
            >
              {checked ? labels[1] : labels[0]}
            </motion.span>
          </div>
        </AnimatePresence>
      </div>

      {/* Сам переключатель */}
      <div
        onClick={handleToggle}
        className={`relative w-14 h-8 rounded-full cursor-pointer transition-colors duration-300 ${
          checked ? 'bg-primaryAccentColor' : 'bg-gray-300'
        }`}
      >
        <div className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md">
          <motion.div
            layout
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 25,
            }}
            animate={{ x: checked ? 24 : 0 }}
          />
        </div>
      </div>
    </div>
  );
};

export default Switcher;
