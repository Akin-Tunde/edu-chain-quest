// src/components/Learning.tsx

import { useState } from "react";
import { useReadContract } from "wagmi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Check, Play, Lock, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CourseRegistryAddress, CourseRegistryABI } from "@/lib/contracts";

interface LearningProps {
  onNavigate: (page: string, courseId?: number) => void; // Updated signature
  courseId: number;
}

// In a real dApp, this detailed metadata would come from an IPFS hash.
// The key (1, 2) corresponds to the courseId on the blockchain.
const courseLessonsMetadata: { [key: number]: any } = {
  1: {
    title: "On-Chain DeFi Fundamentals",
    progress: 65,
    lessons: [
      { id: 1, title: "What is DeFi?", completed: true, locked: false },
      { id: 2, title: "Decentralized Exchanges", completed: true, locked: false },
      { id: 3, title: "Liquidity Pools", completed: false, locked: false, current: true },
      { id: 4, title: "Yield Farming", completed: false, locked: false },
      { id: 5, title: "DeFi Risks", completed: false, locked: true },
      { id: 6, title: "Advanced Strategies", completed: false, locked: true }
    ],
    // For demonstration, the content is static but could be part of the metadata object
    currentLessonContent: {
      title: "Understanding Liquidity Pools",
      videoUrl: "#",
      contentText: "Liquidity pools are one of the core technologies behind many decentralized exchanges..."
    }
  },
  2: {
    title: "On-Chain Smart Contract Security",
    progress: 30,
    lessons: [
      { id: 1, title: "Intro to Security", completed: true, locked: false },
      { id: 2, title: "Common Vulnerabilities", completed: false, locked: false, current: true },
      { id: 3, title: "Auditing Techniques", completed: false, locked: true },
      { id: 4, title: "Formal Verification", completed: false, locked: true },
    ],
    currentLessonContent: {
      title: "Common Vulnerabilities",
      videoUrl: "#",
      contentText: "Understanding common smart contract vulnerabilities like reentrancy and integer overflows is crucial..."
    }
  },
};

const Learning = ({ onNavigate, courseId }: LearningProps) => {
  // We use a fallback to course 1 if the provided courseId is invalid
  const course = courseLessonsMetadata[courseId] || courseLessonsMetadata[1];
  const lessons = course.lessons;
  const currentLessonIndex = lessons.findIndex((l: any) => l.current);

  // Fetch the on-chain data for the specific course ID
  const { isLoading: isOnChainDataLoading } = useReadContract({
    address: CourseRegistryAddress,
    abi: CourseRegistryABI,
    functionName: 'courses',
    args: [BigInt(courseId)],
  });
  
  if (isOnChainDataLoading) {
    return (
      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1"><Skeleton className="h-[500px] w-full" /></div>
        <div className="lg:col-span-3 space-y-6">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-4 gap-6 animate-fade-in">
      {/* Course Sidebar */}
      <div className="lg:col-span-1">
        <Card className="glass p-6 sticky top-8">
          <div className="space-y-6">
            <div>
              <Button variant="ghost" onClick={() => onNavigate('courses')} className="mb-4 p-0 h-auto hover:bg-transparent">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back to Courses
              </Button>
              <h2 className="text-xl font-bold gradient-text">{course.title}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Lesson {currentLessonIndex + 1} of {lessons.length}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Course Progress</span>
                <span className="font-medium">{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-2" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-sm flex items-center"><BookOpen className="w-4 h-4 mr-2" /> Lessons</h3>
              {lessons.map((lesson: any) => (
                <div key={lesson.id} className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${lesson.current ? "bg-primary text-primary-foreground" : lesson.completed ? "bg-success/10" : "hover:bg-secondary"}`}>
                  <div className="flex-shrink-0">
                    {lesson.completed ? <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center"><Check className="w-4 h-4 text-white" /></div> : lesson.current ? <div className="w-6 h-6 rounded-full bg-primary-foreground flex items-center justify-center"><Play className="w-3 h-3 text-primary" /></div> : lesson.locked ? <Lock className="w-5 h-5 text-muted-foreground" /> : <div className="w-6 h-6 rounded-full border-2 border-muted-foreground" />}
                  </div>
                  <span className="text-sm font-medium">{lesson.title}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-3 space-y-6">
        <Card className="glass p-8">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold gradient-text">
              {course.currentLessonContent.title}
            </h1>
            <div className="relative rounded-xl overflow-hidden bg-primary/10 h-80 flex items-center justify-center">
              <Play className="w-16 h-16 text-primary/50" />
              <p className="absolute bottom-4 text-sm text-muted-foreground">Video player placeholder</p>
            </div>
            <p className="text-foreground/80 leading-relaxed">
              {course.currentLessonContent.contentText}
            </p>
          </div>
        </Card>

        {/* Quiz Section (Static for now) */}
        <Card className="glass p-8">
          <h2 className="text-2xl font-bold mb-4">🧠 Knowledge Check</h2>
          <p className="text-muted-foreground">Quiz UI would go here.</p>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" disabled={currentLessonIndex === 0}>
            <ChevronLeft className="w-4 h-4 mr-2" /> Previous Lesson
          </Button>
          <Button>
            Complete Lesson (+50 EDU) <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Learning;