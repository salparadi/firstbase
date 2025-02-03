import { FC, useState } from 'react';
import SendMessage from './SendMessage';
import Pagination from './Pagination';

const truncateHash = (str: string) => {
    if (str.length > 17) {
        return `${str.slice(0, 13)}…${str.slice(-13)}`;
    }
    return str;
};

interface Message {
    id: number;
    blockNumber: number;
    timeStamp: number;
    hash: string;
    from: string;
    to: string;
    nonce: number;
    input: string;
    status: boolean;
    chain: string;
}

// Add pagination interface
interface PaginationData {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
}

// Update MessageListProps
interface MessageListProps {
    messages: Message[];
    pagination: PaginationData;
    onPageChange: (page: number) => void;
}

const MessageList: FC<MessageListProps> = ({ messages, pagination, onPageChange }) => {
    const [showDevOnly, setShowDevOnly] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const devAddress = process.env.NEXT_PUBLIC_DEV_ADDRESS || '';
    const toggleMessages = () => setShowDevOnly(!showDevOnly);
    const toggleForm = () => setShowForm(!showForm);

    if (!messages || messages.length === 0) {
        return <div>No messages found</div>;
    }

    const formatTimestamp = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return new Intl.DateTimeFormat('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'UTC',
            timeZoneName: 'short',
        }).format(date);
    };

    return (
        <div>
            {showForm && <SendMessage />}
            
            <nav className="flex gap-[10px] flex-start">
                <button 
                    onClick={toggleForm} 
                    className="font-mono inline-block px-4 py-[10px] text-gray-400 rounded-[12px] font-bold text-[16px] leading-5 mb-[40px] border-[2px] border-gray-300 dark:text-white"
                >
                    {showForm ? 'Hide Message' : 'Send Message'}
                </button>

                <button 
                    onClick={toggleMessages} 
                    className="font-mono inline-block px-4 py-[10px] text-gray-400 rounded-[12px] font-bold text-[16px] leading-5 mb-[40px] border-[2px] border-gray-300 dark:text-white"
                >
                    {showDevOnly ? 'Show All Messages' : 'Show MFB Only'}
                </button>
            </nav>

            {messages.map((message) => {
                const gmtTime = formatTimestamp(message.timeStamp);
                const explorerUrl = message.chain === 'base' ? 'https://basescan.org' : 'https://etherscan.io';
                const blockUrl = `${explorerUrl}/block/${message.blockNumber}`;
                const txUrl = `${explorerUrl}/tx/${message.hash}`;
                const fromUrl = `${explorerUrl}/address/${message.from}`;
                const toUrl = `${explorerUrl}/address/${message.to}`;
                const isDev = message.from.toLowerCase() === devAddress.toLowerCase();
                
                if (showDevOnly && !isDev) {
                    return null;
                }

                const listItemClass = isDev 
                    ? 'block mb-[50px] w-[100%]' 
                    : 'mb-[50px] w-[100%] opacity-50 bg-white p-[20px] border-l-[3px] border-black dark:bg-black dark:border-white dark:opacity-70';

                return (
                    <li key={message.id} className={listItemClass}>
                        <dl className="text-[14px] md:text-[16px] mb-[30px] grid grid-cols-[auto,1fr] gap-x-[5px]">
                            <dt className="inline-block font-bold">Nonce:</dt>
                            <dd className="inline-block">{message.nonce}</dd>

                            <dt className="inline-block font-bold">Block:</dt>
                            <dd className="inline-block">
                                <a className="hover:text-gray-700 dark:hover:text-gray-400 transition-all" href={blockUrl} target="_blank" rel="noopener noreferrer">
                                    {message.blockNumber}
                                </a>
                            </dd>

                            <dt className="inline-block font-bold">Time :</dt>
                            <dd className="inline-block">
                                {gmtTime} <span className="hidden md:inline-block text-gray-700 dark:text-gray-400">({message.timeStamp})</span>
                            </dd>

                            <dt className="inline-block font-bold">From :</dt>
                            <dd className="inline-block">
                                <a className="hover:text-gray-700 dark:hover:text-gray-400 transition-all" href={fromUrl} target="_blank" rel="noopener noreferrer">
                                    <span className="hidden md:inline-block">{message.from}</span>
                                    <span className="md:hidden">{truncateHash(message.from)}</span>
                                </a>
                            </dd>

                            <dt className="inline-block font-bold">To &nbsp;&nbsp;:</dt>
                            <dd className="inline-block">
                                <a className="hover:text-gray-700 dark:hover:text-gray-400 transition-all" href={toUrl} target="_blank" rel="noopener noreferrer">
                                    <span className="hidden md:inline-block">{message.to}</span>
                                    <span className="md:hidden">{truncateHash(message.to)}</span>
                                </a>
                            </dd>

                            <dt className="inline-block font-bold">Hash :</dt>
                            <dd className="inline-block">
                                <a className="hover:text-gray-700 dark:hover:text-gray-400 transition-all" href={txUrl} target="_blank" rel="noopener noreferrer">
                                    <span className="hidden md:inline-block">{message.hash}</span>
                                    <span className="md:hidden">{truncateHash(message.hash)}</span>
                                </a>
                            </dd>
                        </dl>

                        <p className="text-[14px] md:text-[16px] w-[100%] whitespace-pre-wrap break-words">
                            {message.input}
                        </p>
                        <span className="block text-2xl font-light mt-[50px]">=========</span>
                    </li>
                );
            })}

            <div className="mt-4">
                <Pagination 
                    currentPage={pagination.page}
                    totalPages={pagination.total_pages}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    );
};

export default MessageList;
