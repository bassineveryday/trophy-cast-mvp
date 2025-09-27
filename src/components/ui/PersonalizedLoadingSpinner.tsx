import React from 'react';
import { RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface PersonalizedLoadingSpinnerProps {
  message?: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

export const PersonalizedLoadingSpinner = ({ 
  message = "Loading...", 
  className = "",
  size = 'default'
}: PersonalizedLoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    default: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <RefreshCw className={`${sizeClasses[size]} animate-spin text-primary`} />
      {message && <span className="text-sm font-medium">{message}</span>}
    </div>
  );
};