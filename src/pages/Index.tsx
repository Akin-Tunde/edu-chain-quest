// src/pages/Index.tsx

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Dashboard from "@/components/Dashboard";
import Courses from "@/components/Courses";
import Learning from "@/components/Learning";
import Leaderboard from "@/components/Leaderboard";
import Profile from "@/components/Profile";
import { Admin } from "@/components/Admin";
// --- CHANGE: Import the useAppContext hook ---
import { useAppContext } from "@/contexts/AppContext";

const Index = () => {
  // --- All state management is now handled by the context ---
  const { currentPage, selectedCourseId } = useAppContext();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard": return <Dashboard onNavigate={function (page: string): void {
        throw new Error("Function not implemented.");
      } } />;
      case "courses": return <Courses onNavigate={function (page: string): void {
        throw new Error("Function not implemented.");
      } } />;
      case "learning": return <Learning courseId={selectedCourseId || 1} onNavigate={function (page: string, courseId?: number): void {
        throw new Error("Function not implemented.");
      } } />;
      case "leaderboard": return <Leaderboard />;
      case "profile": return <Profile onNavigate={function (page: string): void {
        throw new Error("Function not implemented.");
      } } />;
      case "admin": return <Admin />;
      default: return <Dashboard onNavigate={function (page: string): void {
        throw new Error("Function not implemented.");
      } } />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* No more props needed for Header and Footer! */}
      <Header currentPage={""} onNavigate={function (page: string): void {
        throw new Error("Function not implemented.");
      } } />
      <main className="container mx-auto px-4 pb-24 lg:pb-8">
        {renderCurrentPage()}
      </main>
      <Footer />
    </div>
  );
};

export default Index; 