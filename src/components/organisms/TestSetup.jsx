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

const quickStartPresets = [
    { id: 'quick-bio', name: 'Biology Quick Test', subject: 'Biology', questions: 30, difficulty: 'Mixed', icon: 'Microscope', color: 'success' },
    { id: 'quick-phy', name: 'Physics Quick Test', subject: 'Physics', questions: 30, difficulty: 'Mixed', icon: 'Atom', color: 'primary' },
    { id: 'quick-chem', name: 'Chemistry Quick Test', subject: 'Chemistry', questions: 30, difficulty: 'Mixed', icon: 'Flask', color: 'accent' }
  ];

  const handleQuickStart = (preset) => {
    const testConfig = {
      subject: preset.subject,
      questionCount: preset.questions,
      difficulty: preset.difficulty,
      startTime: new Date().toISOString()
    };

    const testId = Date.now().toString();
    sessionStorage.setItem(`test_${testId}`, JSON.stringify(testConfig));
    navigate(`/test/${testId}`);
  };

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
        <p className="text-surface-600">Choose a quick start option or customize your test settings</p>
      </div>

      {/* Quick Start Options */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Quick Start (30 Questions, Mixed Difficulty)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {quickStartPresets.map((preset) => {
            const colorClasses = {
              success: 'bg-success/10 text-success border-success/20 hover:bg-success/20',
              primary: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20',
              accent: 'bg-accent/10 text-accent border-accent/20 hover:bg-accent/20'
            };

            return (
              <motion.button
                key={preset.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleQuickStart(preset)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${colorClasses[preset.color]}`}
              >
                <div className="flex flex-col items-center">
                  <ApperIcon name={preset.icon} className="w-8 h-8 mb-2" />
                  <span className="font-medium text-sm">{preset.name}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
        <div className="text-center">
          <div className="inline-flex items-center text-sm text-surface-500">
            <span className="w-8 h-px bg-surface-300 mr-3"></span>
            <span>or customize your test</span>
            <span className="w-8 h-px bg-surface-300 ml-3"></span>
          </div>
        </div>
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
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Number of Questions</h3>
        <div className="flex gap-2">
          {[15, 30, 45].map((count) => (
            <motion.button
              key={count}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setQuestionCount(count)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                questionCount === count
                  ? 'bg-primary text-white'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
              }`}
            >
              {count} Questions
            </motion.button>
          ))}
        </div>
      </div>

{/* Difficulty Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Difficulty Level</h3>
        <div className="grid grid-cols-2 gap-2">
          {['Mixed', 'Hard'].map((level) => (
            <motion.button
              key={level}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDifficulty(level)}
              className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                difficulty === level
                  ? 'bg-primary text-white'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
              }`}
            >
              {level === 'Mixed' ? 'Mixed (Recommended)' : 'Hard Mode'}
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