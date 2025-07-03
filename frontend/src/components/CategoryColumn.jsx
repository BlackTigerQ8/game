import QuestionTile from "./QuestionTile";

const CategoryColumn = ({ category, teamColor }) => {
  const colorClasses = {
    blue: "bg-blue-100 border-blue-300 text-blue-800",
    red: "bg-red-100 border-red-300 text-red-800",
    green: "bg-green-100 border-green-300 text-green-800",
    purple: "bg-purple-100 border-purple-300 text-purple-800",
    yellow: "bg-yellow-100 border-yellow-300 text-yellow-800",
    pink: "bg-pink-100 border-pink-300 text-pink-800",
  };

  return (
    <div className="flex flex-col space-y-2">
      {/* Category Header */}
      <div
        className={`
        p-3 rounded-lg border-2 text-center font-bold
        ${colorClasses[teamColor] || colorClasses.blue}
        shadow-sm
      `}
      >
        <h3 className="text-sm md:text-base lg:text-lg truncate">
          {category.name}
        </h3>
      </div>

      {/* Question Tiles */}
      <div className="space-y-2">
        {category.questions
          .sort((a, b) => a.points - b.points)
          .map((question) => (
            <QuestionTile
              key={question.id}
              question={question}
              teamColor={teamColor}
            />
          ))}
      </div>
    </div>
  );
};

export default CategoryColumn;
