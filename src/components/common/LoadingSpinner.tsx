import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  label,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-emerald-600`} />
      {label && <p className="text-xs font-medium text-neutral-500 animate-pulse">{label}</p>}
    </div>
  );
};

export const PageLoader: React.FC<{ message?: string }> = ({ message = 'Loading ENEMIND...' }) => {
  return (
    <div className="min-h-[300px] flex flex-col items-center justify-center p-12">
      <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
      </div>
      <p className="text-sm font-semibold text-neutral-700">{message}</p>
      <p className="text-xs text-neutral-400 mt-1">Connecting to global student network</p>
    </div>
  );
};
