# FIRSTBA$E

A decentralized message board for Base chain and Ethereum mainnet. Send messages on-chain and view them in a clean interface. Mr. First Base is an anonymous author that posts messages on mainnet. You can send messages to him on Base due to the cost savings. All messages to and from him are stored onchain and displayed here.

## Features

- Send messages on Base
- View all messages from an addressin chronological order
- Built-in $FIRSTBASE token swap using Coinbase's OnchainKit
- Dark mode support
- Mobile responsive

## Technical Stack

### Frontend
- Next.js 13+ (App Router)
- TypeScript
- TailwindCSS
- RainbowKit for wallet connection
- Wagmi for Ethereum interactions
- Coinbase's OnchainKit for swaps

### Backend
- FastAPI (Python)
- SQLAlchemy
- MySQL database
- Etherscan/Basescan APIs for transaction fetching

## Environment Variables

The application requires several environment variables to be set:
- API URLs and Keys (Etherscan, Basescan)
- Web3 Configuration (WalletConnect, Coinbase)
- Database Connection Details
- Contract/Wallet Addresses

See `.env.example` for all required variables.