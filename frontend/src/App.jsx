import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { GameProvider } from "./contexts/GameContext";
import AuthScreen from "./screens/AuthScreen";
import Dashboard from "./screens/Dashboard";
import RoomSetup from "./screens/RoomSetup";
import GameBoard from "./screens/GameBoard";

function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Routes>
              <Route path="/" element={<AuthScreen />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/room-setup" element={<RoomSetup />} />
              <Route path="/game/:roomId" element={<GameBoard />} />
            </Routes>
            <Toaster position="top-right" />
          </div>
        </Router>
      </GameProvider>
    </AuthProvider>
  );
}

export default App;
