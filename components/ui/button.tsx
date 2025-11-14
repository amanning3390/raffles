import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = 'font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 inline-flex items-center justify-center gap-2 relative overflow-hidden group';

    const variants = {
      primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 active:scale-95 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40',
      secondary: 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 active:scale-95 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40',
      gradient: 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:shadow-xl hover:shadow-purple-500/40 active:scale-95 shadow-lg shadow-purple-500/30',
      outline: 'border-2 border-gray-200 dark:border-gray-700 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600 active:scale-95',
      ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800/50 active:scale-95',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4 absolute" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        <span className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity'}>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
