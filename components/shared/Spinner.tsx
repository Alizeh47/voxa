import React from 'react';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'white';
}

const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'medium', 
  color = 'primary' 
}) => {
  // Size classes
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };
  
  // Color classes
  const colorClasses = {
    primary: 'text-blue-600',
    white: 'text-white'
  };
  
  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full border-t-2 border-b-2 ${colorClasses[color]} ${sizeClasses[size]}`}></div>
    </div>
  );
};

export default Spinner; 