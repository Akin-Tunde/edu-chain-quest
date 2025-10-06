// src/main.tsx

import { StrictMode } from 'react';
import { createRoot } from "react-dom/client";
import { WagmiProvider } from "wagmi";
// CHANGE 1: Import QueryClient from @tanstack/react-query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// CHANGE 2: Import the 'config' object you actually exported from wagmi.ts
import { config } from "@/lib/wagmi.ts";

import App from "./App.tsx";
import "./index.css";

// Your FarcasterProvider can remain if you are using it
import { sdk as miniAppSdk } from '@farcaster/miniapp-sdk';
import { useEffect } from 'react';

// CHANGE 3: Create a new instance of QueryClient here
const queryClient = new QueryClient();

function FarcasterProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    miniAppSdk.actions.ready();
  }, []);

  return <>{children}</>;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* CHANGE 4: Pass the imported 'config' directly to the WagmiProvider */}
    <WagmiProvider config={config}>
      {/* Pass the new queryClient instance to its provider */}
      <QueryClientProvider client={queryClient}>
        <FarcasterProvider>
          <App />
        </FarcasterProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
