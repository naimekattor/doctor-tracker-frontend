'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalRecords,
  limit,
  onPageChange,
  onLimitChange,
  pageSizeOptions = [10, 20, 50],
  className,
}: PaginationProps) {
  const safeTotalPages = Math.max(totalPages, 1);
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), safeTotalPages);

  const startRecord = totalRecords === 0 ? 0 : (safeCurrentPage - 1) * limit + 1;
  const endRecord = Math.min(safeCurrentPage * limit, totalRecords);

  // Generate page numbers with intelligent ellipsis window
  const getPageNumbers = (): (number | string)[] => {
    if (safeTotalPages <= 5) {
      return Array.from({ length: safeTotalPages }, (_, i) => i + 1);
    }

    if (safeCurrentPage <= 3) {
      return [1, 2, 3, 4, '...', safeTotalPages];
    }

    if (safeCurrentPage >= safeTotalPages - 2) {
      return [1, '...', safeTotalPages - 3, safeTotalPages - 2, safeTotalPages - 1, safeTotalPages];
    }

    return [1, '...', safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, '...', safeTotalPages];
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 py-3.5 px-2 select-none border-t border-[#E8EDEB]',
        className
      )}
    >
      {/* Record info summary: responsive formatting */}
      <div className="text-xs text-[#5C768D] order-2 sm:order-1 text-center sm:text-left">
        {totalRecords === 0 ? (
          <span>No records found</span>
        ) : (
          <>
            <span className="hidden sm:inline">Showing </span>
            <span className="font-semibold text-[#1C2D38]">{startRecord}</span>
            <span>–</span>
            <span className="font-semibold text-[#1C2D38]">{endRecord}</span>
            <span> of </span>
            <span className="font-semibold text-[#1C2D38]">{totalRecords}</span>
            <span className="hidden sm:inline"> entries</span>
          </>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 order-1 sm:order-2 flex-wrap justify-center">
        {/* Page size limit dropdown */}


        {/* Quick Jump to First Page (shown on desktop for multi-page sets) */}
        {safeTotalPages > 4 && (
          <button
            type="button"
            disabled={safeCurrentPage <= 1}
            onClick={() => onPageChange(1)}
            aria-label="First page"
            className="hidden md:inline-flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#E8EDEB] bg-white text-[#5C768D] hover:bg-[#F9FBFA] hover:text-[#1C2D38] disabled:opacity-30 disabled:pointer-events-none shadow-2xs transition-colors cursor-pointer"
            title="First page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
        )}

        {/* Previous Button */}
        <button
          type="button"
          disabled={safeCurrentPage <= 1}
          onClick={() => onPageChange(safeCurrentPage - 1)}
          aria-label="Previous page"
          className="h-8 px-2 sm:px-2.5 rounded-[6px] border border-[#E8EDEB] bg-white text-[#1C2D38] hover:bg-[#F9FBFA] disabled:opacity-30 disabled:pointer-events-none shadow-2xs text-xs font-medium inline-flex items-center justify-center transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Desktop Page Numbers (Clean, uncluttered pills) */}
        <div className="hidden sm:flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="w-7 h-8 flex items-center justify-center text-xs text-gray-400 select-none"
                >
                  …
                </span>
              );
            }

            const pageNum = Number(page);
            const isActive = pageNum === safeCurrentPage;

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'h-8 min-w-[32px] px-2 rounded-[6px] text-xs font-semibold flex items-center justify-center transition-all cursor-pointer',
                  isActive
                    ? 'bg-[#02634c] text-white border border-[#02634c] shadow-xs'
                    : 'bg-white border border-[#E8EDEB] text-[#5C768D] hover:text-[#1C2D38] hover:bg-[#F9FBFA] shadow-2xs'
                )}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Mobile Page Indicator (compact & clean, never breaks layout) */}
        <div className="sm:hidden px-2 text-xs font-semibold text-[#1C2D38]">
          <span>{safeCurrentPage}</span>
          <span className="text-gray-400 font-normal"> / </span>
          <span>{safeTotalPages}</span>
        </div>

        {/* Next Button */}
        <button
          type="button"
          disabled={safeCurrentPage >= safeTotalPages}
          onClick={() => onPageChange(safeCurrentPage + 1)}
          aria-label="Next page"
          className="h-8 px-2 sm:px-2.5 rounded-[6px] border border-[#E8EDEB] bg-white text-[#1C2D38] hover:bg-[#F9FBFA] disabled:opacity-30 disabled:pointer-events-none shadow-2xs text-xs font-medium inline-flex items-center justify-center transition-colors cursor-pointer"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4 sm:ml-1" />
        </button>

        {/* Quick Jump to Last Page (shown on desktop for multi-page sets) */}
        {safeTotalPages > 4 && (
          <button
            type="button"
            disabled={safeCurrentPage >= safeTotalPages}
            onClick={() => onPageChange(safeTotalPages)}
            aria-label="Last page"
            className="hidden md:inline-flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#E8EDEB] bg-white text-[#5C768D] hover:bg-[#F9FBFA] hover:text-[#1C2D38] disabled:opacity-30 disabled:pointer-events-none shadow-2xs transition-colors cursor-pointer"
            title="Last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default Pagination;
