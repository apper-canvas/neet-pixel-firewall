import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  changeType = 'neutral',
  color = 'primary',
  className = ''
}) => {
  const colors = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-success/10 text-success',
    error: 'bg-error/10 text-error'
  };

  const changeColors = {
    positive: 'text-success',
    negative: 'text-error',
    neutral: 'text-surface-500'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-xl p-6 shadow-sm border border-surface-200 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-surface-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-surface-900">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <ApperIcon 
                name={changeType === 'positive' ? 'TrendingUp' : changeType === 'negative' ? 'TrendingDown' : 'Minus'}
                className={`w-4 h-4 mr-1 ${changeColors[changeType]}`}
              />
              <span className={`text-sm font-medium ${changeColors[changeType]}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${colors[color]}`}>
            <ApperIcon name={icon} className="w-6 h-6" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;