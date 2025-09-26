import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Check, Play, Lock, BookOpen } from "lucide-react";

interface LearningProps {
  onNavigate: (page: string) => void;
}

const Learning = ({ onNavigate }: LearningProps) => {
  const [currentLesson, setCurrentLesson] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const course = {
    title: "DeFi Fundamentals",
    totalLessons: 6,
    progress: 50
  };

  const lessons = [
    { id: 1, title: "What is DeFi?", completed: true, locked: false },
    { id: 2, title: "Decentralized Exchanges", completed: true, locked: false },
    { id: 3, title: "Liquidity Pools", completed: false, locked: false, current: true },
    { id: 4, title: "Yield Farming", completed: false, locked: false },
    { id: 5, title: "DeFi Risks", completed: false, locked: true },
    { id: 6, title: "Advanced Strategies", completed: false, locked: true }
  ];

  const currentLessonData = {
    title: "Understanding Liquidity Pools",
    content: `
      Liquidity pools are one of the core technologies behind many decentralized exchanges and DeFi protocols. 
      They are essentially smart contracts that hold tokens and provide liquidity for trading.

      ## How Liquidity Pools Work

      Instead of relying on traditional order books, decentralized exchanges use liquidity pools to facilitate trades. 
      Users called "liquidity providers" deposit pairs of tokens into these pools, earning fees from trades in return.

      ## Key Benefits

      - **24/7 Trading**: No need to wait for matching buyers and sellers
      - **Passive Income**: Earn fees from providing liquidity  
      - **Decentralized**: No central authority controls the pool
      - **Programmable**: Smart contracts automate all operations

      ## Popular Pool Types

      Most liquidity pools follow the 50/50 ratio model, but newer protocols offer various ratios and single-asset pools.
    `,
    quiz: {
      question: "What is the main purpose of liquidity pools in DeFi?",
      options: [
        "To store cryptocurrencies safely",
        "To provide liquidity for decentralized trading",
        "To mine new tokens",
        "To stake tokens for governance"
      ],
      correctAnswer: 1,
      explanation: "Liquidity pools provide the tokens needed for decentralized exchanges to function without traditional order books."
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
  };

  const handleNextLesson = () => {
    if (currentLesson < course.totalLessons) {
      setCurrentLesson(currentLesson + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLesson > 1) {
      setCurrentLesson(currentLesson - 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-4 gap-6 animate-fade-in">
      {/* Course Sidebar */}
      <div className="lg:col-span-1">
        <Card className="glass p-6 sticky top-8">
          <div className="space-y-6">
            {/* Course Header */}
            <div>
              <Button
                variant="ghost"
                onClick={() => onNavigate('courses')}
                className="mb-4 p-0 h-auto hover:bg-transparent"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Courses
              </Button>
              <h2 className="text-xl font-bold gradient-text">{course.title}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Lesson {currentLesson} of {course.totalLessons}
              </p>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Course Progress</span>
                <span className="font-medium">{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-2" />
            </div>

            {/* Lesson Navigation */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm flex items-center">
                <BookOpen className="w-4 h-4 mr-2" />
                Lessons
              </h3>
              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    lesson.current
                      ? "bg-primary text-primary-foreground"
                      : lesson.completed
                      ? "bg-success/10 hover:bg-success/20"
                      : lesson.locked
                      ? "bg-muted/50 cursor-not-allowed opacity-50"
                      : "hover:bg-secondary"
                  }`}
                  onClick={() => !lesson.locked && setCurrentLesson(lesson.id)}
                >
                  <div className="flex-shrink-0">
                    {lesson.completed ? (
                      <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    ) : lesson.current ? (
                      <div className="w-6 h-6 rounded-full bg-primary-foreground flex items-center justify-center">
                        <Play className="w-3 h-3 text-primary" />
                      </div>
                    ) : lesson.locked ? (
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-muted-foreground" />
                    )}
                  </div>
                  <span className={`text-sm font-medium ${
                    lesson.locked ? "text-muted-foreground" : ""
                  }`}>
                    {lesson.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-3 space-y-6">
        {/* Lesson Content */}
        <Card className="glass p-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold gradient-text">
                {currentLessonData.title}
              </h1>
              <Badge variant="outline" className="text-sm">
                Lesson {currentLesson}
              </Badge>
            </div>

            {/* Video Placeholder */}
            <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary-glow/20 h-64 flex items-center justify-center group cursor-pointer">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-primary ml-1" />
                </div>
                <p className="text-lg font-medium">Watch Video Lesson</p>
                <p className="text-sm text-muted-foreground">5:30 minutes</p>
              </div>
            </div>

            {/* Lesson Content */}
            <div className="prose prose-slate max-w-none">
              {currentLessonData.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('##')) {
                  return (
                    <h3 key={index} className="text-xl font-bold mt-8 mb-4 gradient-text">
                      {paragraph.replace('##', '').trim()}
                    </h3>
                  );
                } else if (paragraph.startsWith('-')) {
                  const items = paragraph.split('\n').filter(item => item.startsWith('-'));
                  return (
                    <ul key={index} className="space-y-2 my-4">
                      {items.map((item, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          {item.replace('-', '').trim()}
                        </li>
                      ))}
                    </ul>
                  );
                } else if (paragraph.trim()) {
                  return (
                    <p key={index} className="text-foreground leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </Card>

        {/* Quiz Section */}
        <Card className="glass p-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center">
              <span className="text-2xl mr-3">🧠</span>
              Knowledge Check
            </h2>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{currentLessonData.quiz.question}</h3>
              
              <div className="grid gap-3">
                {currentLessonData.quiz.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                    className={`p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                      showResult
                        ? index === currentLessonData.quiz.correctAnswer
                          ? "border-success bg-success/10 text-success"
                          : selectedAnswer === index
                          ? "border-destructive bg-destructive/10 text-destructive"
                          : "border-muted bg-muted/5"
                        : selectedAnswer === index
                        ? "border-primary bg-primary/10"
                        : "border-muted hover:border-primary/50 hover:bg-primary/5"
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full border-2 border-current mr-3 flex items-center justify-center text-xs font-bold">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </div>
                  </button>
                ))}
              </div>

              {showResult && (
                <div className={`p-4 rounded-lg ${
                  selectedAnswer === currentLessonData.quiz.correctAnswer
                    ? "bg-success/10 border border-success"
                    : "bg-destructive/10 border border-destructive"
                }`}>
                  <p className="font-medium mb-2">
                    {selectedAnswer === currentLessonData.quiz.correctAnswer 
                      ? "🎉 Correct!" 
                      : "❌ Incorrect"
                    }
                  </p>
                  <p className="text-sm">{currentLessonData.quiz.explanation}</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousLesson}
            disabled={currentLesson === 1}
            className="hover:scale-105 transition-all"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous Lesson
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Lesson {currentLesson} of {course.totalLessons}
            </p>
          </div>

          <Button
            onClick={handleNextLesson}
            disabled={!showResult || currentLesson === course.totalLessons}
            className="hover:scale-105 transition-all group"
          >
            Complete Lesson (+50 EDU)
            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Learning;