import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  text,
}) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <Loader2 
        className={cn(
          'animate-spin text-primary',
          sizeClasses[size],
          className
        )}
      />
      {text && (
        <p className="text-sm text-muted-foreground text-center">
          {text}
        </p>
      )}
    </div>
  );
};

// Full page loading component
export const PageLoading: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="xl" text={text} />
    </div>
  );
};

// Card skeleton component
export const CardSkeleton: React.FC = () => {
  return (
    <div className="border rounded-lg p-6 space-y-4 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );
};

// List skeleton component
export const ListSkeleton: React.FC<{ items?: number }> = ({ items = 3 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4 animate-pulse">
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Button loading state
export const ButtonLoading: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex items-center space-x-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>{children}</span>
    </div>
  );
};

export default LoadingSpinner;