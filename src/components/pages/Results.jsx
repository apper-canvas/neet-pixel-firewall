import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import TestCard from '@/components/molecules/TestCard';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import LoadingCard from '@/components/molecules/LoadingCard';
import PerformanceChart from '@/components/organisms/PerformanceChart';
import ApperIcon from '@/components/ApperIcon';
import { testAttemptService } from '@/services';

const Results = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterSubject, setFilterSubject] = useState('All');

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await testAttemptService.getUserAttempts('user1');
      setTests(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load test results');
      toast.error('Failed to load test results');
    } finally {
      setLoading(false);
    }
  };

  const subjects = ['All', 'Biology', 'Physics', 'Chemistry'];

  const filteredTests = filterSubject === 'All' 
    ? tests 
    : tests.filter(test => test.subject === filterSubject);

  const getOverallStats = () => {
    if (tests.length === 0) return { avgScore: 0, totalTests: 0, bestScore: 0 };
    
    const totalScore = tests.reduce((sum, test) => sum + test.score, 0);
    const totalQuestions = tests.reduce((sum, test) => sum + test.totalQuestions, 0);
    const avgScore = totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0;
    const bestScore = Math.max(...tests.map(test => (test.score / test.totalQuestions) * 100));
    
    return {
      avgScore: avgScore.toFixed(1),
      totalTests: tests.length,
      bestScore: bestScore.toFixed(1)
    };
  };

  const stats = getOverallStats();

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
        <LoadingCard />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message={error} onRetry={loadTests} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-full overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-surface-900 mb-2">Test Results</h1>
        <p className="text-surface-600">Track your progress and analyze your performance</p>
      </motion.div>

      {/* Overall Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-surface-200">
            <div className="flex items-center">
              <div className="p-3 bg-primary/10 rounded-lg">
                <ApperIcon name="Target" className="w-6 h-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Average Score</p>
                <p className="text-2xl font-bold text-surface-900">{stats.avgScore}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-surface-200">
            <div className="flex items-center">
              <div className="p-3 bg-success/10 rounded-lg">
                <ApperIcon name="Trophy" className="w-6 h-6 text-success" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Best Score</p>
                <p className="text-2xl font-bold text-surface-900">{stats.bestScore}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-surface-200">
            <div className="flex items-center">
              <div className="p-3 bg-accent/10 rounded-lg">
                <ApperIcon name="FileText" className="w-6 h-6 text-accent" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Total Tests</p>
                <p className="text-2xl font-bold text-surface-900">{stats.totalTests}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Performance Chart */}
      {tests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <PerformanceChart userId="user1" />
        </motion.div>
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-surface-900">Test History</h2>
          <div className="flex items-center space-x-2">
            {subjects.map((subject) => (
              <motion.button
                key={subject}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterSubject(subject)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  filterSubject === subject
                    ? 'bg-primary text-white'
                    : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                }`}
              >
                {subject}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Test List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {filteredTests.length === 0 ? (
          <EmptyState
            icon="BarChart3"
            title={filterSubject === 'All' ? 'No tests taken yet' : `No ${filterSubject} tests found`}
            description={filterSubject === 'All' 
              ? 'Start taking tests to see your results here' 
              : `Take a ${filterSubject} test to see results for this subject`}
            actionLabel="Take a Test"
            onAction={() => navigate('/take-test')}
          />
        ) : (
          <div className="space-y-4">
            {filteredTests.map((test, index) => (
              <motion.div
                key={test.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <TestCard test={test} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Results;