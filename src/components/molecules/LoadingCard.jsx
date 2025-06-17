import React from 'react';
import { motion } from 'framer-motion';

const LoadingCard = ({ className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`bg-white rounded-xl p-6 shadow-sm border border-surface-200 ${className}`}
    >
      <div className="animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-surface-200 rounded w-1/4"></div>
          <div className="h-6 bg-surface-200 rounded w-1/6"></div>
        </div>
        <div className="space-y-3 mb-6">
          <div className="h-4 bg-surface-200 rounded w-full"></div>
          <div className="h-4 bg-surface-200 rounded w-3/4"></div>
        </div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-surface-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingCard;