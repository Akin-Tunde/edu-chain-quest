// src/contexts/AppContext.tsx

import { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of our context data
interface AppContextType {
  currentPage: string;
  selectedCourseId: number | null;
  navigate: (page: string, courseId?: number) => void;
}

// Create the context with a default value of null
const AppContext = createContext<AppContextType | null>(null);

// Create the Provider component
// This component will wrap our application and provide the context data
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(1);

  const navigate = (page: string, courseId?: number) => {
    setCurrentPage(page);
    if (courseId !== undefined) {
      setSelectedCourseId(courseId);
    }
  };

  const value = {
    currentPage,
    selectedCourseId,
    navigate,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Create a custom hook for easy access to the context
// Components will use this instead of `useContext(AppContext)`
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};