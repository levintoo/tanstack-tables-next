"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginatorProps {
  currentPage: number;
  pageCount: number;
  total: number;
  pageSize: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function Paginator({
  currentPage,
  pageCount,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginatorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
    } else {
      const params = new URLSearchParams(searchParams);
      params.set("page", newPage.toString());
      router.push(`?${params.toString()}`);
    }
  };

  const handlePageSizeChange = (newPageSize: string) => {
    if (onPageSizeChange) {
      onPageSizeChange(Number(newPageSize));
    } else {
      const params = new URLSearchParams(searchParams);
      params.set("pageSize", newPageSize);
      params.set("page", "1"); // Reset to first page when changing page size
      router.push(`?${params.toString()}`);
    }
  };

  const handlePageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") return;

    const page = parseInt(value);
    if (page >= 1 && page <= pageCount) {
      handlePageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 3;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(pageCount, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(
        <Button
          key={1}
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(1)}
          className="h-8 w-8 p-0"
        >
          1
        </Button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="px-2">
            ...
          </span>
        );
      }
    }

    // Add visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
          className="h-8 w-8 p-0"
        >
          {i}
        </Button>
      );
    }

    // Add ellipsis and last page if needed
    if (endPage < pageCount) {
      if (endPage < pageCount - 1) {
        pages.push(
          <span key="end-ellipsis" className="px-2">
            ...
          </span>
        );
      }
      pages.push(
        <Button
          key={pageCount}
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(pageCount)}
          className="h-8 w-8 p-0"
        >
          {pageCount}
        </Button>
      );
    }

    return pages;
  };

  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, total);

  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="flex items-center space-x-2">
        <p className="text-sm text-muted-foreground">Rows per page</p>
        <Select
          value={pageSize.toString()}
          onValueChange={handlePageSizeChange}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 50].map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <p className="text-sm text-muted-foreground">Page</p>
        <Input
          type="number"
          min={1}
          max={pageCount}
          value={currentPage}
          onChange={handlePageInput}
          className="h-8 w-[70px]"
        />
        <p className="text-sm text-muted-foreground">of {pageCount}</p>
      </div>
      <div className="text-sm text-muted-foreground">
        Showing {startRecord} to {endRecord} of {total} records
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={currentPage <= 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-1">{renderPageNumbers()}</div>
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= pageCount}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pageCount)}
            disabled={currentPage >= pageCount}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
