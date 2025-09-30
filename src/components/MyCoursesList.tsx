// src/components/MyCoursesList.tsx

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight } from "lucide-react";

interface MyCoursesListProps {
  onNavigate: (page: string) => void;
}

// In a real dApp, this user progress data would be fetched from a backend database.
// For now, we use a hardcoded list to demonstrate the UI.
const userCourses = [
  {
    id: 1,
    title: "On-Chain DeFi Fundamentals",
    progress: 65,
    nextLesson: "Liquidity Pools",
  },
  {
    id: 2,
    title: "On-Chain Smart Contract Security",
    progress: 30,
    nextLesson: "Common Vulnerabilities",
  },
  {
    id: 5, // Assuming a course with ID 5 was completed
    title: "Blockchain Basics",
    progress: 100,
    nextLesson: "Course Complete!",
  }
];

export const MyCoursesList = ({ onNavigate }: MyCoursesListProps) => {
  if (userCourses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">You haven't enrolled in any courses yet.</p>
        <Button onClick={() => onNavigate('courses')}>Browse Courses</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {userCourses.map((course) => (
        <div key={course.id} className="p-4 border rounded-lg flex items-center justify-between hover:bg-secondary/50">
          <div className="w-full mr-4">
            <div className="flex justify-between mb-2">
              <h3 className="font-semibold">{course.title}</h3>
              <span className={`text-sm font-medium ${course.progress === 100 ? 'text-success' : 'text-primary'}`}>
                {course.progress}%
              </span>
            </div>
            <Progress value={course.progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Next Up: {course.nextLesson}
            </p>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            className="flex-shrink-0 group"
            onClick={() => onNavigate('learning')}
          >
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      ))}
    </div>
  );
};