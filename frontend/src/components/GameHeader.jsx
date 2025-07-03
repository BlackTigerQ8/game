import { useGame } from "../contexts/GameContext";
import TeamScorecard from "./TeamScorecard";
import TimerControls from "./TimerControls";

const GameHeader = () => {
  const { teams, room, gameCategories } = useGame();

  const totalQuestions = gameCategories.reduce(
    (acc, cat) => acc + cat.questions.length,
    0
  );
  const answeredQuestions = gameCategories.reduce(
    (acc, cat) =>
      acc + cat.questions.filter((q) => q.status === "answered").length,
    0
  );

  return (
    <div className="bg-white shadow-lg border-b-4 border-blue-500">
      <div className="container mx-auto p-4">
        {/* Room Info */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">
            {room.name || "Trivia Game"}
          </h1>
          <div className="text-sm text-gray-600">
            Progress: {answeredQuestions}/{totalQuestions} questions completed
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  totalQuestions > 0
                    ? (answeredQuestions / totalQuestions) * 100
                    : 0
                }%`,
              }}
            />
          </div>
        </div>

        {/* Team Scorecards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {teams.map((team) => (
            <TeamScorecard key={team.id} team={team} />
          ))}
        </div>

        {/* Timer Controls */}
        <TimerControls />
      </div>
    </div>
  );
};

export default GameHeader;
