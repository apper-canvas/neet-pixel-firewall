import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import StatCard from '@/components/atoms/StatCard';
import ProgressRing from '@/components/atoms/ProgressRing';
import LoadingCard from '@/components/molecules/LoadingCard';
import ErrorState from '@/components/molecules/ErrorState';
import ApperIcon from '@/components/ApperIcon';
import { userProgressService, testAttemptService } from '@/services';

const Profile = () => {
  const [userProgress, setUserProgress] = useState(null);
  const [recentTests, setRecentTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProfileData();
  }, []);

const loadProfileData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [progress, tests] = await Promise.all([
        userProgressService.getByUserId('user1'),
        testAttemptService.getUserAttempts('user1')
      ]);
      
      setUserProgress(progress);
      setRecentTests(tests?.slice(0, 5) || []);
    } catch (err) {
      setError(err.message || 'Failed to load profile data');
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LoadingCard />
          <LoadingCard />
        </div>
        <LoadingCard />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message={error} onRetry={loadProfileData} />
      </div>
    );
  }

  const getStreakMessage = (streak) => {
    if (streak === 0) return "Start your streak today!";
    if (streak < 7) return "Keep it up!";
    if (streak < 30) return "Great consistency!";
    return "Amazing dedication!";
  };

  const getOverallPerformance = () => {
    if (!userProgress) return 0;
    return ((userProgress.biologyAverage + userProgress.physicsAverage + userProgress.chemistryAverage) / 3);
  };

  const achievements = [
    { 
      id: 1, 
      title: 'First Test', 
      description: 'Completed your first test',
      icon: 'Award',
      earned: (userProgress?.totalTests || 0) > 0,
      color: 'primary'
    },
    { 
      id: 2, 
      title: 'Week Warrior', 
      description: 'Maintained a 7-day streak',
      icon: 'Flame',
      earned: (userProgress?.streak || 0) >= 7,
      color: 'accent'
    },
    { 
      id: 3, 
      title: 'Subject Master', 
      description: 'Scored above 80% in any subject',
      icon: 'Trophy',
      earned: (userProgress?.biologyAverage || 0) > 80 || (userProgress?.physicsAverage || 0) > 80 || (userProgress?.chemistryAverage || 0) > 80,
      color: 'success'
    },
    { 
      id: 4, 
      title: 'Test Explorer', 
      description: 'Completed 10 tests',
      icon: 'Target',
      earned: (userProgress?.totalTests || 0) >= 10,
      color: 'secondary'
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
        <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="User" className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-surface-900 mb-2">NEET Aspirant</h1>
        <p className="text-surface-600">Your journey to medical excellence</p>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-surface-200"
      >
        <h2 className="text-xl font-bold text-surface-900 mb-6">Progress Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <ProgressRing
              progress={getOverallPerformance()}
              size={100}
              color="#6366F1"
            />
            <p className="text-sm font-medium text-surface-600 mt-2">Overall</p>
          </div>
          <div className="text-center">
            <ProgressRing
              progress={userProgress?.biologyAverage || 0}
              size={100}
              color="#10B981"
            />
            <p className="text-sm font-medium text-surface-600 mt-2">Biology</p>
          </div>
          <div className="text-center">
            <ProgressRing
              progress={userProgress?.physicsAverage || 0}
              size={100}
              color="#6366F1"
            />
            <p className="text-sm font-medium text-surface-600 mt-2">Physics</p>
          </div>
          <div className="text-center">
            <ProgressRing
              progress={userProgress?.chemistryAverage || 0}
              size={100}
              color="#F59E0B"
            />
            <p className="text-sm font-medium text-surface-600 mt-2">Chemistry</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Tests"
            value={userProgress?.totalTests || 0}
            icon="FileText"
            color="primary"
          />
          <StatCard
            title="Current Streak"
            value={`${userProgress?.streak || 0} days`}
            icon="Flame"
            color="accent"
          />
          <StatCard
            title="Best Subject"
            value={userProgress?.biologyAverage >= Math.max(userProgress?.physicsAverage || 0, userProgress?.chemistryAverage || 0) ? "Biology" : 
                   userProgress?.physicsAverage >= userProgress?.chemistryAverage ? "Physics" : "Chemistry"}
            icon="Trophy"
            color="success"
          />
          <StatCard
            title="Avg Score"
            value={`${getOverallPerformance().toFixed(1)}%`}
            icon="Target"
            color="secondary"
          />
        </div>
      </motion.div>

      {/* Streak Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gradient-accent rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">
              {userProgress?.streak || 0} Day Streak! 🔥
            </h3>
            <p className="text-white/90">{getStreakMessage(userProgress?.streak || 0)}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{userProgress?.streak || 0}</div>
            <div className="text-sm text-white/80">Days</div>
          </div>
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-xl font-bold text-surface-900 mb-6">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`bg-white rounded-xl p-4 shadow-sm border border-surface-200 ${
                achievement.earned ? 'ring-2 ring-primary/20' : 'opacity-60'
              }`}
            >
              <div className="flex items-start">
                <div className={`p-3 rounded-lg ${
                  achievement.earned 
                    ? achievement.color === 'primary' ? 'bg-primary/10 text-primary' :
                      achievement.color === 'accent' ? 'bg-accent/10 text-accent' :
                      achievement.color === 'success' ? 'bg-success/10 text-success' :
                      'bg-secondary/10 text-secondary'
                    : 'bg-surface-100 text-surface-400'
                }`}>
                  <ApperIcon name={achievement.icon} className="w-5 h-5" />
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center">
                    <h4 className="font-semibold text-surface-900">{achievement.title}</h4>
                    {achievement.earned && (
                      <ApperIcon name="Check" className="w-4 h-4 text-success ml-2" />
                    )}
                  </div>
                  <p className="text-sm text-surface-600 mt-1">{achievement.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-xl font-bold text-surface-900 mb-6">Recent Activity</h2>
        {recentTests.length === 0 ? (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-surface-200 text-center">
            <ApperIcon name="BookOpen" className="w-12 h-12 text-surface-300 mx-auto mb-4" />
            <p className="text-surface-500">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTests.map((test, index) => (
              <motion.div
                key={test.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-lg p-4 shadow-sm border border-surface-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      test.subject === 'Biology' ? 'bg-success' :
                      test.subject === 'Physics' ? 'bg-primary' : 'bg-accent'
                    }`}></div>
                    <div>
                      <p className="font-medium text-surface-900">{test.subject} Test</p>
                      <p className="text-sm text-surface-500">
                        {new Date(test.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-surface-900">
                      {((test.score / test.totalQuestions) * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm text-surface-500">
                      {test.score}/{test.totalQuestions}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;