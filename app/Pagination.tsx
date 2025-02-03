import { FC } from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
        <nav 
            className="flex justify-center gap-2" 
            role="navigation" 
            aria-label="Pagination"
        >
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
                aria-label="Previous page"
            >
                Previous
            </button>
            
            <span className="px-4 py-2" aria-current="page">
                Page {currentPage} of {totalPages}
            </span>
            
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
                aria-label="Next page"
            >
                Next
            </button>
        </nav>
    );
};

export default Pagination; 