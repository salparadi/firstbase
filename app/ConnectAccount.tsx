import { Address } from '@coinbase/onchainkit/identity';
import { ConnectWallet } from '@coinbase/onchainkit/wallet'; 
import { useAccount, useDisconnect } from 'wagmi';
 
function AccountConnect() {
  const { address, status } = useAccount();
  const { disconnect } = useDisconnect();
 
  return (
    <div className="flex flex-grow">
      {(() => {
        if (status === 'disconnected') {
          return <ConnectWallet />; 
        }
 
        return (
          <div className="flex items-center justify-center">
            {address && (
              <button type="button" onClick={() => disconnect()}>
                <Address address={address} />
              </button>
            )}
          </div>
        );
      })()}
    </div>
  );
}

export default AccountConnect;