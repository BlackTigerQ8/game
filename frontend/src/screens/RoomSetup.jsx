import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Plus, X, Users, Grid3x3 } from "lucide-react";
import { useGame } from "../contexts/GameContext";
import toast from "react-hot-toast";

const RoomSetup = () => {
  const navigate = useNavigate();
  const { createRoom, availableCategories, setupGameCategories } = useGame();
  const [step, setStep] = useState(1);
  const [roomName, setRoomName] = useState("");
  const [teams, setTeams] = useState([
    { id: 1, name: "Team Alpha", color: "blue" },
    { id: 2, name: "Team Beta", color: "red" },
  ]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const teamColors = ["blue", "red", "green", "purple", "yellow", "pink"];

  const addTeam = () => {
    if (teams.length < 6) {
      const newTeam = {
        id: Date.now(),
        name: `Team ${String.fromCharCode(65 + teams.length)}`,
        color: teamColors[teams.length] || "gray",
      };
      setTeams([...teams, newTeam]);
    }
  };

  const removeTeam = (teamId) => {
    if (teams.length > 2) {
      setTeams(teams.filter((team) => team.id !== teamId));
      // Remove categories assigned to this team
      setSelectedCategories((prev) =>
        prev.filter((cat) => cat.teamId !== teamId)
      );
    }
  };

  const updateTeam = (teamId, field, value) => {
    setTeams(
      teams.map((team) =>
        team.id === teamId ? { ...team, [field]: value } : team
      )
    );
  };

  const toggleCategory = (categoryName, teamId) => {
    const existing = selectedCategories.find(
      (cat) => cat.name === categoryName
    );

    if (existing) {
      setSelectedCategories((prev) =>
        prev.filter((cat) => cat.name !== categoryName)
      );
    } else {
      // Check if team already has 2 categories
      const teamCategoryCount = selectedCategories.filter(
        (cat) => cat.teamId === teamId
      ).length;
      if (teamCategoryCount < 2) {
        setSelectedCategories([
          ...selectedCategories,
          { name: categoryName, teamId },
        ]);
      } else {
        toast.error("Each team can only select 2 categories");
      }
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return roomName.trim().length > 0;
      case 2:
        return (
          teams.length >= 2 &&
          teams.every((team) => team.name.trim().length > 0)
        );
      case 3:
        return selectedCategories.length === teams.length * 2;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceed()) {
      if (step < 3) {
        setStep(step + 1);
      } else {
        handleCreateRoom();
      }
    }
  };

  const handleCreateRoom = () => {
    createRoom({ name: roomName, teams });
    setupGameCategories(selectedCategories);
    toast.success("Room created successfully!");
    navigate(`/game/${Date.now()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold
                  ${
                    step >= stepNumber
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }
                `}
                >
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div
                    className={`
                    w-16 h-1 mx-2
                    ${step > stepNumber ? "bg-blue-500" : "bg-gray-200"}
                  `}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Room Details</span>
            <span>Teams</span>
            <span>Categories</span>
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8"
        >
          {step === 1 && (
            <RoomNameStep roomName={roomName} setRoomName={setRoomName} />
          )}
          {step === 2 && (
            <TeamsStep
              teams={teams}
              addTeam={addTeam}
              removeTeam={removeTeam}
              updateTeam={updateTeam}
              teamColors={teamColors}
            />
          )}
          {step === 3 && (
            <CategoriesStep
              teams={teams}
              availableCategories={availableCategories}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
            />
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() =>
                step > 1 ? setStep(step - 1) : navigate("/dashboard")
              }
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {step > 1 ? "Previous" : "Back to Dashboard"}
            </button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step === 3 ? "Create Room" : "Next"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const RoomNameStep = ({ roomName, setRoomName }) => (
  <div className="text-center">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Name Your Room</h2>
    <p className="text-gray-600 mb-8">
      Choose a memorable name for your trivia game
    </p>

    <div className="mb-6">
      <input
        type="text"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="Enter room name..."
        className="w-full text-center text-xl py-4 px-6 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        maxLength={50}
      />
      <div className="text-right text-sm text-gray-500 mt-2">
        {roomName.length}/50
      </div>
    </div>
  </div>
);

const TeamsStep = ({ teams, addTeam, removeTeam, updateTeam, teamColors }) => (
  <div>
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Setup Teams</h2>
      <p className="text-gray-600">
        Create teams and assign colors (minimum 2 teams)
      </p>
    </div>

    <div className="space-y-4 mb-6">
      {teams.map((team) => (
        <div
          key={team.id}
          className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
        >
          <div className="flex items-center space-x-3 flex-1">
            <div className={`w-6 h-6 rounded-full bg-${team.color}-500`} />
            <input
              type="text"
              value={team.name}
              onChange={(e) => updateTeam(team.id, "name", e.target.value)}
              className="flex-1 py-2 px-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Team name..."
            />
            <select
              value={team.color}
              onChange={(e) => updateTeam(team.id, "color", e.target.value)}
              className="py-2 px-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {teamColors.map((color) => (
                <option key={color} value={color}>
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </option>
              ))}
            </select>
          </div>
          {teams.length > 2 && (
            <button
              onClick={() => removeTeam(team.id)}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      ))}
    </div>

    {teams.length < 6 && (
      <button
        onClick={addTeam}
        className="w-full border-2 border-dashed border-gray-300 rounded-lg py-4 text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Team
      </button>
    )}
  </div>
);

const CategoriesStep = ({
  teams,
  availableCategories,
  selectedCategories,
  toggleCategory,
}) => (
  <div>
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Select Categories
      </h2>
      <p className="text-gray-600">
        Each team must select exactly 2 categories
      </p>
    </div>

    {teams.map((team) => (
      <div key={team.id} className="mb-8">
        <div className="flex items-center mb-4">
          <div className={`w-4 h-4 rounded-full bg-${team.color}-500 mr-3`} />
          <h3 className="font-bold text-lg">{team.name}</h3>
          <span className="ml-auto text-sm text-gray-500">
            {selectedCategories.filter((cat) => cat.teamId === team.id).length}
            /2 selected
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {availableCategories.map((category) => {
            const isSelectedByThisTeam = selectedCategories.some(
              (cat) => cat.name === category && cat.teamId === team.id
            );
            const isSelectedByOtherTeam = selectedCategories.some(
              (cat) => cat.name === category && cat.teamId !== team.id
            );

            return (
              <button
                key={`${team.id}-${category}`}
                onClick={() => toggleCategory(category, team.id)}
                disabled={isSelectedByOtherTeam}
                className={`
                  p-3 rounded-lg border-2 text-sm font-medium transition-all
                  ${
                    isSelectedByThisTeam
                      ? `border-${team.color}-500 bg-${team.color}-100 text-${team.color}-800`
                      : isSelectedByOtherTeam
                      ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 hover:border-gray-400 text-gray-700"
                  }
                `}
              >
                {category}
                {isSelectedByOtherTeam && (
                  <div className="text-xs mt-1">Taken</div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    ))}
  </div>
);

export default RoomSetup;
