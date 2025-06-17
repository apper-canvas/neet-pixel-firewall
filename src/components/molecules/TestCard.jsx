import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';

const TestCard = ({ 
  test, 
  onClick,
  className = ''
}) => {
  const getSubjectColor = (subject) => {
    switch (subject.toLowerCase()) {
      case 'biology':
        return 'text-success bg-success/10';
      case 'physics':
        return 'text-primary bg-primary/10';
      case 'chemistry':
        return 'text-accent bg-accent/10';
      default:
        return 'text-surface-600 bg-surface-100';
    }
  };

  const getScoreColor = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-warning';
    return 'text-error';
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`bg-white rounded-xl p-4 shadow-sm border border-surface-200 cursor-pointer transition-all duration-200 hover:shadow-md ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSubjectColor(test.subject)}`}>
            {test.subject}
          </span>
          <span className="ml-2 text-sm text-surface-500">
            {format(new Date(test.completedAt), 'MMM dd, yyyy')}
          </span>
        </div>
        <div className="flex items-center text-sm text-surface-500">
          <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
          {formatTime(test.timeTaken)}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <span className={`text-xl font-bold ${getScoreColor(test.score, test.totalQuestions)}`}>
              {test.score}
            </span>
            <span className="text-surface-500 ml-1">/ {test.totalQuestions}</span>
          </div>
          <div className="flex items-center text-sm text-surface-500">
            <span className="text-success mr-3">
              <ApperIcon name="Check" className="w-4 h-4 inline mr-1" />
              {test.correctAnswers}
            </span>
            <span className="text-error mr-3">
              <ApperIcon name="X" className="w-4 h-4 inline mr-1" />
              {test.wrongAnswers}
            </span>
            <span className="text-surface-400">
              <ApperIcon name="Minus" className="w-4 h-4 inline mr-1" />
              {test.unattempted}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-lg font-semibold ${getScoreColor(test.score, test.totalQuestions)}`}>
            {((test.score / test.totalQuestions) * 100).toFixed(1)}%
          </div>
          <ApperIcon name="ChevronRight" className="w-4 h-4 text-surface-400 ml-auto" />
        </div>
      </div>
    </motion.div>
  );
};

export default TestCard;