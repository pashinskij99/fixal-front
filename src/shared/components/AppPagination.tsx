import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/ui/pagination";

interface AppPaginationProps {
  currentPage: number;
  totalCount: number;
  limit: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function AppPagination({
  currentPage,
  totalCount,
  limit,
  onPageChange,
  className = "justify-center",
}: AppPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  // Handle previous page click safely
  const handlePrev = (event: React.MouseEvent) => {
    event.preventDefault();
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // Handle next page click safely
  const handleNext = (event: React.MouseEvent) => {
    event.preventDefault();
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Prevent clicks on active or invalid links
  const handlePageClick = (event: React.MouseEvent, page: number) => {
    event.preventDefault();
    onPageChange(page);
  };

  return (
    <ShadcnPagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={handlePrev}
            className={`h-8 ${currentPage <= 1 ? "pointer-events-none opacity-40" : "cursor-pointer"}`}
            text=""
            size="icon"
          />
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              onClick={(event) => handlePageClick(event, page)}
              isActive={currentPage === page}
              className="h-8 cursor-pointer"
              size="icon"
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={handleNext}
            className={`h-8 ${currentPage >= totalPages ? "pointer-events-none opacity-40" : "cursor-pointer"}`}
            text=""
            size="icon"
          />
        </PaginationItem>
      </PaginationContent>
    </ShadcnPagination>
  );
}
