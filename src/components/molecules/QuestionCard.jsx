import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';

const QuestionCard = ({ 
  question, 
  questionNumber, 
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  showResult = false,
  userAnswer = null,
  className = ''
}) => {
  const options = [
    { key: 'A', text: question.optionA },
    { key: 'B', text: question.optionB },
    { key: 'C', text: question.optionC },
    { key: 'D', text: question.optionD }
  ];

  const getOptionStyle = (option) => {
    if (!showResult) {
      return selectedAnswer === option.key 
        ? 'bg-primary text-white border-primary' 
        : 'bg-white text-surface-700 border-surface-200 hover:bg-surface-50';
    }

    // Show result mode
    if (option.key === question.correctAnswer) {
      return 'bg-success text-white border-success';
    }
    if (userAnswer === option.key && option.key !== question.correctAnswer) {
      return 'bg-error text-white border-error';
    }
    return 'bg-surface-100 text-surface-500 border-surface-200';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-xl p-6 shadow-sm border border-surface-200 ${className}`}
    >
      {/* Question Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            Question {questionNumber}
          </span>
          <span className="ml-3 text-sm text-surface-500">
            {questionNumber} of {totalQuestions}
          </span>
        </div>
        <div className="flex items-center">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            question.difficulty === 'Easy' 
              ? 'bg-success/10 text-success'
              : question.difficulty === 'Medium'
                ? 'bg-warning/10 text-warning'
                : 'bg-error/10 text-error'
          }`}>
            {question.difficulty}
          </span>
        </div>
      </div>

      {/* Question Text */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-surface-900 leading-relaxed">
          {question.text}
        </h3>
        <p className="text-sm text-surface-500 mt-2">
          {question.subject} • {question.chapter}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option, index) => (
          <motion.button
            key={option.key}
            whileHover={{ scale: showResult ? 1 : 1.01 }}
            whileTap={{ scale: showResult ? 1 : 0.99 }}
            onClick={() => !showResult && onAnswerSelect(option.key)}
            disabled={showResult}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${getOptionStyle(option)}`}
          >
            <div className="flex items-center">
              <span className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-semibold mr-4">
                {option.key}
              </span>
              <span className="flex-1 break-words">{option.text}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-surface-500 mb-2">
          <span>Progress</span>
          <span>{questionNumber}/{totalQuestions}</span>
        </div>
        <div className="w-full bg-surface-200 rounded-full h-2">
          <motion.div
            className="bg-primary h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default QuestionCard;