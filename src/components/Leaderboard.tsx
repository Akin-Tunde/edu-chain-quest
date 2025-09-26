import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Zap } from "lucide-react";

const Leaderboard = () => {
  const leaderboardData = [
    {
      rank: 1,
      username: "CryptoMaster",
      initials: "CM",
      title: "Diamond Hands",
      tokens: 4250,
      coursesCompleted: 15,
      isCurrentUser: false,
      gradient: "from-yellow-400 to-yellow-600"
    },
    {
      rank: 2,
      username: "BlockchainPro",
      initials: "BP",
      title: "DeFi Expert",
      tokens: 3890,
      coursesCompleted: 14,
      isCurrentUser: false,
      gradient: "from-gray-300 to-gray-500"
    },
    {
      rank: 3,
      username: "SmartContract",
      initials: "SC",
      title: "Code Ninja",
      tokens: 3650,
      coursesCompleted: 13,
      isCurrentUser: false,
      gradient: "from-amber-600 to-amber-800"
    },
    {
      rank: 4,
      username: "DeFiTrader",
      initials: "DT",
      title: "Market Maker",
      tokens: 3200,
      coursesCompleted: 12,
      isCurrentUser: false,
      gradient: "from-primary to-primary-glow"
    },
    {
      rank: 5,
      username: "NFTCollector",
      initials: "NC",
      title: "Digital Artist",
      tokens: 2890,
      coursesCompleted: 11,
      isCurrentUser: false,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      rank: 6,
      username: "Web3Builder",
      initials: "WB",
      title: "dApp Developer",
      tokens: 2650,
      coursesCompleted: 10,
      isCurrentUser: false,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      rank: 7,
      username: "YieldFarmer",
      initials: "YF",
      title: "Pool Master",
      tokens: 2380,
      coursesCompleted: 9,
      isCurrentUser: false,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      rank: 8,
      username: "TokenSwapper",
      initials: "TS",
      title: "Bridge Expert",
      tokens: 2100,
      coursesCompleted: 8,
      isCurrentUser: false,
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      rank: 9,
      username: "StakingPro",
      initials: "SP",
      title: "Validator",
      tokens: 1890,
      coursesCompleted: 8,
      isCurrentUser: false,
      gradient: "from-red-500 to-pink-500"
    },
    {
      rank: 10,
      username: "CryptoLearner",
      initials: "CL",
      title: "Knowledge Seeker",
      tokens: 1650,
      coursesCompleted: 7,
      isCurrentUser: false,
      gradient: "from-teal-500 to-cyan-500"
    },
    {
      rank: 11,
      username: "BlockExplorer",
      initials: "BE",
      title: "Chain Analyst",
      tokens: 1420,
      coursesCompleted: 6,
      isCurrentUser: false,
      gradient: "from-orange-500 to-red-500"
    },
    {
      rank: 12,
      username: "Alex Thompson",
      initials: "AT",
      title: "Rising Star",
      tokens: 1250,
      coursesCompleted: 8,
      isCurrentUser: true,
      gradient: "from-primary to-primary-glow"
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <Card className="glass p-8 text-center">
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Trophy className="w-10 h-10 text-accent animate-glow" />
            <h1 className="text-4xl font-bold gradient-text">Global Leaderboard</h1>
            <Trophy className="w-10 h-10 text-accent animate-glow" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how you stack up against other learners in the EduChain community!
          </p>
        </div>
      </Card>

      {/* Top 3 Podium */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {leaderboardData.slice(0, 3).map((user, index) => (
          <Card 
            key={user.rank}
            className={`glass p-6 text-center hover:scale-105 transition-all duration-300 ${
              index === 0 ? 'md:order-2 card-elevated' : index === 1 ? 'md:order-1' : 'md:order-3'
            }`}
          >
            <div className="space-y-4">
              <div className="flex justify-center">
                {getRankIcon(user.rank)}
              </div>
              
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${user.gradient} flex items-center justify-center text-white font-bold text-xl mx-auto hover:scale-110 transition-transform`}>
                {user.initials}
              </div>
              
              <div>
                <h3 className="text-xl font-bold">{user.username}</h3>
                <Badge variant="outline" className="mt-1">
                  {user.title}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-2xl">💰</span>
                  <span className="text-2xl font-bold gradient-text">
                    {user.tokens.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {user.coursesCompleted} courses completed
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Full Leaderboard */}
      <Card className="glass overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-2xl font-bold flex items-center">
            <Zap className="w-6 h-6 mr-2 text-accent" />
            Complete Rankings
          </h2>
        </div>
        
        <div className="divide-y divide-border">
          {leaderboardData.map((user) => (
            <div
              key={user.rank}
              className={`p-6 hover:bg-secondary/50 transition-all duration-200 ${
                user.isCurrentUser ? 'bg-primary/5 border-l-4 border-l-primary' : ''
              }`}
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Rank */}
                <div className="col-span-1 flex justify-center">
                  {getRankIcon(user.rank)}
                </div>
                
                {/* User Info */}
                <div className="col-span-6 md:col-span-7 flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${user.gradient} flex items-center justify-center text-white font-bold hover:scale-110 transition-transform cursor-pointer`}>
                    {user.initials}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className={`font-bold ${user.isCurrentUser ? 'text-primary' : ''}`}>
                        {user.username}
                      </h3>
                      {user.isCurrentUser && (
                        <Badge variant="default" className="text-xs">
                          You
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.title}</p>
                  </div>
                </div>
                
                {/* Tokens */}
                <div className="col-span-3 md:col-span-2 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <span className="text-lg">💰</span>
                    <span className="font-bold text-lg gradient-text">
                      {user.tokens.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">EDU Tokens</p>
                </div>
                
                {/* Courses */}
                <div className="col-span-2 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <span className="text-lg">📚</span>
                    <span className="font-bold text-lg">{user.coursesCompleted}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Courses</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Call to Action */}
      <Card className="glass p-8 text-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold gradient-text">Climb the Leaderboard!</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Complete more courses and earn EDU tokens to improve your ranking. 
            The top performers get exclusive badges and special recognition!
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Badge variant="outline" className="text-sm py-2 px-4">
              🏆 Top 10: Diamond Status
            </Badge>
            <Badge variant="outline" className="text-sm py-2 px-4">
              🥇 Top 3: Hall of Fame
            </Badge>
            <Badge variant="outline" className="text-sm py-2 px-4">
              👑 #1: Legendary Learner
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Leaderboard;