import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { motion } from 'framer-motion';
import { testAttemptService } from '@/services';
import LoadingCard from '@/components/molecules/LoadingCard';
import ErrorState from '@/components/molecules/ErrorState';

const PerformanceChart = ({ userId = 'user1', className = '' }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const attempts = await testAttemptService.getUserAttempts(userId);
      setData(attempts || []);
    } catch (err) {
      setError(err.message || 'Failed to load performance data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingCard className={className} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadData} className={className} />;
  }

  if (data.length === 0) {
    return (
      <div className={`bg-white rounded-xl p-6 shadow-sm border border-surface-200 ${className}`}>
        <div className="text-center py-8">
          <p className="text-surface-500">No test data available</p>
        </div>
      </div>
    );
  }

  // Process data for chart
  const subjectData = {
    Biology: [],
    Physics: [],
    Chemistry: []
  };

  data.forEach(attempt => {
    const percentage = (attempt.score / attempt.totalQuestions) * 100;
    const date = new Date(attempt.completedAt).toLocaleDateString();
    
    if (subjectData[attempt.subject]) {
      subjectData[attempt.subject].push({
        x: date,
        y: percentage.toFixed(1)
      });
    }
  });

  const chartOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    colors: ['#10B981', '#6366F1', '#F59E0B'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      type: 'category',
      labels: {
        style: {
          colors: '#64748b'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Score Percentage',
        style: {
          color: '#64748b'
        }
      },
      min: 0,
      max: 100,
      labels: {
        formatter: function (val) {
          return val + '%';
        },
        style: {
          colors: '#64748b'
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left'
    },
    grid: {
      borderColor: '#e2e8f0'
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + '%';
        }
      }
    },
    dataLabels: {
      enabled: false
    }
  };

  const series = Object.entries(subjectData)
    .filter(([_, values]) => values.length > 0)
    .map(([subject, values]) => ({
      name: subject,
      data: values
    }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white rounded-xl p-6 shadow-sm border border-surface-200 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-surface-900">Performance Trends</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-success rounded-full mr-2"></div>
            <span className="text-surface-600">Biology</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
            <span className="text-surface-600">Physics</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-accent rounded-full mr-2"></div>
            <span className="text-surface-600">Chemistry</span>
          </div>
        </div>
      </div>

      <Chart
        options={chartOptions}
        series={series}
        type="line"
        height={350}
      />
    </motion.div>
  );
};

export default PerformanceChart;