import { FC } from 'react';
import { Address } from '@coinbase/onchainkit/identity';
import { ConnectWallet } from '@coinbase/onchainkit/wallet'; 
import { useAccount, useDisconnect } from 'wagmi';

/**
 * AccountConnect Component
 * 
 * A wallet connection component that displays either a connect button or
 * the user's address with a disconnect option. Uses Coinbase's onchainkit
 * for wallet interactions and Wagmi for account management.
 */
const AccountConnect: FC = () => {
    const { address, status } = useAccount();
    const { disconnect } = useDisconnect();

    /**
     * Renders the appropriate component based on connection status
     */
    const renderConnectionState = () => {
        if (status === 'disconnected') {
            return <ConnectWallet />; 
        }

        return (
            <div className="flex items-center justify-center">
                {address && (
                    <button 
                        type="button" 
                        onClick={() => disconnect()}
                        className="hover:opacity-80 transition-opacity"
                        aria-label="Disconnect wallet"
                    >
                        <Address address={address} />
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-grow" role="region" aria-label="Wallet connection">
            {renderConnectionState()}
        </div>
    );
};

export default AccountConnect;