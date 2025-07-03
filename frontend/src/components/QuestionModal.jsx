import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../contexts/GameContext";

const QuestionModal = () => {
  const {
    currentQuestion,
    teams,
    timer,
    ui,
    closeQuestionModal,
    assignPoints,
  } = useGame();
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  if (!ui.showQuestionModal || !currentQuestion) return null;

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
          className="bg-white rounded-xl shadow-2xl w-full md:w-3/4 lg:w-1/2 xl:w-2/5 max-h-[90vh] overflow-y-auto"
        >
          {/* Modal Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {currentQuestion.points} Points
              </h2>
              <button
                onClick={closeQuestionModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Timer */}
            {/* <TimerDisplay /> */}
          </div>

          {/* Question Content */}
          <div className="p-6">
            {/* Question Display */}
            <div className="mb-6">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {currentQuestion.question}
              </h3>

              {currentQuestion.image && (
                <div className="mb-4">
                  <img
                    src={currentQuestion.image}
                    alt="Question visual"
                    className="max-w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              )}
            </div>

            {/* Answer Submission */}
            {!showAnswer && (
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Teams can now discuss their answers. Click "Reveal Answer"
                  when ready.
                </p>
              </div>
            )}

            {/* Answer Reveal */}
            <AnimatePresence>
              {showAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                  <h4 className="font-bold text-green-800 mb-2">
                    Correct Answer:
                  </h4>
                  <p className="text-xl text-green-900">
                    {currentQuestion.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Modal Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <div className="flex flex-col md:flex-row gap-3">
              {!showAnswer ? (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Reveal Answer
                </button>
              ) : (
                <div className="flex flex-col md:flex-row gap-3 w-full">
                  {teams.map((team) => (
                    <button
                      key={team.id}
                      onClick={() =>
                        assignPoints(
                          currentQuestion.id,
                          team.id,
                          currentQuestion.points
                        )
                      }
                      className={`
                        flex-1 py-3 px-4 rounded-lg font-semibold transition-colors
                        ${
                          team.color === "blue"
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                            : ""
                        }
                        ${
                          team.color === "red"
                            ? "bg-red-100 text-red-800 hover:bg-red-200"
                            : ""
                        }
                        ${
                          team.color === "green"
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : ""
                        }
                        ${
                          team.color === "purple"
                            ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                            : ""
                        }
                        ${
                          team.color === "yellow"
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                            : ""
                        }
                        ${
                          team.color === "pink"
                            ? "bg-pink-100 text-pink-800 hover:bg-pink-200"
                            : ""
                        }
                        ${
                          ![
                            "blue",
                            "red",
                            "green",
                            "purple",
                            "yellow",
                            "pink",
                          ].includes(team.color)
                            ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            : ""
                        }
                      `}
                    >
                      Award to {team.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuestionModal;
