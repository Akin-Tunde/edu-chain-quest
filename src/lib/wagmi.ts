import { http, createConfig } from "wagmi";
import { mainnet, sepolia, base , baseSepolia } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector';

// Read the Project ID from the environment variable
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

// --- DEBUGGING STEP ---
// This will print to your browser's developer console.
console.log('[wagmi.ts] VITE_WALLETCONNECT_PROJECT_ID:', projectId);

// Add a very strong error message if the ID is missing
if (!projectId) {
  // This alert will stop the app from loading and tell you the exact problem.
  alert("CRITICAL ERROR: VITE_WALLETCONNECT_PROJECT_ID is not set in your .env.local file. Please get a project ID from https://cloud.walletconnect.com and add it.");
  throw new Error("VITE_WALLETCONNECT_PROJECT_ID is not set.");
}

export const config = createConfig({
  chains: [mainnet, sepolia, base, baseSepolia ],
  connectors: [
    miniAppConnector(),
    injected({ shimDisconnect: true }),
    walletConnect({ 
      projectId: projectId,
      metadata: {
        name: "Policast",
        description: "Decentralized Prediction Markets",
        url: typeof window !== 'undefined' ? window.location.origin : 'https://policast.app',
        icons: [''],
      },
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [base.id]: http(),
    [baseSepolia .id]: http(),
  },
  multiInjectedProviderDiscovery: true,
  ssr: false,
});