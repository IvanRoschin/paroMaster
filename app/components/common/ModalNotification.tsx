import { motion } from 'framer-motion';
import { FiAlertCircle } from 'react-icons/fi';

import { Button } from '@/components/index';

interface ModalNotificationProps {
  onConfirm?: () => void;
  onCancel?: () => void;
  title?: string;
  message: string;
}

const ModalNotification = ({
  onConfirm,
  onCancel,
  title = 'Увага',
  message,
}: ModalNotificationProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="w-full flex flex-col items-center text-center"
    >
      <div className="flex justify-center items-center ">
        {/* Иконка */}
        <FiAlertCircle className="text-primaryAccentColor w-8 h-8 mb-3 mr-4" />

        {/* Заголовок */}
        <h3 className="text-2xl font-semibold mb-2">{title}</h3>
      </div>
      {/* Текст */}
      <p className="text-gray-700 mb-6 leading-relaxed px-2">{message}</p>

      {/* Только ОК (или две кнопки, если надо), но всё всегда по центру */}
      <div className="flex gap-4 justify-center mt-2">
        {onCancel && (
          <Button
            type="button"
            label="Скасувати"
            onClick={onCancel}
            className="min-w-[120px] px-5 py-2 text-base md:min-w-[150px]"
          />
        )}

        {onConfirm && (
          <Button
            type="button"
            label="OK"
            onClick={onConfirm}
            className="min-w-[120px] px-5 py-2 text-base md:min-w-[150px]"
          />
        )}
      </div>
    </motion.div>
  );
};

export default ModalNotification;
