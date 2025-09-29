// src/components/ConnectButton.tsx

// --- CHANGE 1: Import useState to control the dialog ---
import { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WalletIcon } from './WalletIcon';

export function ConnectButton() {
  const { address, isConnected, status: accountStatus } = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();
  
  // --- CHANGE 2: Add state to manage the dialog's visibility ---
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (isConnected) {
    return (
      <Button variant="secondary" onClick={() => disconnect()} className="flex items-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="font-mono text-sm">{`${address?.slice(0, 6)}...${address?.slice(-4)}`}</span>
      </Button>
    );
  }

  // --- CHANGE 3: Control the Dialog component with our state ---
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
         <Button variant="default" className="flex items-center space-x-2">
           <Wallet className="w-4 h-4" />
           <span>Connect Wallet</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs sm:max-w-sm rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-center">Connect Wallet</DialogTitle>
          <DialogDescription className="text-center">
            Choose a wallet provider to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-3 pt-4">
          {connectors.map((connector) => (
            <Button
              key={connector.uid}
              // --- CHANGE 4: Close the dialog when a connector is clicked ---
              onClick={() => {
                connect({ connector });
                setIsDialogOpen(false); // This is the key fix
              }}
              variant="outline"
              className="w-full flex justify-start items-center text-base h-14"
              disabled={accountStatus === 'connecting'}
            >
              <WalletIcon connectorId={connector.id} className="w-6 h-6 mr-4" />
              {connector.name}
            </Button>
          ))}
        </div>
        {status === 'pending' && <p className="text-center text-sm text-muted-foreground mt-2">Connecting...</p>}
        {error && <p className="text-center text-sm text-destructive mt-2">{error.message}</p>}
      </DialogContent>
    </Dialog>
  );
}