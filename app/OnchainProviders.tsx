'use client';

import { ReactNode } from 'react';
import { base } from 'viem/chains';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import {
    getDefaultConfig,
    RainbowKitProvider,
    lightTheme,
    midnightTheme,
    type AvatarComponent
} from '@rainbow-me/rainbowkit';
import {
    coinbaseWallet,
    metaMaskWallet,
    phantomWallet,
    rabbyWallet,
    rainbowWallet,
    walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import '@rainbow-me/rainbowkit/styles.css';
import soon from '../public/favicon.png';

interface ProvidersProps {
    children: ReactNode;
}

const walletConfig = getDefaultConfig({
    appName: 'FIRSTBA$E',
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
    chains: [base],
    wallets: [
        {
            groupName: 'Recommended',
            wallets: [
                metaMaskWallet,
                coinbaseWallet,
                rabbyWallet,
                walletConnectWallet,
                rainbowWallet,
                phantomWallet
            ],
        },
    ],
    ssr: true,
});

const queryClient = new QueryClient();

const CustomAvatar: AvatarComponent = ({ ensImage, size }) => {
    return ensImage ? (
        <img
            src={ensImage}
            width={size}
            height={size}
            style={{ borderRadius: 999 }}
            alt="ENS Avatar"
        />
    ) : (
        <img
            src={soon.src}
            width={size}
            height={size}
            style={{ borderRadius: 999 }}
            alt="FIRSTBA$E Avatar"
        />
    );
};

const OnchainProviders = ({ children }: ProvidersProps) => {
    return (
        <WagmiProvider config={walletConfig}>
            <QueryClientProvider client={queryClient}>
                <OnchainKitProvider
                    apiKey={process.env.NEXT_PUBLIC_COINBASE_API_KEY}
                    chain={base}
                >
                    <RainbowKitProvider 
                        modalSize="wide" 
                        avatar={CustomAvatar} 
                        theme={{
                            lightMode: lightTheme({
                                accentColor: '#0F172A',
                                accentColorForeground: 'white',
                                borderRadius: 'large',
                                fontStack: 'system',
                                overlayBlur: 'small',
                            }),
                            darkMode: midnightTheme({
                                accentColor: '#3D7CBE',
                                accentColorForeground: 'white',
                                borderRadius: 'small',
                                fontStack: 'system',
                                overlayBlur: 'small',
                            }),
                        }}
                    >
                        {children}
                    </RainbowKitProvider>
                </OnchainKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};

export default OnchainProviders;