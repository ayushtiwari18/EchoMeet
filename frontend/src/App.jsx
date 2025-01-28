import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Authentication from "./pages/login.jsx";
import VideoMeet from "./pages/VideoMeet";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import { AuthProvider } from "./contexts/AuthContect";
import HomeComponent from "./pages/home";
import History from "./pages/history";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Authentication />} />
            <Route path="/home" element={<HomeComponent />} />
            <Route path="/history" element={<History />} />
            <Route path="/:url" element={<VideoMeet />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
