import React from "react";
import { useGame } from "../contexts/GameContext";
import GameHeader from "../components/GameHeader";
import GameGrid from "../components/GameGrid";
import QuestionModal from "../components/QuestionModal";
import GameEndScreen from "../components/GameEndScreen";
import InsufficientQuestionsModal from "../components/InsufficientQuestionsModal";

const GameBoard = () => {
  const { room, ui } = useGame();

  if (room.status === "finished") {
    return <GameEndScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <GameHeader />
      <GameGrid />

      {/* Modals */}
      {ui.showQuestionModal && <QuestionModal />}
      {ui.showEndScreen && <GameEndScreen />}
      {ui.showInsufficientModal && <InsufficientQuestionsModal />}
    </div>
  );
};

export default GameBoard;
