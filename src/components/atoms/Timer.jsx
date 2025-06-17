import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Timer = ({ 
  initialTime = 3600, // 1 hour in seconds
  onTimeUp,
  isRunning = true,
  showHours = true,
  className = ''
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          onTimeUp && onTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, onTimeUp]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (showHours) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isUrgent = timeLeft <= 300; // Last 5 minutes
  const isCritical = timeLeft <= 60; // Last minute

  return (
    <motion.div
      animate={isCritical ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.5, repeat: isCritical ? Infinity : 0 }}
      className={`inline-flex items-center px-3 py-2 rounded-lg font-mono text-sm font-medium ${
        isCritical 
          ? 'bg-error/10 text-error border border-error/20' 
          : isUrgent 
            ? 'bg-warning/10 text-warning border border-warning/20'
            : 'bg-surface-100 text-surface-700 border border-surface-200'
      } ${className}`}
    >
      <ApperIcon 
        name="Clock" 
        className={`w-4 h-4 mr-2 ${
          isCritical ? 'text-error' : isUrgent ? 'text-warning' : 'text-surface-500'
        }`} 
      />
      {formatTime(timeLeft)}
    </motion.div>
  );
};

export default Timer;