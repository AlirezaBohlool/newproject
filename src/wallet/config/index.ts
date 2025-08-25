import { cookieStorage, createStorage } from "wagmi";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, arbitrum } from "@reown/appkit/networks";
import type { AppKitNetwork } from "@reown/appkit/networks";

// Get projectId from https://cloud.reown.com
// For development, you can use a test project ID or create your own
export const projectId = process.env.NEXT_PUBLIC_WALLET_PROJECT_ID || "YOUR_PROJECT_ID_HERE";

// Validate project ID
if (!projectId || projectId === "YOUR_PROJECT_ID_HERE") {
  console.warn("⚠️ Wallet Project ID not configured. Please set NEXT_PUBLIC_WALLET_PROJECT_ID in your .env.local file");
  console.warn("🔗 Get a free project ID from: https://cloud.reown.com");
}

export const networks = [mainnet, arbitrum] as [
  AppKitNetwork,
  ...AppKitNetwork[]
];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
