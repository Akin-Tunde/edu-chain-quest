// src/components/Profile.tsx

import { useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "viem";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Award, TrendingUp, BookOpen, Target, Zap, Trophy, ChevronsDown, ChevronsUp } from "lucide-react";
import { EDUStakingAddress, EDUStakingABI } from "@/lib/contracts";
import { StakingCard } from "./StakingCard";
import { RewardCard } from "./RewardCard";
import { MyCoursesList } from "./MyCoursesList"; 

interface ProfileProps {
  onNavigate: (page: string) => void;
}

const Profile = ({ onNavigate }: ProfileProps) => {
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const INITIAL_VISIBLE_ACHIEVEMENTS = 4;
  const { address } = useAccount();

  // Fetch the user's total staked balance
  const { data: stakedBalance, isLoading: isStakedBalanceLoading } = useReadContract({
      address: EDUStakingAddress,
      abi: EDUStakingABI,
      functionName: 'getTotalStakedForUser',
      args: [address!],
      query: { enabled: !!address },
  });

  const formattedStakedBalance = stakedBalance
    ? parseFloat(formatUnits(stakedBalance, 18)).toLocaleString('en-US', { maximumFractionDigits: 2 })
    : "0";

  // Static data for demonstration
  const user = {
    name: "Alex Thompson",
    initials: "AT",
    memberSince: "January 2024",   
    status: "Rising Star",
    totalTokens: 1250,
    coursesCompleted: 8,
    hoursLearned: 45,
    currentStreak: 7,
    globalRank: 12
  };

  const achievements = [
    { id: 1, icon: "🎓", title: "First Course", description: "Completed your first course", unlocked: true, unlockedDate: "Jan 15, 2024" },
    { id: 2, icon: "🔥", title: "Streak Master", description: "7 days learning streak", unlocked: true, unlockedDate: "Feb 8, 2024" },
    { id: 3, icon: "💎", title: "Token Collector", description: "Earned 1,000+ EDU tokens", unlocked: true, unlockedDate: "Feb 20, 2024" },
    { id: 4, icon: "⭐", title: "Rising Star", description: "Reached top 20 on leaderboard", unlocked: true, unlockedDate: "Mar 5, 2024" },
    { id: 5, icon: "📚", title: "Knowledge Seeker", description: "Complete 10 courses", unlocked: false, progress: 80 },
    { id: 6, icon: "🏆", title: "Top Performer", description: "Reach top 10 on leaderboard", unlocked: false, progress: 0 },
  ];

  const recentActivity = [
    { type: "course_completed", title: "Completed 'Blockchain Basics'", reward: 250, date: "2 days ago", icon: "✅" },
    { type: "quiz_perfect", title: "Perfect score on DeFi quiz", reward: 50, date: "3 days ago", icon: "🎯" },
    { type: "streak_milestone", title: "7-day learning streak!", reward: 100, date: "5 days ago", icon: "🔥" },
  ];

  const achievementsToShow = showAllAchievements ? achievements : achievements.slice(0, INITIAL_VISIBLE_ACHIEVEMENTS);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Profile Header */}
      <Card className="glass p-8">
        <div className="flex flex-row items-start space-x-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-white text-4xl font-bold">
            {user.initials}
          </div>
          <div className="flex-1 text-left space-y-4">
            <div>
              <h1 className="text-3xl font-bold gradient-text">{user.name}</h1>
              <div className="flex flex-wrap items-center justify-start gap-x-2 gap-y-1 mt-2">
                <Badge variant="default" className="flex items-center space-x-1"><Award className="w-3 h-3" /><span>{user.status}</span></Badge>
                <span className="text-muted-foreground">•</span>
                <div className="flex items-center space-x-1 text-muted-foreground"><Calendar className="w-4 h-4" /><span>Member since {user.memberSince}</span></div>
              </div>
            </div>
            <div className="flex flex-row flex-wrap items-center gap-x-6 gap-y-2">
              <div className="flex items-center space-x-2"><span className="text-2xl">🎯</span><span className="text-lg">Total Earned: <span className="font-bold gradient-text">{user.totalTokens.toLocaleString()} EDU</span></span></div>
              <div className="flex items-center space-x-2"><span className="text-2xl">📚</span><span className="text-lg">Courses Completed: <span className="font-bold">{user.coursesCompleted}</span></span></div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass p-6 text-center"><div className="text-3xl mb-2">💰</div><div className="text-2xl font-bold gradient-text">{isStakedBalanceLoading ? "..." : formattedStakedBalance}</div><div className="text-sm text-muted-foreground">Total Staked</div></Card>
        <Card className="glass p-6 text-center"><div className="text-3xl mb-2">🔥</div><div className="text-2xl font-bold gradient-text">{user.currentStreak}</div><div className="text-sm text-muted-foreground">Day Streak</div></Card>
        <Card className="glass p-6 text-center"><div className="text-3xl mb-2">🏆</div><div className="text-2xl font-bold gradient-text">#{user.globalRank}</div><div className="text-sm text-muted-foreground">Global Rank</div></Card>
        <Card className="glass p-6 text-center"><div className="text-3xl mb-2">🎖️</div><div className="text-2xl font-bold gradient-text">{achievements.filter(a => a.unlocked).length}</div><div className="text-sm text-muted-foreground">Achievements</div></Card>
      </div>

      {/* Reward and Staking Cards */}
      <div className="grid lg:grid-cols-2 gap-8">
        <RewardCard />
        <StakingCard />
      </div>

      {/* --- THIS IS THE NEW TABS SECTION --- */}
      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="achievements">Achievements & Activity</TabsTrigger>
          <TabsTrigger value="my-courses">My Courses</TabsTrigger>
        </TabsList>

        {/* Tab 1: Existing Achievements and Activity */}
        <TabsContent value="achievements">
          <div className="grid lg:grid-cols-3 gap-8 mt-4">
            <div className="lg:col-span-2">
              <Card className="glass p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center"><Trophy className="w-6 h-6 mr-2 text-accent" />Achievements</h2>
                  <Badge variant="outline">{achievements.filter(a => a.unlocked).length} / {achievements.length}</Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {achievementsToShow.map((achievement) => (
                    <div key={achievement.id} className={`p-4 rounded-lg border-2 ${achievement.unlocked ? "border-success bg-success/5" : "border-muted bg-muted/5 opacity-75"}`}>
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`text-2xl ${achievement.unlocked ? "" : "grayscale"}`}>{achievement.icon}</div>
                        <div>
                          <h3 className="font-semibold">{achievement.title}</h3>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                      {achievement.unlocked ? (
                        <div className="flex items-center space-x-2 text-xs text-success"><Zap className="w-3 h-3" /><span>Unlocked {achievement.unlockedDate}</span></div>
                      ) : achievement.progress ? (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs"><span className="text-muted-foreground">Progress</span><span className="font-medium">{achievement.progress}%</span></div>
                          <div className="w-full bg-muted rounded-full h-1.5"><div className="bg-primary h-1.5 rounded-full" style={{ width: `${achievement.progress}%` }} /></div>
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground flex items-center"><Target className="w-3 h-3 mr-1" />Keep learning!</div>
                      )}
                    </div>
                  ))}
                </div>
                {achievements.length > INITIAL_VISIBLE_ACHIEVEMENTS && (
                  <div className="mt-6 text-center">
                    <Button variant="outline" onClick={() => setShowAllAchievements(!showAllAchievements)}>
                      {showAllAchievements ? "Show Less" : "Show More"}
                      {showAllAchievements ? <ChevronsUp className="w-4 h-4 ml-2" /> : <ChevronsDown className="w-4 h-4 ml-2" />}
                    </Button>
                  </div>
                )}
              </Card>
            </div>
            <div className="lg:col-span-1">
              <Card className="glass p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center"><TrendingUp className="w-5 h-5 mr-2 text-primary" />Recent Activity</h2>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-secondary/50">
                      <div className="text-xl">{activity.icon}</div>
                      <div>
                        <p className="text-sm font-medium">{activity.title}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-muted-foreground">{activity.date}</span>
                          {activity.reward > 0 && <Badge variant="outline" className="text-xs reward-badge">+{activity.reward} EDU</Badge>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" onClick={() => onNavigate('dashboard')}><BookOpen className="w-4 h-4 mr-2" />Continue Learning</Button>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: New "My Courses" List */}
        <TabsContent value="my-courses">
          <Card className="mt-4">
            <CardHeader>
              <h2 className="text-2xl font-bold">My Learning Journey</h2>
            </CardHeader>
            <CardContent>
              <MyCoursesList onNavigate={onNavigate} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;