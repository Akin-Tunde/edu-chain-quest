// src/components/Header.tsx

import { useState } from "react";
import { GraduationCap, Menu, Wallet, X } from "lucide-react";
import { formatUnits } from "viem";
import { useAccount, useConnect, useDisconnect, useReadContract } from "wagmi";

import { Button } from "@/components/ui/button";
import { EDUTokenAddress, EDUTokenABI } from "@/lib/contracts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WalletIcon } from "./WalletIcon";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Header = ({ currentPage, onNavigate }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { address, isConnected } = useAccount();
  const { connect, connectors, status, error } = useConnect();
  const { disconnect } = useDisconnect();

  const { data: balance, isLoading: isBalanceLoading } = useReadContract({
    address: EDUTokenAddress,
    abi: EDUTokenABI,
    functionName: 'balanceOf',
    args: [address!],
    query: { enabled: isConnected && !!address },
  });

  const formattedAddress = isConnected && address
    ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
    : null;
    
  const formattedBalance = balance
    ? parseFloat(formatUnits(balance, 18)).toLocaleString('en-US', { maximumFractionDigits: 0 })
    : "0";

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "courses", label: "Courses", icon: "📚" },
    { id: "learning", label: "Learning", icon: "🎓" },
    { id: "leaderboard", label: "Leaderboard", icon: "🏆" },
    { id: "profile", label: "Profile", icon: "👤" },
    
    { id: "admin", label: "Admin", icon: "⚙️" },
  ];

  const connectDialogContent = (
    <>
      <DialogHeader>
        <DialogTitle>Connect a Wallet</DialogTitle>
        <DialogDescription>Choose your preferred wallet to continue.</DialogDescription>
      </DialogHeader>
      <div className="flex flex-col space-y-3 pt-4">
        {connectors.map((connector) => (
          <Button
            key={connector.uid}
            onClick={() => {
              connect({ connector });
              setIsModalOpen(false);
            }}
            variant="outline"
            className="w-full flex justify-start items-center text-base h-14"
          >
            <WalletIcon connectorId={connector.id} className="w-6 h-6 mr-4" />
            {connector.name}
          </Button>
        ))}
      </div>
      {status === 'pending' && <p className="text-center text-sm text-muted-foreground mt-2">Connecting...</p>}
      {error && <p className="text-center text-sm text-destructive mt-2">{error.message}</p>}
    </>
  );

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
              {isConnected ? (
                <>
                  <div className="glass rounded-lg px-4 py-2">
                    <div className="flex items-center space-x-3 divide-x divide-border">
                      <div className="flex items-center space-x-2 pr-3">
                        <span className="text-2xl">💰</span>
                        <span className="font-bold text-lg gradient-text">
                          {isBalanceLoading ? "..." : formattedBalance} EDU
                        </span>
                      </div>
                      <div className="pl-3">
                        <span className="text-sm font-mono text-muted-foreground">{formattedAddress}</span>
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => disconnect()} variant="secondary">Disconnect</Button>
                </>
              ) : (
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button><Wallet className="w-4 h-4 mr-2" />Connect Wallet</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    {connectDialogContent}
                  </DialogContent>
                </Dialog>
              )}
            </div>
            
            {/* --- CORRECTED: Mobile Wallet & Menu Button --- */}
            <div className="lg:hidden flex items-center space-x-2">
               {isConnected && address && (
                <div className="glass rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">💰</span>
                    <span className="font-bold gradient-text">
                      {isBalanceLoading ? "..." : formattedBalance}
                    </span>
                    {/* THIS IS THE CORRECTED LINE */}
                    <span className="text-xs font-mono text-muted-foreground">{`${address.substring(0, 4)}...${address.substring(address.length - 4)}`}</span>
                  </div>
                </div>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pt-4 border-t border-border animate-slide-up">
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <button key={item.id} onClick={() => { onNavigate(item.id); setIsMobileMenuOpen(false); }} className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${currentPage === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
                
                <div className="pt-2">
                  {isConnected ? (
                     <Button onClick={() => disconnect()} variant="secondary" className="w-full">
                       Disconnect ({formattedAddress})
                     </Button>
                  ) : (
                     <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                       <DialogTrigger asChild>
                         <Button className="w-full"><Wallet className="w-4 h-4 mr-2" />Connect Wallet</Button>
                       </DialogTrigger>
                       <DialogContent>
                         {connectDialogContent}
                       </DialogContent>
                     </Dialog>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
      
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