import { motion } from 'framer-motion';
import { FiAlertCircle } from 'react-icons/fi';

import { Button } from '@/components';

interface ModalNotificationProps {
  title?: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const ModalNotification = ({
  title = 'Увага',
  message,
  onConfirm,
  onCancel,
}: ModalNotificationProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="w-full flex flex-col items-center text-center"
    >
      <div className="flex items-center justify-center mb-3">
        <FiAlertCircle className="text-primaryAccentColor w-8 h-8 mr-3" />
        <h3 className="text-2xl font-semibold">{title}</h3>
      </div>

      <p className="text-gray-700 mb-6 leading-relaxed px-2">{message}</p>

      <div className="flex gap-4 justify-center mt-2">
        {onCancel && (
          <Button
            type="button"
            label="Скасувати"
            onClick={onCancel}
            className="min-w-[120px]"
          />
        )}

        {onConfirm && (
          <Button
            type="button"
            label="OK"
            onClick={onConfirm}
            className="min-w-[120px]"
          />
        )}
      </div>
    </motion.div>
  );
};

export default ModalNotification;
