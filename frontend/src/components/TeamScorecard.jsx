import { motion } from "framer-motion";

const TeamScorecard = ({ team }) => {
  const maxPossibleScore = 2400; // Adjust based on game configuration
  const progressPercentage = Math.min(
    (team.score / maxPossibleScore) * 100,
    100
  );

  const colorClasses = {
    blue: {
      bg: "bg-blue-500",
      light: "bg-blue-100",
      text: "text-blue-800",
      progress: "bg-blue-600",
    },
    red: {
      bg: "bg-red-500",
      light: "bg-red-100",
      text: "text-red-800",
      progress: "bg-red-600",
    },
    green: {
      bg: "bg-green-500",
      light: "bg-green-100",
      text: "text-green-800",
      progress: "bg-green-600",
    },
    purple: {
      bg: "bg-purple-500",
      light: "bg-purple-100",
      text: "text-purple-800",
      progress: "bg-purple-600",
    },
  };

  const colors = colorClasses[team.color] || colorClasses.blue;

  return (
    <motion.div
      animate={{ scale: [1, 1.02, 1] }}
      transition={{ duration: 0.3 }}
      className={`
        ${colors.light} border-2 border-opacity-50 ${colors.bg.replace(
        "bg-",
        "border-"
      )}
        rounded-xl p-4 shadow-sm
      `}
    >
      {/* Team Name & Score */}
      <div className="flex justify-between items-center mb-3">
        <h3 className={`font-bold text-lg ${colors.text}`}>{team.name}</h3>
        <motion.div
          key={team.score}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className={`
            ${colors.bg} text-white px-3 py-1 rounded-full
            font-bold text-lg shadow-sm
          `}
        >
          {team.score}
        </motion.div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full ${colors.progress} rounded-full`}
        />
      </div>

      {/* Progress Text */}
      <div className="text-xs text-gray-600 mt-1 text-center">
        {progressPercentage.toFixed(0)}% Complete
      </div>
    </motion.div>
  );
};

export default TeamScorecard;
