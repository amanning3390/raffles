import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  gradient?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', hover, gradient, children, ...props }, ref) => {
    const baseStyles = 'bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800/60 rounded-2xl p-6 backdrop-blur-sm';
    
    const hoverStyles = hover 
      ? 'hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-gray-950/50 hover:border-gray-300/80 dark:hover:border-gray-700/80 hover:-translate-y-1 transition-all duration-300 cursor-pointer' 
      : '';
    
    const gradientStyles = gradient
      ? 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950'
      : '';

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${hoverStyles} ${gradientStyles} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
