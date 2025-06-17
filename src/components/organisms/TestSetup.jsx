import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const TestSetup = ({ onStartTest, className = '' }) => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [questionCount, setQuestionCount] = useState(30);
  const [difficulty, setDifficulty] = useState('Mixed');
  const navigate = useNavigate();

  const subjects = [
    { id: 'Biology', name: 'Biology', icon: 'Microscope', color: 'success' },
    { id: 'Physics', name: 'Physics', icon: 'Atom', color: 'primary' },
    { id: 'Chemistry', name: 'Chemistry', icon: 'Flask', color: 'accent' }
  ];

  const difficulties = ['Easy', 'Medium', 'Hard', 'Mixed'];

  const handleStartTest = () => {
    if (!selectedSubject) {
      toast.error('Please select a subject');
      return;
    }

    const testConfig = {
      subject: selectedSubject,
      questionCount,
      difficulty,
      startTime: new Date().toISOString()
    };

    // Create a test ID and navigate to test interface
    const testId = Date.now().toString();
    sessionStorage.setItem(`test_${testId}`, JSON.stringify(testConfig));
    navigate(`/test/${testId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white rounded-xl p-6 shadow-sm border border-surface-200 ${className}`}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-surface-900 mb-2">Start New Test</h2>
        <p className="text-surface-600">Configure your test preferences and begin your practice session</p>
      </div>

      {/* Subject Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Select Subject</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {subjects.map((subject) => {
            const isSelected = selectedSubject === subject.id;
            const colorClasses = {
              success: isSelected ? 'bg-success text-white border-success' : 'bg-success/10 text-success border-success/20 hover:bg-success/20',
              primary: isSelected ? 'bg-primary text-white border-primary' : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20',
              accent: isSelected ? 'bg-accent text-white border-accent' : 'bg-accent/10 text-accent border-accent/20 hover:bg-accent/20'
            };

            return (
              <motion.button
                key={subject.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedSubject(subject.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${colorClasses[subject.color]}`}
              >
                <div className="flex flex-col items-center">
                  <ApperIcon name={subject.icon} className="w-8 h-8 mb-2" />
                  <span className="font-medium">{subject.name}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Question Count */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-surface-900">Number of Questions</h3>
          <span className="text-primary font-semibold">{questionCount}</span>
        </div>
        <input
          type="range"
          min="10"
          max="50"
          step="5"
          value={questionCount}
          onChange={(e) => setQuestionCount(parseInt(e.target.value))}
          className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #6366F1 0%, #6366F1 ${((questionCount - 10) / 40) * 100}%, #e2e8f0 ${((questionCount - 10) / 40) * 100}%, #e2e8f0 100%)`
          }}
        />
        <div className="flex justify-between text-sm text-surface-500 mt-2">
          <span>10</span>
          <span>30</span>
          <span>50</span>
        </div>
      </div>

      {/* Difficulty Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Difficulty Level</h3>
        <div className="flex flex-wrap gap-2">
          {difficulties.map((level) => (
            <motion.button
              key={level}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDifficulty(level)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                difficulty === level
                  ? 'bg-primary text-white'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
              }`}
            >
              {level}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Start Test Button */}
      <div className="text-center">
        <Button
          onClick={handleStartTest}
          variant="primary"
          size="large"
          icon="Play"
          className="min-w-40"
        >
          Start Test
        </Button>
      </div>
    </motion.div>
  );
};

export default TestSetup;