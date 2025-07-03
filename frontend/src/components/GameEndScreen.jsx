import React from "react";
import { motion } from "framer-motion";
import { Trophy, Share2, Home, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../contexts/GameContext";
import toast from "react-hot-toast";

const GameEndScreen = () => {
  const { teams, room } = useGame();
  const navigate = useNavigate();

  // Sort teams by score to determine winner
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const winner = sortedTeams[0];
  const isMultipleWinners =
    sortedTeams.filter((team) => team.score === winner.score).length > 1;

  const handleShare = () => {
    const shareText =
      `🎉 Game Results for "${room.name}"!\n\n` +
      `🏆 Winner: ${winner.name} (${winner.score} points)\n\n` +
      `Final Scores:\n` +
      sortedTeams
        .map(
          (team, index) => `${index + 1}. ${team.name}: ${team.score} points`
        )
        .join("\n") +
      `\n\nPlay Trivia Master!`;

    if (navigator.share) {
      navigator.share({
        title: "Trivia Game Results",
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Results copied to clipboard!");
    }
  };

  const handleNewGame = () => {
    navigate("/room-setup");
  };

  const handleBackHome = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="relative bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-6xl mb-4"
          >
            🎉
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Game Complete!
          </h1>
          <p className="text-white/90 text-lg">{room.name}</p>
        </div>

        <div className="p-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            {isMultipleWinners ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  It's a Tie! 🤝
                </h2>
                <p className="text-gray-600">
                  Multiple teams with {winner.score} points!
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  🏆 {winner.name} Wins!
                </h2>
                <p className="text-gray-600">
                  Final Score: {winner.score} points
                </p>
              </div>
            )}
          </motion.div>

          <div className="space-y-3 mb-8">
            <h3 className="text-xl font-bold text-gray-800 text-center mb-4">
              Final Leaderboard
            </h3>
            {sortedTeams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  index === 0
                    ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 ${
                      index === 0 ? "bg-white/20" : "bg-gray-300"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="font-semibold text-lg">
                    {team.name}
                    {index === 0 && !isMultipleWinners && (
                      <span className="ml-2">👑</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{team.score}</div>
                  <div className="text-sm opacity-75">points</div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col md:flex-row gap-4"
          >
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share Results
            </button>
            <button
              onClick={handleNewGame}
              className="flex-1 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              New Game
            </button>
            <button
              onClick={handleBackHome}
              className="flex-1 flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              Home
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default GameEndScreen;
