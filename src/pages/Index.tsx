import { useState } from "react";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import Courses from "@/components/Courses";
import Learning from "@/components/Learning";
import Leaderboard from "@/components/Leaderboard";
import Profile from "@/components/Profile";

const Index = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard onNavigate={setCurrentPage} />;
      case "courses":
        return <Courses onNavigate={setCurrentPage} />;
      case "learning":
        return <Learning onNavigate={setCurrentPage} />;
      case "leaderboard":
        return <Leaderboard />;
      case "profile":
        return <Profile onNavigate={setCurrentPage} />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="container mx-auto px-4 pb-8">
        {renderCurrentPage()}
      </main>
    </div>
  );
};

export default Index;
