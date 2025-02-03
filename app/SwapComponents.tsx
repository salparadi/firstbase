import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
    Swap,
    SwapAmountInput,
    SwapButton,
    SwapMessage
} from '@coinbase/onchainkit/swap';
import { useAccount, useSendTransaction } from 'wagmi';
import type { Token } from '@coinbase/onchainkit/token';

export default function SwapComponents() {
    const { address } = useAccount();
    const { sendTransaction } = useSendTransaction();

    const ETHToken: Token = {
        address: "",
        chainId: 8453,
        decimals: 18,
        name: "Ether",
        symbol: "ETH",
        image: "https://firstbase.bot/eth.png"
    };
    const WETHToken: Token = {
        address: "0x4200000000000000000000000000000000000006",
        chainId: 8453,
        decimals: 18,
        name: "Wrapped Ether",
        symbol: "WETH",
        image: "https://firstbase.bot/weth.png"
    };
    const USDCToken: Token = {
        address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        chainId: 8453,
        decimals: 6,
        name: "USDC",
        symbol: "USDC",
        image: "https://firstbase.bot/usdc.png"
    };
    const USDTToken: Token = {
        address: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
        chainId: 8453,
        decimals: 6,
        name: "USDT",
        symbol: "USDT",
        image: "https://firstbase.bot/usdt.png"
    };

    const FIRSTBASEToken: Token = {
        address: "0x802161b1BDe5E45eC02D42d3c1DC9f6b8319b666",
        chainId: 8453,
        decimals: 18,
        name: "First Time on Base",
        symbol: "FIRSTBASE",
        image: "https://firstbase.bot/favicon.png"
    };

    const sellTokens: Token[] = [ETHToken, WETHToken, USDCToken, USDTToken];

//     const onSubmit = useCallback(async (swapTransaction: BuildSwapTransaction) => {
//         const { transaction } = swapTransaction;
//         console.log('Prepared swapTransaction:', transaction);
// 
//         const result = await sendTransaction({
//             to: transaction.to,
//             value: transaction.value,
//             data: transaction.data,
//         });
//         console.log('Transaction result:', result);
//     }, [sendTransaction]);

    return (
        address ? (
            <Swap address={address} className='w-[400px] max-w-[100%]'>
                <SwapAmountInput
                    label="Sell"
                    token={ETHToken}
                    swappableTokens={sellTokens}
                    type="from"
                />
                {/* <SwapToggleButton />  */}
                <SwapAmountInput
                    label="Buy"
                    token={FIRSTBASEToken}
                    type="to"
                />
                <SwapButton />
                <SwapMessage />
            </Swap>
        ) : (
            <div className="p-[50px]">
                <ConnectButton
                    label="Connect"
                    accountStatus={{
                        smallScreen: 'avatar',
                        largeScreen: 'avatar',
                    }}
                />
            </div>
        )
    );
}
