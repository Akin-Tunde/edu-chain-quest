import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
      <main className="container mx-auto px-4 pb-24 lg:pb-8">
        {renderCurrentPage()}
      </main>
      <Footer currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
};

export default Index;