import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Trophy, Calendar, Users, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useGame } from "../contexts/GameContext";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { gameHistory } = useGame();
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    navigate("/room-setup");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Welcome back, {user?.username}!
              </h1>
              <p className="text-gray-600">
                Ready for another trivia challenge?
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Create Room Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateRoom}
              className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-6 h-6 mr-3" />
              Create New Game Room
            </motion.button>
          </div>
        </motion.div>

        {/* Game History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
            Recent Games
          </h2>

          {gameHistory.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">No games played yet</p>
              <p className="text-gray-400">
                Create your first room to get started!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gameHistory.map((game, index) => (
                <GameHistoryCard key={game.id} game={game} index={index} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const GameHistoryCard = ({ game, index }) => {
  const winnerScore = Math.max(...Object.values(game.finalScores));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-gray-800 text-lg">{game.roomName}</h3>
        <div className="text-right">
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(game.date).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center text-gray-600 mb-2">
          <Users className="w-4 h-4 mr-2" />
          <span className="text-sm">{game.teams.length} Teams</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {game.teams.map((team) => (
            <span
              key={team}
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                team === game.winner
                  ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {team === game.winner && "👑 "}
              {team}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Winner:</span>
          <span className="font-semibold text-yellow-600">{game.winner}</span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-sm text-gray-500">Final Score:</span>
          <span className="font-bold text-gray-800">{winnerScore} pts</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
