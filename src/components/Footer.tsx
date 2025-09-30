import {
  Home,
  BookOpen,
  GraduationCap,
  BarChart3,
  User,
} from "lucide-react";

import { useAppContext } from "@/contexts/AppContext";

const Footer = () => {
  const { currentPage, navigate } = useAppContext();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <Home className="w-6 h-6" /> },
    { id: "courses", label: "Courses", icon: <BookOpen className="w-6 h-6" /> },
    { id: "learning", label: "Learning", icon: <GraduationCap className="w-6 h-6" /> },
    { id: "leaderboard", label: "Leaderboard", icon: <BarChart3 className="w-6 h-6" /> },
    { id: "profile", label: "Profile", icon: <User className="w-6 h-6" /> },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 border-t lg:hidden glass border-border">
      <nav className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            className={`flex h-full w-full flex-col items-center justify-center gap-1 rounded-lg text-xs font-medium transition-colors ${
              currentPage === item.id
                ? "text-primary"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </footer>
  );
};

export default Footer;
