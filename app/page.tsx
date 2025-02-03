'use client';

import { useEffect, useState, Suspense } from 'react';
import SwapComponents from './SwapComponents';
import Modal from 'react-modal';
import { useAccount } from 'wagmi';
import MessageList from './MessageList'; // Adjust the path according to your file structure
import { useRouter, useSearchParams } from 'next/navigation';  // Add this import

// Add this near the top of your file, after imports
const LoadingState = () => (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
        <span className="text-2xl font-light opacity-75">==========</span>
        <h2 className="text-2xl font-bold my-2 animate-pulse">Soon.</h2>
        <span className="text-2xl font-light opacity-75">==========</span>
    </div>
);

// Define a custom modal style (optional)
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        borderColor: 'black',
        backgroundColor: '#ccc', // Add any additional content styles here
        padding: '0',
        borderRadius: '10px',
        maxWidth: '100%',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)' // This sets the background to transparent black
    }
};

interface Message {
    id: number,
    blockNumber: number,
    timeStamp: number,
    hash: string,
    from: string,
    to: string,
    nonce: number,
    input: string,
    status: boolean,
    chain: string,
}

interface PaginationState {
    page: number;
    total_pages: number;
    total: number;
    page_size: number;
}

interface ApiResponse {
    items: Message[];
    pagination: PaginationState;
}

// Create a wrapped version of the main content
const MainContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState<PaginationState>({
        page: Number(searchParams.get('page')) || 1,
        total_pages: 1,
        total: 0,
        page_size: 10
    });
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const { address } = useAccount();

    useEffect(() => {
        Modal.setAppElement('body'); // Set the app element
    }, []);

    useEffect(() => {
        // Update URL when page changes
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.set('page', pagination.page.toString());
        router.push(`?${currentParams.toString()}`, { scroll: false });
        
        fetchMessages(pagination.page);
    }, [pagination.page, router]);

    const fetchMessages = async (page: number) => {
        try {
            setIsLoading(true);
            const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/messages?page=${page}&page_size=${pagination.page_size}`;
            console.log('Fetching from URL:', url);

            const response = await fetch(url);
            
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data: ApiResponse = await response.json();
            console.log('API Response:', data);
            
            if (data && Array.isArray(data.items)) {
                setMessages(data.items);
                setPagination(data.pagination);
            } else {
                console.error('Invalid API response format:', data);
                setMessages([]);
            }
        } catch (error) {
            console.error('Error fetching Messages:', error);
            setMessages([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    if (isLoading) return <LoadingState />;

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    return (
        <main className="w-[100%] max-w-[1000px] mx-auto">
            <header className="flex items-center justify-between p-[20px] md:p-[30px] mb-[0px]">
                <div>
                    <span className="text-2xl font-light">==========</span>
                    <h1 className="text-2xl font-bold">
                        <a href="/" className="no-underline">$FIRSTBASE</a>
                    </h1>
                    <span className="text-2xl font-light">==========</span>
                </div>
                <div className="flex items-center">
                    <a href="https://x.com/FirstTimeOnBase" className="font-mono inline-block ml-3 px-4 py-[8px] bg-black text-white rounded-[12px] font-bold text-[16px]">
                        <i className="fa-brands fa-x-twitter"></i>
                    </a>
                    <a href="https://t.me/firstbaseaccess" className="font-mono inline-block ml-3 px-4 py-[8px] bg-black text-white rounded-[12px] font-bold text-[16px]">
                        <i className="fa-brands fa-telegram"></i>
                    </a>
                    <button
                        onClick={openModal}
                        className="font-mono inline-block ml-3 px-4 py-[10px] bg-black text-white rounded-[12px] font-bold text-[16px] leading-5"
                    >
                        BUY
                    </button>
                </div>
            </header>
            <section className="p-[20px] md:p-[30px] pt-[0px] md:pt-[0px]">
                <ul className="w-[100%]">
                    <MessageList 
                        messages={messages}
                        pagination={pagination}
                        onPageChange={handlePageChange}
                    />
                </ul>
            </section>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Swap Modal"
            >
                <button onClick={closeModal} className="text-black text-[30px] absolute top-0 right-3">
                    &times;
                </button>
                <SwapComponents />
            </Modal>
        </main>
    );
};

// Main component wrapped in Suspense
export default function Home() {
    return (
        <Suspense fallback={<LoadingState />}>
            <MainContent />
        </Suspense>
    );
}
