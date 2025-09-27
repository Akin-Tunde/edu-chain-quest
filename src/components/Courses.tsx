import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, Users, Star, Play, ChevronsDown } from "lucide-react";

interface CoursesProps {
  onNavigate: (page: string) => void;
}

const Courses = ({ onNavigate }: CoursesProps) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const INITIAL_VISIBLE_COURSES = 3;
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COURSES);

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
    setVisibleCount(INITIAL_VISIBLE_COURSES);
  };

  const filters = [
    { id: "all", label: "All Courses", count: 12 },
    { id: "defi", label: "DeFi", count: 4 },
    { id: "nfts", label: "NFTs", count: 3 },
    { id: "smart-contracts", label: "Smart Contracts", count: 2 },
    { id: "trading", label: "Trading", count: 2 },
    { id: "beginner", label: "Beginner", count: 5 }
  ];

  const courses = [
    {
      id: 1,
      title: "DeFi Fundamentals",
      description: "Learn the basics of decentralized finance, liquidity pools, and yield farming strategies.",
      icon: "📊",
      difficulty: "Beginner",
      duration: "6 modules • 8 hours",
      reward: 400,
      enrolled: 1230,
      rating: 4.8,
      categories: ["defi", "beginner"],
      progress: 65
    },
    {
      id: 2,
      title: "Smart Contract Security",
      description: "Master smart contract vulnerabilities, auditing techniques, and best practices.",
      icon: "🔒",
      difficulty: "Advanced",
      duration: "8 modules • 12 hours",
      reward: 600,
      enrolled: 890,
      rating: 4.9,
      categories: ["smart-contracts"],
      progress: 30
    },
    {
      id: 3,
      title: "NFT Creation & Trading",
      description: "Create, mint, and trade NFTs. Learn about marketplaces and digital ownership.",
      icon: "🎨",
      difficulty: "Intermediate",
      duration: "5 modules • 6 hours",
      reward: 350,
      enrolled: 2100,
      rating: 4.7,
      categories: ["nfts"],
      progress: 0
    },
    {
      id: 4,
      title: "Crypto Trading Strategies",
      description: "Technical analysis, risk management, and advanced trading techniques.",
      icon: "📈",
      difficulty: "Intermediate",
      duration: "7 modules • 10 hours",
      reward: 500,
      enrolled: 1560,
      rating: 4.6,
      categories: ["trading"],
      progress: 0
    },
    {
      id: 5,
      title: "Blockchain Basics",
      description: "Understanding blockchain technology, consensus mechanisms, and cryptocurrencies.",
      icon: "⛓️",
      difficulty: "Beginner",
      duration: "4 modules • 5 hours",
      reward: 250,
      enrolled: 3200,
      rating: 4.8,
      categories: ["beginner"],
      progress: 100
    },
    {
      id: 6,
      title: "Web3 Development",
      description: "Build decentralized applications using modern Web3 frameworks and tools.",
      icon: "💻",
      difficulty: "Advanced",
      duration: "10 modules • 15 hours",
      reward: 750,
      enrolled: 760,
      rating: 4.9,
      categories: ["smart-contracts"],
      progress: 0
    }
  ];

  const filteredCourses = courses.filter(course => 
    activeFilter === "all" || course.categories.includes(activeFilter)
  );

  const coursesToShow = filteredCourses.slice(0, visibleCount);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-success/10 text-success";
      case "Intermediate": return "bg-accent/10 text-accent-foreground";
      case "Advanced": return "bg-destructive/10 text-destructive";
      default: return "bg-muted/10 text-muted-foreground";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold gradient-text">Course Catalog</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Master blockchain technology with our comprehensive courses. Earn EDU tokens as you learn!
        </p>
      </div>

      {/* Filter Bar */}
      <Card className="glass p-6">
        <div className="flex flex-wrap gap-3 justify-center">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              onClick={() => handleFilterChange(filter.id)}
              className="hover:scale-105 transition-all duration-200"
            >
              {filter.label}
              <Badge 
                variant="secondary" 
                className="ml-2 text-xs"
              >
                {filter.count}
              </Badge>
            </Button>
          ))}
        </div>
      </Card>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coursesToShow.map((course) => (
          <Card 
            key={course.id}
            className="glass hover:scale-[1.02] transition-all duration-300 cursor-pointer group overflow-hidden"
            onClick={() => onNavigate('learning')}
          >
            {/* Course Thumbnail */}
            <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary-glow/20 flex items-center justify-center">
              <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                {course.icon}
              </div>
              {course.progress > 0 && (
                <div className="absolute top-4 right-4">
                  <Badge 
                    variant={course.progress === 100 ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {course.progress === 100 ? "✓ Completed" : `${course.progress}% Complete`}
                  </Badge>
                </div>
              )}
              <div className="absolute top-4 left-4">
                <Badge className={getDifficultyColor(course.difficulty)}>
                  {course.difficulty}
                </Badge>
              </div>
            </div>

            {/* Course Content */}
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {course.description}
                </p>
              </div>

              {/* Course Stats */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration.split('•')[1]?.trim()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.duration.split('•')[0]?.trim()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{course.enrolled.toLocaleString()}</span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span className="font-medium">{course.rating}</span>
                  <span className="text-muted-foreground text-sm">
                    ({course.enrolled.toLocaleString()} students)
                  </span>
                </div>
                <span className="reward-badge text-sm">
                  +{course.reward} EDU
                </span>
              </div>

              {/* Action Button */}
              <Button 
                className="w-full group/btn hover:scale-105 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('learning');
                }}
              >
                <Play className="w-4 h-4 mr-2 group-hover/btn:translate-x-1 transition-transform" />
                {course.progress > 0 && course.progress < 100 
                  ? "Continue Learning" 
                  : course.progress === 100 
                    ? "Review Course" 
                    : "Start Learning"
                }
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Show More Button */}
      {filteredCourses.length > visibleCount && (
        <div className="text-center mt-8">
          <Button
            size="lg"
            variant="outline"
            onClick={() => setVisibleCount(filteredCourses.length)}
            className="hover:scale-105 transition-all"
          >
            Show More Courses
            <ChevronsDown className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}

      {/* Call to Action */}
      <Card className="glass p-8 text-center mt-8">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl font-bold gradient-text">Ready to Start Learning?</h2>
          <p className="text-muted-foreground">
            Join thousands of learners earning tokens while mastering blockchain technology. 
            Start with our beginner-friendly courses!
          </p>
          <Button 
            size="lg" 
            className="hover:scale-105 transition-all"
            onClick={() => onNavigate('learning')}
          >
            Start Your Journey
            <Play className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Courses;