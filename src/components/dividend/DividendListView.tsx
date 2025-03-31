
import React, { useState } from "react";
import { format } from "date-fns";
import { DividendEvent } from "@/types/dividend";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Search, ArrowUpDown } from "lucide-react";

interface DividendListViewProps {
  dividendEvents: DividendEvent[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const DividendListView: React.FC<DividendListViewProps> = ({
  dividendEvents,
  searchQuery,
  onSearchChange,
}) => {
  const [sortField, setSortField] = useState<keyof DividendEvent>("exDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sort the events
  const sortedEvents = [...dividendEvents].sort((a, b) => {
    let fieldA = a[sortField];
    let fieldB = b[sortField];

    // Handle string comparison for dates
    if (sortField === "exDate" || sortField === "payDate") {
      fieldA = fieldA ? new Date(fieldA as string).getTime() : 0;
      fieldB = fieldB ? new Date(fieldB as string).getTime() : 0;
    }

    // Handle numeric comparison
    if (typeof fieldA === "number" && typeof fieldB === "number") {
      return sortDirection === "asc" ? fieldA - fieldB : fieldB - fieldA;
    }

    // Handle string comparison
    if (typeof fieldA === "string" && typeof fieldB === "string") {
      return sortDirection === "asc"
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    }

    // Handle boolean comparison
    if (typeof fieldA === "boolean" && typeof fieldB === "boolean") {
      return sortDirection === "asc"
        ? Number(fieldA) - Number(fieldB)
        : Number(fieldB) - Number(fieldA);
    }

    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedEvents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedEvents.length / itemsPerPage);

  // Handle sort toggle
  const handleSort = (field: keyof DividendEvent) => {
    setSortDirection(
      field === sortField ? (sortDirection === "asc" ? "desc" : "asc") : "asc"
    );
    setSortField(field);
  };

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const SortableHeader = ({ field, label }: { field: keyof DividendEvent; label: string }) => (
    <TableHead 
      className="cursor-pointer hover:bg-muted/50" 
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown className="h-3 w-3" />
      </div>
    </TableHead>
  );

  return (
    <div className="space-y-4">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by ticker or notes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader field="ticker" label="Ticker" />
              <SortableHeader field="exDate" label="Date" />
              <SortableHeader field="amount" label="Amount" />
              <TableHead>Type</TableHead>
              <SortableHeader field="status" label="Status" />
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No entries found
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((event, index) => (
                <TableRow key={`${event.id}-${index}`}>
                  <TableCell className="font-medium">
                    {event.ticker}
                  </TableCell>
                  <TableCell>
                    {format(new Date(event.exDate), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    ${event.amount?.toFixed(2) || "N/A"}
                  </TableCell>
                  <TableCell>
                    {event.ticker === "CASH" ? (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        Cash
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        Dividend
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={event.status === "Confirmed" ? "default" : "outline"}
                      className={
                        event.received
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                      }
                    >
                      {event.received ? "Received" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {event.notes || "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {pageNumbers.map((number) => (
              <PaginationItem key={number}>
                <PaginationLink
                  isActive={currentPage === number}
                  onClick={() => handlePageChange(number)}
                  className="cursor-pointer"
                >
                  {number}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default DividendListView;
