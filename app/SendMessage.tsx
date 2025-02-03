import * as React from 'react'
import { 
    type BaseError,
    useAccount,
    useSendTransaction, 
    useWaitForTransactionReceipt 
} from 'wagmi' 
import { toHex } from 'viem' 
import { ConnectButton } from '@rainbow-me/rainbowkit';
 
const SendMessage = () => {
    const { address } = useAccount();

    const { 
        data: hash,
        error,  
        isPending, 
        sendTransaction 
    } = useSendTransaction() 

    async function submit(e: React.FormEvent<HTMLFormElement>) { 
        e.preventDefault() 
        const formData = new FormData(e.target as HTMLFormElement) 
        const to = "0xc0495d62fc7d8090ae1357eb9858c60e4eaa0330"
        const value = BigInt(0)
        const message = formData.get('message') as string
        sendTransaction({ to, value: value, data: toHex(message) }) 
    } 

    const { isLoading: isConfirming, isSuccess: isConfirmed } = 
        useWaitForTransactionReceipt({ 
            hash, 
        }) 

    return (
        address ? (
            <form onSubmit={submit} className="text-[0px] border-b-[1px] border-gray-300 dark:border-white pb-[30px] mb-[30px]">
                <textarea 
                rows={10}
                className="w-[100%] p-[20px] text-[16px] mb-[30px] rounded-[12px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)]" 
                name="message" 
                placeholder="Write your message here, it will be sent to Mr. First Base"
            />
            <button 
                className="font-mono inline-block px-4 py-[10px] text-gray-800 rounded-[12px] font-bold text-[16px] leading-5 border-[2px] border-gray-800 dark:text-white"
                disabled={isPending}
                type="submit"
            >
                {isPending ? 'Sending...' : 'Send Message'} 
            </button>
            {hash && <div className="text-[14px] md:text-[16px] mt-[30px]">Transaction Hash: {hash}</div>} 
            {isConfirming && <div className="text-[14px] md:text-[16px] mt-[30px]">Waiting for confirmation...</div>} 
            {isConfirmed && <div className="text-[14px] md:text-[16px] mt-[30px]">Transaction confirmed!</div>} 
            {error && (
        <div className="text-[14px] md:text-[16px] mt-[30px]">Error: {(error as BaseError).shortMessage || error.message}</div>
                )}
            </form>
        ) : (
            <div className="border-b-[1px] border-gray-300 dark:border-white pb-[30px] mb-[30px]">
            <ConnectButton
                label="Connect"
                accountStatus={{
                    smallScreen: 'avatar',
                    largeScreen: 'avatar',
                }}
            />
            </div>
        )
    )
}

export default SendMessage;