
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GraduationCap, Wallet, Menu, X } from "lucide-react";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Header = ({ currentPage, onNavigate }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(true);
  
  // Example wallet address
  const userAddress = "0x1a2B3c4D5e6F7g8H9i0J1k2L3m4N5o6P7q8R";

  // Formatter for the address
  const formattedAddress = isWalletConnected 
    ? `${userAddress.substring(0, 6)}...${userAddress.substring(userAddress.length - 4)}`
    : null;

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "courses", label: "Courses", icon: "📚" },
    { id: "learning", label: "Learning", icon: "🎓" },
    { id: "leaderboard", label: "Leaderboard", icon: "🏆" },
    { id: "profile", label: "Profile", icon: "👤" },
  ];

  const handleWalletClick = () => {
    if (isWalletConnected) {
      setIsWalletConnected(false);
    } else {
      setIsWalletConnected(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full glass rounded-lg mx-4 mt-4 mb-6">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold gradient-text">EduChain</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                    currentPage === item.id
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Desktop Wallet Section */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="glass rounded-lg px-4 py-2">
                <div className="flex items-center space-x-3 divide-x divide-border">
                  <div className="flex items-center space-x-2 pr-3">
                    <span className="text-2xl">💰</span>
                    <span className="font-bold text-lg gradient-text">1,250 EDU</span>
                  </div>
                  {isWalletConnected && (
                    <div className="pl-3">
                      <span className="text-sm font-mono text-muted-foreground">{formattedAddress}</span>
                    </div>
                  )}
                </div>
              </div>
              <Button
                onClick={handleWalletClick}
                variant={isWalletConnected ? "secondary" : "default"}
                className="flex items-center space-x-2"
              >
                <Wallet className="w-4 h-4" />
                <span>
                  {isWalletConnected ? "Disconnect" : "Connect Wallet"}
                </span>
              </Button>
            </div>
            
            {/* Mobile Wallet & Menu Button */}
            <div className="lg:hidden flex items-center space-x-2">
              <div className="glass rounded-lg px-3 py-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">💰</span>
                  <span className="font-bold gradient-text">1,250</span>
                   {isWalletConnected && (
                    <span className="text-xs font-mono text-muted-foreground">{`${userAddress.substring(0, 4)}...${userAddress.substring(userAddress.length - 4)}`}</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pt-4 border-t border-border animate-slide-up">
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                      currentPage === item.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Header;