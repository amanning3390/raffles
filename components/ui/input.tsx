import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold mb-2.5 text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 ${
              error
                ? 'border-red-400 dark:border-red-500 focus:ring-red-500/20 focus:border-red-500'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            } bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-1">
            <span>⚠️</span>
            <span>{error}</span>
          </p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
