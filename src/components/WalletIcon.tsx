// src/components/WalletIcon.tsx

import { Wallet } from "lucide-react";

// A simple component to return an icon based on the wallet connector's ID
export const WalletIcon = ({ connectorId, className }: { connectorId: string, className: string }) => {
    // Wagmi standard IDs: 'io.metamask', 'com.coinbase.wallet', 'walletConnect'
    switch (connectorId) {
        // We can add specific SVG icons here later if desired
        default:
            return <Wallet className={className} />;
    }
};