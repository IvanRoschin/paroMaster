import React from 'react';

type ErrorMessageProps = {
  error: unknown;
  className?: string;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  className = '',
}) => {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : 'Unknown error occurred';

  return (
    <div
      className={`text-red-600 bg-red-100 border border-red-400 p-3 rounded ${className}`}
    >
      <strong>Error:</strong> {message}
    </div>
  );
};

export default ErrorMessage;
