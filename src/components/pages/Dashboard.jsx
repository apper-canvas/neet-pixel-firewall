import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import StatCard from '@/components/atoms/StatCard';
import SubjectCard from '@/components/molecules/SubjectCard';
import TestCard from '@/components/molecules/TestCard';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import LoadingCard from '@/components/molecules/LoadingCard';
import Button from '@/components/atoms/Button';
import { testAttemptService, userProgressService } from '@/services';

const Dashboard = () => {
  const [recentTests, setRecentTests] = useState([]);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tests, progress] = await Promise.all([
        testAttemptService.getUserAttempts('user1'),
        userProgressService.getByUserId('user1')
      ]);
      
      setRecentTests(tests?.slice(0, 3) || []);
      setUserProgress(progress);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
        <LoadingCard />
        <LoadingCard />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message={error} onRetry={loadDashboardData} />
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Tests',
      value: userProgress?.totalTests || 0,
      icon: 'FileText',
      color: 'primary'
    },
    {
      title: 'Current Streak',
      value: userProgress?.streak || 0,
      icon: 'Flame',
      color: 'accent',
      change: '+2 days',
      changeType: 'positive'
    },
    {
      title: 'Best Subject',
      value: 'Biology',
      icon: 'Trophy',
      color: 'success'
    },
    {
      title: 'Avg Score',
      value: userProgress ? `${((userProgress.biologyAverage + userProgress.physicsAverage + userProgress.chemistryAverage) / 3).toFixed(1)}%` : '0%',
      icon: 'Target',
      color: 'secondary'
    }
  ];

  const subjects = [
    {
      subject: 'Biology',
      average: userProgress?.biologyAverage || 0,
      testsCompleted: Math.floor((userProgress?.totalTests || 0) / 3),
      icon: 'Microscope',
      color: 'success'
    },
    {
      subject: 'Physics',
      average: userProgress?.physicsAverage || 0,
      testsCompleted: Math.floor((userProgress?.totalTests || 0) / 3),
      icon: 'Atom',
      color: 'primary'
    },
    {
      subject: 'Chemistry',
      average: userProgress?.chemistryAverage || 0,
      testsCompleted: Math.floor((userProgress?.totalTests || 0) / 3),
      icon: 'Flask',
      color: 'accent'
    }
  ];

  return (
    <div className="p-6 space-y-8 max-w-full overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-surface-900 mb-2">
          Welcome back, Aspirant! 👋
        </h1>
        <p className="text-surface-600">
          Ready to ace your NEET preparation today?
        </p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>
      </motion.div>

{/* Start Test CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-primary rounded-xl p-8 text-white text-center"
      >
        <h2 className="text-2xl font-bold mb-2">Ready for Your Next Test?</h2>
        <p className="text-white/90 mb-4">
          Jump right in with a quick test or customize your practice session.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => {
              // Quick start with smart defaults
              const testConfig = {
                subject: 'Biology',
                questionCount: 30,
                difficulty: 'Mixed',
                startTime: new Date().toISOString()
              };
              const testId = Date.now().toString();
              sessionStorage.setItem(`test_${testId}`, JSON.stringify(testConfig));
              navigate(`/test/${testId}`);
            }}
            variant="secondary"
            size="large"
            icon="Zap"
            className="bg-white text-primary hover:bg-surface-50"
          >
            Quick Start (30 Questions)
          </Button>
          <Button
            onClick={() => navigate('/take-test')}
            variant="outline"
            size="large"
            icon="Settings"
            className="border-white text-white hover:bg-white/10"
          >
            Custom Setup
          </Button>
        </div>
      </motion.div>

      {/* Subject Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-surface-900">Subject Performance</h2>
          <Button
            onClick={() => navigate('/results')}
            variant="ghost"
            icon="ChevronRight"
            iconPosition="right"
          >
            View All
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.subject}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <SubjectCard
                {...subject}
                onClick={() => navigate('/take-test')}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Tests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-surface-900">Recent Tests</h2>
          <Button
            onClick={() => navigate('/results')}
            variant="ghost"
            icon="ChevronRight"
            iconPosition="right"
          >
            View All
          </Button>
        </div>

        {recentTests.length === 0 ? (
          <EmptyState
            icon="BookOpen"
            title="No tests taken yet"
            description="Start your first test to see your performance here"
            actionLabel="Take Your First Test"
            onAction={() => navigate('/take-test')}
          />
        ) : (
          <div className="space-y-4">
            {recentTests.map((test, index) => (
              <motion.div
                key={test.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <TestCard
                  test={test}
                  onClick={() => navigate('/results')}
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;