'use client';
import { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base } from 'viem/chains';
import { WagmiProvider } from 'wagmi';
//import { wagmiConfig } from '../wagmi';

import '@rainbow-me/rainbowkit/styles.css';

import {
    getDefaultConfig,
    RainbowKitProvider,
    lightTheme,
    midnightTheme,
    AvatarComponent,
} from '@rainbow-me/rainbowkit';

import {
    coinbaseWallet,
    metaMaskWallet,
    phantomWallet,
    rabbyWallet,
    rainbowWallet,
    walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

type Props = { children: ReactNode };

const config = getDefaultConfig({
    appName: 'FIRSTBA$E',
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
    chains: [base],
    wallets: [
        {
            groupName: 'Recommended',
            wallets: [metaMaskWallet, coinbaseWallet, rabbyWallet, walletConnectWallet, rainbowWallet, phantomWallet],
        },
    ],
    ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();
const API_KEY = process.env.NEXT_PUBLIC_COINBASE_API_KEY;

import soon from '../public/favicon.png';

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

function OnchainProviders({ children }: Props) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <OnchainKitProvider
                    apiKey={API_KEY}
                    chain={base}
                >
                    <RainbowKitProvider modalSize="wide" avatar={CustomAvatar} theme={
                        {
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
                        }}>
                        {children}
                    </RainbowKitProvider>
                </OnchainKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

export default OnchainProviders;