import React from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Clock } from "lucide-react";
import { useGame } from "../contexts/GameContext";

const TimerControls = () => {
  const { timer, startTimer, pauseTimer, resetTimer } = useGame();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    const percentage = (timer.remaining / timer.duration) * 100;
    if (percentage > 50) return "text-green-600";
    if (percentage > 25) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = () => {
    const percentage = (timer.remaining / timer.duration) * 100;
    if (percentage > 50) return "bg-green-500";
    if (percentage > 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
      {/* Timer Display */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-600" />
          <span className="text-sm text-gray-600">Timer:</span>
        </div>

        <div className="relative">
          <div className={`text-2xl font-bold ${getTimerColor()}`}>
            {formatTime(timer.remaining)}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <motion.div
              initial={{ width: "100%" }}
              animate={{
                width: `${(timer.remaining / timer.duration) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
              className={`h-2 rounded-full ${getProgressColor()}`}
            />
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={timer.isRunning ? pauseTimer : startTimer}
          className={`
            flex items-center px-4 py-2 rounded-lg font-semibold transition-colors
            ${
              timer.isRunning
                ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }
          `}
        >
          {timer.isRunning ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              {timer.isPaused ? "Resume" : "Start"}
            </>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetTimer}
          className="flex items-center px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </motion.button>
      </div>
    </div>
  );
};

export default TimerControls;
