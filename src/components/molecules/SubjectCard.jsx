import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ProgressRing from '@/components/atoms/ProgressRing';

const SubjectCard = ({ 
  subject, 
  average, 
  testsCompleted, 
  icon, 
  color = 'primary',
  onClick,
  className = ''
}) => {
  const colors = {
    primary: '#6366F1',
    secondary: '#8B5CF6',
    accent: '#F59E0B',
    success: '#10B981',
    error: '#EF4444'
  };

  const backgroundColors = {
    primary: 'bg-primary/5 hover:bg-primary/10',
    secondary: 'bg-secondary/5 hover:bg-secondary/10',
    accent: 'bg-accent/5 hover:bg-accent/10',
    success: 'bg-success/5 hover:bg-success/10',
    error: 'bg-error/5 hover:bg-error/10'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`bg-white rounded-xl p-6 shadow-sm border border-surface-200 cursor-pointer transition-all duration-200 ${backgroundColors[color]} ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg ${color === 'primary' ? 'bg-primary/10' : color === 'secondary' ? 'bg-secondary/10' : 'bg-accent/10'}`}>
            <ApperIcon 
              name={icon} 
              className={`w-6 h-6 ${color === 'primary' ? 'text-primary' : color === 'secondary' ? 'text-secondary' : 'text-accent'}`} 
            />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-surface-900">{subject}</h3>
            <p className="text-sm text-surface-500">{testsCompleted} tests completed</p>
          </div>
        </div>
        <ProgressRing
          progress={average}
          size={60}
          strokeWidth={6}
          color={colors[color]}
          showPercentage={false}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-surface-900">{average.toFixed(1)}%</p>
          <p className="text-sm text-surface-500">Average Score</p>
        </div>
        <ApperIcon name="ChevronRight" className="w-5 h-5 text-surface-400" />
      </div>
    </motion.div>
  );
};

export default SubjectCard;