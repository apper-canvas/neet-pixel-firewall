import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import QuestionCard from '@/components/molecules/QuestionCard';
import LoadingCard from '@/components/molecules/LoadingCard';
import ErrorState from '@/components/molecules/ErrorState';
import Timer from '@/components/atoms/Timer';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { questionService, testAttemptService } from '@/services';

const TestInterface = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  
  const [testConfig, setTestConfig] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTestData();
  }, [testId]);

const loadTestData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get test config from session storage
      const configData = sessionStorage.getItem(`test_${testId}`);
      if (!configData) {
        throw new Error('Test configuration not found');
      }
      
      const config = JSON.parse(configData);
      setTestConfig(config);
      
      // Load questions based on subject
      const questionData = await questionService.getBySubject(config.subject, config.questionCount);
      setQuestions(questionData);
      
      // Initialize answers object
      const initialAnswers = {};
      questionData.forEach(q => {
        initialAnswers[q.Id] = null;
      });
      setAnswers(initialAnswers);
      
    } catch (err) {
      setError(err.message || 'Failed to load test data');
      toast.error('Failed to load test');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;

    questions.forEach(question => {
      const userAnswer = answers[question.Id];
      if (userAnswer === null) {
        unattempted++;
      } else if (userAnswer === question.correctAnswer) {
        correct++;
      } else {
        wrong++;
      }
    });

    const score = correct - (wrong * 0.25); // Negative marking
    return { correct, wrong, unattempted, score };
  };

const handleSubmit = async () => {
    setSubmitting(true);
    
    try {
      const { correct, wrong, unattempted, score } = calculateScore();
      const startTime = new Date(testConfig.startTime);
      const endTime = new Date();
      const timeTaken = Math.floor((endTime - startTime) / 1000); // in seconds

      const testAttempt = {
        userId: 'user1',
        subject: testConfig.subject,
        totalQuestions: questions.length,
        correctAnswers: correct,
        wrongAnswers: wrong,
        unattempted: unattempted,
        score: Math.max(0, score), // Ensure score is not negative
        timeTaken: timeTaken
      };

      const result = await testAttemptService.create(testAttempt);
      
      // Clear test config from session storage
      sessionStorage.removeItem(`test_${testId}`);
      
      toast.success('Test submitted successfully!');
      navigate('/results');
      
    } catch (err) {
      toast.error('Failed to submit test');
      console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
      setShowSubmitModal(false);
    }
  };

  const handleTimeUp = () => {
    toast.warning('Time is up! Submitting your test...');
    handleSubmit();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <LoadingCard />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <ErrorState message={error} onRetry={() => navigate('/take-test')} />
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <ErrorState message="No questions available" onRetry={() => navigate('/take-test')} />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = Object.values(answers).filter(answer => answer !== null).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-surface-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-surface-900">
                {testConfig?.subject} Test
              </h1>
              <span className="ml-4 text-sm text-surface-500">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-surface-600">
                Answered: {answeredCount}/{questions.length}
              </div>
              <Timer
                initialTime={3600} // 1 hour
                onTimeUp={handleTimeUp}
                isRunning={true}
              />
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-surface-200 rounded-full h-2">
              <motion.div
                className="bg-primary h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-4xl mx-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <QuestionCard
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              selectedAnswer={answers[currentQuestion.Id]}
              onAnswerSelect={(answer) => handleAnswerSelect(currentQuestion.Id, answer)}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            variant="outline"
            icon="ChevronLeft"
          >
            Previous
          </Button>

          <div className="flex items-center space-x-4">
            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                onClick={() => setShowSubmitModal(true)}
                variant="accent"
                icon="Check"
              >
                Submit Test
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                variant="primary"
                icon="ChevronRight"
                iconPosition="right"
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowSubmitModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ApperIcon name="AlertTriangle" className="w-6 h-6 text-warning" />
                  </div>
                  <h3 className="text-lg font-semibold text-surface-900 mb-2">
                    Submit Test?
                  </h3>
                  <p className="text-surface-600 mb-6">
                    You have answered {answeredCount} out of {questions.length} questions. 
                    Are you sure you want to submit your test?
                  </p>
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => setShowSubmitModal(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Continue Test
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      variant="primary"
                      loading={submitting}
                      className="flex-1"
                    >
                      Submit Test
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TestInterface;