import React from 'react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'google' }> = ({
  children, variant = 'primary', className = '', ...props
}) => {
  // Added touch-action-manipulation and active states
  const baseStyles = "font-bold py-3 px-6 rounded-2xl shadow-lg transform transition-all duration-200 active:scale-95 text-lg flex items-center justify-center gap-2 touch-manipulation select-none";

  const variants = {
    primary: "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white border-b-4 border-blue-700 active:border-b-0 active:translate-y-1",
    secondary: "bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white border-b-4 border-purple-700 active:border-b-0 active:translate-y-1",
    success: "bg-green-500 hover:bg-green-600 active:bg-green-700 text-white border-b-4 border-green-700 active:border-b-0 active:translate-y-1",
    danger: "bg-red-500 hover:bg-red-600 active:bg-red-700 text-white border-b-4 border-red-700 active:border-b-0 active:translate-y-1",
    google: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-md active:shadow-sm active:translate-y-1", // Google Style
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string; color?: string }> = ({
  children, className = '', color = 'bg-white'
}) => {
  return (
    <div className={`${color} rounded-3xl shadow-xl p-4 sm:p-6 ${className} border-2 border-opacity-10 border-black`}>
      {children}
    </div>
  );
};

export const ProgressBar: React.FC<{ current: number; total: number }> = ({ current, total }) => {
  const percentage = Math.min(100, (current / total) * 100);
  return (
    <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden border-2 border-gray-300">
      <div
        className="bg-yellow-400 h-full rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};