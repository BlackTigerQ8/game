import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Mail, X } from 'lucide-react';
import { useGame } from '../contexts/GameContext';

const InsufficientQuestionsModal = () => {
  const { ui, setUi } = useGame();

  const handleClose = () => {
    setUi(prev => ({ ...prev, showInsufficientModal: false }));
  };

  const handleEmailSupport = () => {
    window.location.href = 'mailto:admin@trivia.com?subject=Request for More Questions';
  };

  if (!ui.showInsufficientModal) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-400 to-red-500 p-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl mb-4"
            >
              ✨
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">
              All Questions Completed!
            </h2>
            <p className="text-white/90">
              You've used all available questions
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center mb-6">
              <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-4">
                Great job completing all the questions! 🎉
              </p>
              <p className="text-gray-500 text-sm">
                Want more questions? Contact our team to request additional content for your trivia games.
              </p>
            </div>

            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEmailSupport}
                className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                <Mail className="w-5 h-5 mr-2" />
                Email admin@trivia.com
              </motion.button>

              <button
                onClick={handleClose}
                className="w-full flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                <X className="w-5 h-5 mr-2" />
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InsufficientQuestionsModal;
