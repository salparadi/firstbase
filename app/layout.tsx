import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import '@coinbase/onchainkit/styles.css';
import OnchainProviders from './OnchainProviders';

/**
 * Metadata configuration for the application
 */
export const metadata: Metadata = {
    title: 'Mr. First Base',
    description: 'Messages from Mr. First Base',
};

/**
 * Root layout component
 * Provides the base structure and providers for the application
 */
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.png" />
            </head>
            <body className="font-mono">
                <OnchainProviders>
                    {children}
                </OnchainProviders>
            </body>
        </html>
    );
}
