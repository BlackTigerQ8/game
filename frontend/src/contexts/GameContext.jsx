import React, { createContext, useContext, useState } from "react";

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};

// Mock data
const mockCategories = [
  "Science",
  "History",
  "Sports",
  "Movies",
  "Music",
  "Geography",
  "Literature",
  "Technology",
  "Food",
  "Art",
  "Politics",
  "Nature",
];

const mockQuestions = {
  Science: [
    {
      id: 1,
      difficulty: "easy",
      points: 200,
      question: "What is H2O?",
      answer: "Water",
      image: null,
    },
    {
      id: 2,
      difficulty: "easy",
      points: 200,
      question: "What planet is closest to the Sun?",
      answer: "Mercury",
      image: null,
    },
    {
      id: 3,
      difficulty: "medium",
      points: 400,
      question: "What is the chemical symbol for gold?",
      answer: "Au",
      image: null,
    },
    {
      id: 4,
      difficulty: "medium",
      points: 400,
      question: "How many bones are in an adult human body?",
      answer: "206",
      image: null,
    },
    {
      id: 5,
      difficulty: "hard",
      points: 600,
      question: "What is the speed of light in a vacuum?",
      answer: "299,792,458 m/s",
      image: null,
    },
    {
      id: 6,
      difficulty: "hard",
      points: 600,
      question: "What particle has no electric charge?",
      answer: "Neutron",
      image: null,
    },
  ],
  History: [
    {
      id: 7,
      difficulty: "easy",
      points: 200,
      question: "Who was the first President of the United States?",
      answer: "George Washington",
      image: null,
    },
    {
      id: 8,
      difficulty: "easy",
      points: 200,
      question: "In what year did World War II end?",
      answer: "1945",
      image: null,
    },
    {
      id: 9,
      difficulty: "medium",
      points: 400,
      question: "What ancient wonder of the world was located in Alexandria?",
      answer: "The Lighthouse of Alexandria",
      image: null,
    },
    {
      id: 10,
      difficulty: "medium",
      points: 400,
      question: "Who painted the ceiling of the Sistine Chapel?",
      answer: "Michelangelo",
      image: null,
    },
    {
      id: 11,
      difficulty: "hard",
      points: 600,
      question: "What year did the Berlin Wall fall?",
      answer: "1989",
      image: null,
    },
    {
      id: 12,
      difficulty: "hard",
      points: 600,
      question: "Who was the last Pharaoh of Egypt?",
      answer: "Cleopatra VII",
      image: null,
    },
  ],
};

export const GameProvider = ({ children }) => {
  const [room, setRoom] = useState({
    id: null,
    name: "",
    status: "setup", // 'setup', 'playing', 'finished'
    hostId: null,
  });

  const [teams, setTeams] = useState([
    { id: 1, name: "Team Alpha", color: "blue", score: 0, members: [] },
    { id: 2, name: "Team Beta", color: "red", score: 0, members: [] },
  ]);

  const [gameCategories, setGameCategories] = useState([]);
  const [availableCategories] = useState(mockCategories);

  const [currentQuestion, setCurrentQuestion] = useState(null);

  const [timer, setTimer] = useState({
    duration: 30,
    remaining: 30,
    isRunning: false,
    isPaused: false,
  });

  const [ui, setUi] = useState({
    showQuestionModal: false,
    showEndScreen: false,
    showInsufficientModal: false,
  });

  const [gameHistory] = useState([
    {
      id: "1",
      roomName: "Friday Night Trivia",
      date: "2024-01-15",
      teams: ["Team Alpha", "Team Beta"],
      winner: "Team Alpha",
      finalScores: { "Team Alpha": 1200, "Team Beta": 800 },
    },
    {
      id: "2",
      roomName: "Science Showdown",
      date: "2024-01-12",
      teams: ["Scientists", "Engineers", "Doctors"],
      winner: "Engineers",
      finalScores: { Scientists: 1000, Engineers: 1400, Doctors: 600 },
    },
  ]);

  // Game actions
  const createRoom = (roomData) => {
    const newRoom = {
      id: Date.now().toString(),
      name: roomData.name,
      status: "setup",
      hostId: 1, // Mock user ID
    };
    setRoom(newRoom);
    setTeams(roomData.teams || teams);
  };

  const setupGameCategories = (selectedCategories) => {
    const categories = selectedCategories.map((cat, index) => ({
      id: index + 1,
      name: cat.name,
      teamId: cat.teamId,
      questions: (mockQuestions[cat.name] || []).map((q) => ({
        ...q,
        status: "available", // 'available', 'revealed', 'answered'
        answeredBy: null,
      })),
    }));
    setGameCategories(categories);
  };

  const startGame = () => {
    setRoom((prev) => ({ ...prev, status: "playing" }));
  };

  const openQuestionModal = (question) => {
    setCurrentQuestion(question);
    setUi((prev) => ({ ...prev, showQuestionModal: true }));
  };

  const closeQuestionModal = () => {
    setCurrentQuestion(null);
    setUi((prev) => ({ ...prev, showQuestionModal: false }));
    resetTimer();
  };

  const assignPoints = (questionId, teamId, points) => {
    // Update team score
    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId ? { ...team, score: team.score + points } : team
      )
    );

    // Update question status
    setGameCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        questions: cat.questions.map((q) =>
          q.id === questionId
            ? { ...q, status: "answered", answeredBy: teamId }
            : q
        ),
      }))
    );

    closeQuestionModal();

    // Check if game is complete
    setTimeout(() => {
      checkGameComplete();
    }, 100);
  };

  const checkGameComplete = () => {
    const totalQuestions = gameCategories.reduce(
      (acc, cat) => acc + cat.questions.length,
      0
    );
    const answeredQuestions = gameCategories.reduce(
      (acc, cat) =>
        acc + cat.questions.filter((q) => q.status === "answered").length,
      0
    );

    if (totalQuestions > 0 && answeredQuestions === totalQuestions) {
      setRoom((prev) => ({ ...prev, status: "finished" }));
    }
  };

  const startTimer = () => {
    setTimer((prev) => ({ ...prev, isRunning: true, isPaused: false }));
  };

  const pauseTimer = () => {
    setTimer((prev) => ({ ...prev, isRunning: false, isPaused: true }));
  };

  const resetTimer = () => {
    setTimer((prev) => ({
      ...prev,
      remaining: prev.duration,
      isRunning: false,
      isPaused: false,
    }));
  };

  const value = {
    // State
    room,
    teams,
    gameCategories,
    availableCategories,
    currentQuestion,
    timer,
    ui,
    gameHistory,

    // Actions
    createRoom,
    setupGameCategories,
    startGame,
    openQuestionModal,
    closeQuestionModal,
    assignPoints,
    startTimer,
    pauseTimer,
    resetTimer,
    setTeams,
    setRoom,
    setUi,
    checkGameComplete,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
