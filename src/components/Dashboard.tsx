import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy, Clock, BookOpen, Coins } from "lucide-react";

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const Dashboard = ({ onNavigate }: DashboardProps) => {
  const stats = [
    {
      icon: <Coins className="w-8 h-8 text-accent" />,
      value: "1,250",
      label: "EDU Tokens Earned",
      change: "+200 this week"
    },
    {
      icon: <BookOpen className="w-8 h-8 text-success" />,
      value: "8",
      label: "Courses Completed",
      change: "2 in progress"
    },
    {
      icon: <Clock className="w-8 h-8 text-primary" />,
      value: "45",
      label: "Hours Learned",
      change: "+8 this week"
    },
    {
      icon: <Trophy className="w-8 h-8 text-accent" />,
      value: "#12",
      label: "Global Ranking",
      change: "↑ 3 positions"
    }
  ];

  const currentCourses = [
    {
      title: "DeFi Fundamentals",
      progress: 65,
      nextLesson: "Liquidity Pools",
      reward: 200,
      modules: { completed: 4, total: 6 }
    },
    {
      title: "Smart Contract Security",
      progress: 30,
      nextLesson: "Common Vulnerabilities",
      reward: 300,
      modules: { completed: 2, total: 8 }
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <Card className="glass card-elevated p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Welcome back, Alex! 👋
          </h1>
          <p className="text-xl text-muted-foreground">
            Ready to continue your crypto learning journey? You're doing amazing!
          </p>
        </div>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card 
            key={index} 
            className="glass p-6 hover:scale-105 transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-secondary group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold gradient-text">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.change}
                </div>
              </div>
            </div>
            <h3 className="font-semibold text-foreground">
              {stat.label}
            </h3>
          </Card>
        ))}
      </div>

      {/* Current Courses Progress */}
      <Card className="glass p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <span>📚</span>
            <span>Continue Learning</span>
          </h2>
          <Button 
            variant="outline" 
            onClick={() => onNavigate('courses')}
            className="hover:scale-105 transition-transform"
          >
            View All Courses
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {currentCourses.map((course, index) => (
            <div 
              key={index}
              className="glass rounded-xl p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              onClick={() => onNavigate('learning')}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">{course.title}</h3>
                <span className="reward-badge">
                  +{course.reward} EDU
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="text-muted-foreground">
                    Next: <span className="text-foreground font-medium">{course.nextLesson}</span>
                  </div>
                  <div className="text-muted-foreground">
                    {course.modules.completed}/{course.modules.total} modules
                  </div>
                </div>

                <Button 
                  className="w-full mt-4 group hover:scale-105 transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('learning');
                  }}
                >
                  Continue Learning
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card 
          className="glass p-6 hover:scale-105 transition-all cursor-pointer group"
          onClick={() => onNavigate('courses')}
        >
          <div className="text-center">
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🎯</div>
            <h3 className="font-semibold mb-2">Explore New Courses</h3>
            <p className="text-sm text-muted-foreground">Discover blockchain topics</p>
          </div>
        </Card>

        <Card 
          className="glass p-6 hover:scale-105 transition-all cursor-pointer group"
          onClick={() => onNavigate('leaderboard')}
        >
          <div className="text-center">
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🏆</div>
            <h3 className="font-semibold mb-2">Check Leaderboard</h3>
            <p className="text-sm text-muted-foreground">See your ranking</p>
          </div>
        </Card>

        <Card 
          className="glass p-6 hover:scale-105 transition-all cursor-pointer group"
          onClick={() => onNavigate('profile')}
        >
          <div className="text-center">
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">⭐</div>
            <h3 className="font-semibold mb-2">View Achievements</h3>
            <p className="text-sm text-muted-foreground">Track your progress</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;