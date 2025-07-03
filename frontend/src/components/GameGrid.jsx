import { useGame } from "../contexts/GameContext";
import CategoryColumn from "./CategoryColumn";

const GameGrid = () => {
  const { gameCategories, teams } = useGame();

  const getGridCols = () => {
    const teamCount = teams.length;
    if (teamCount === 2) return "grid-cols-2 md:grid-cols-4";
    if (teamCount === 3) return "grid-cols-3 md:grid-cols-6";
    return "grid-cols-2 md:grid-cols-4 lg:grid-cols-8";
  };

  return (
    <div className={`grid gap-4 p-4 ${getGridCols()}`}>
      {gameCategories.map((category) => (
        <CategoryColumn
          key={category.id}
          category={category}
          teamColor={teams.find((t) => t.id === category.teamId)?.color}
        />
      ))}
    </div>
  );
};

export default GameGrid;
