import React from 'react';
import { motion } from 'framer-motion';
import TestSetup from '@/components/organisms/TestSetup';

const TakeTest = () => {
  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <TestSetup />
      </motion.div>
    </div>
  );
};

export default TakeTest;