import { useGame } from "../contexts/GameContext";

const QuestionTile = ({ question, teamColor }) => {
  const { openQuestionModal } = useGame();

  const getDifficultyColors = () => {
    switch (question.difficulty) {
      case "easy":
        return "bg-green-200 hover:bg-green-300 border-green-400";
      case "medium":
        return "bg-yellow-400 hover:bg-yellow-500 border-yellow-600";
      case "hard":
        return "bg-red-600 hover:bg-red-700 border-red-800 text-white";
      default:
        return "bg-gray-200 hover:bg-gray-300 border-gray-400";
    }
  };

  const getStatusStyles = () => {
    if (question.status === "answered") {
      const teamColors = {
        blue: "bg-blue-500 text-white",
        red: "bg-red-500 text-white",
        green: "bg-green-500 text-white",
        purple: "bg-purple-500 text-white",
        yellow: "bg-yellow-500 text-white",
        pink: "bg-pink-500 text-white",
      };
      return teamColors[teamColor] || teamColors.blue;
    }
    if (question.status === "revealed") {
      return "bg-gray-400 text-gray-700 cursor-not-allowed";
    }
    return getDifficultyColors();
  };

  const handleClick = () => {
    if (question.status === "available") {
      openQuestionModal(question);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={question.status !== "available"}
      className={`
        w-full h-16 md:h-20 lg:h-24 rounded-lg border-2
        font-bold text-lg md:text-xl lg:text-2xl
        transition-all duration-200 transform
        ${getStatusStyles()}
        ${question.status === "available" ? "hover:scale-105 shadow-lg" : ""}
        ${question.status === "revealed" ? "opacity-50" : ""}
        focus:outline-none focus:ring-4 focus:ring-blue-200
      `}
    >
      {question.status === "available" ? (
        question.points
      ) : question.status === "answered" ? (
        <span className="text-sm">✓ {question.points}</span>
      ) : (
        <span className="text-sm opacity-75">{question.points}</span>
      )}
    </button>
  );
};

export default QuestionTile;
