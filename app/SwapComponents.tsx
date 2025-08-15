import { FC } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
    Swap,
    SwapAmountInput,
    SwapButton,
    SwapMessage
} from '@coinbase/onchainkit/swap';
import { useAccount } from 'wagmi';
import type { Token } from '@coinbase/onchainkit/token';

const tokens = {
    ETH: {
        address: '',
        chainId: 8453,
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
        image: 'https://mrfirstbase.com/eth.png'
    },
    WETH: {
        address: '0x4200000000000000000000000000000000000006',
        chainId: 8453,
        decimals: 18,
        name: 'Wrapped Ether',
        symbol: 'WETH',
        image: 'https://mrfirstbase.com/weth.png'
    },
    USDC: {
        address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        chainId: 8453,
        decimals: 6,
        name: 'USDC',
        symbol: 'USDC',
        image: 'https://mrfirstbase.com/usdc.png'
    },
    USDT: {
        address: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',
        chainId: 8453,
        decimals: 6,
        name: 'USDT',
        symbol: 'USDT',
        image: 'https://mrfirstbase.com/usdt.png'
    },
    FIRSTBASE: {
        address: '0x802161b1BDe5E45eC02D42d3c1DC9f6b8319b666',
        chainId: 8453,
        decimals: 18,
        name: 'First Time on Base',
        symbol: 'FIRSTBASE',
        image: 'https://mrfirstbase.com/favicon.png'
    }
} as const;

const SwapComponents: FC = () => {
    const { address } = useAccount();

    if (!address) {
        return (
            <div className="p-[50px]">
                <ConnectButton
                    label="Connect"
                    accountStatus={{
                        smallScreen: 'avatar',
                        largeScreen: 'avatar',
                    }}
                />
            </div>
        );
    }

    const sellTokens: Token[] = [
        tokens.ETH,
        tokens.WETH,
        tokens.USDC,
        tokens.USDT
    ];

    return (
        <Swap address={address} className="w-[400px] max-w-[100%]">
            <SwapAmountInput
                label="Sell"
                token={tokens.ETH}
                swappableTokens={sellTokens}
                type="from"
            />
            <SwapAmountInput
                label="Buy"
                token={tokens.FIRSTBASE}
                type="to"
            />
            <SwapButton />
            <SwapMessage />
        </Swap>
    );
};

export default SwapComponents;
