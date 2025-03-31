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
import { Search, ArrowUpDown, Edit, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useDividendData } from "@/hooks/use-dividend-data";
import { useToast } from "@/hooks/use-toast";
import EventModal from "@/components/EventModal";

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
  const { updateEvent, deleteEvent } = useDividendData();
  const { toast } = useToast();
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [editingEvent, setEditingEvent] = useState<DividendEvent | null>(null);
  const itemsPerPage = 10;

  const sortedEvents = [...dividendEvents].sort((a, b) => {
    let fieldA = a[sortField];
    let fieldB = b[sortField];

    if (sortField === "exDate" || sortField === "payDate") {
      fieldA = fieldA ? new Date(fieldA as string).getTime() : 0;
      fieldB = fieldB ? new Date(fieldB as string).getTime() : 0;
    }

    if (typeof fieldA === "number" && typeof fieldB === "number") {
      return sortDirection === "asc" ? fieldA - fieldB : fieldB - fieldA;
    }

    if (typeof fieldA === "string" && typeof fieldB === "string") {
      return sortDirection === "asc"
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    }

    if (typeof fieldA === "boolean" && typeof fieldB === "boolean") {
      return sortDirection === "asc"
        ? Number(fieldA) - Number(fieldB)
        : Number(fieldB) - Number(fieldA);
    }

    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedEvents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedEvents.length / itemsPerPage);

  const handleSort = (field: keyof DividendEvent) => {
    setSortDirection(
      field === sortField ? (sortDirection === "asc" ? "desc" : "asc") : "asc"
    );
    setSortField(field);
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleEditEvent = (event: DividendEvent) => {
    setEditingEvent(event);
  };

  const handleUpdateEvent = async (event: DividendEvent) => {
    const result = await updateEvent(event);
    if (result) {
      toast({
        title: "Success",
        description: `Updated ${event.ticker} dividend event`,
      });
      setEditingEvent(null);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this dividend event?")) {
      await deleteEvent(id);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedEvents.length === 0) {
      toast({
        title: "Warning",
        description: "No events selected for deletion",
        variant: "destructive",
      });
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedEvents.length} selected events?`)) {
      const results = await Promise.all(selectedEvents.map(id => deleteEvent(id)));
      
      const successCount = results.filter(Boolean).length;
      
      toast({
        title: "Bulk Delete Complete",
        description: `Successfully deleted ${successCount} of ${selectedEvents.length} events`,
      });
      
      setSelectedEvents([]);
      setBulkMode(false);
    }
  };

  const toggleEventSelection = (id: string) => {
    setSelectedEvents(prev => 
      prev.includes(id) 
        ? prev.filter(eventId => eventId !== id) 
        : [...prev, id]
    );
  };

  const toggleBulkMode = () => {
    setBulkMode(!bulkMode);
    setSelectedEvents([]);
  };

  const selectAllVisible = () => {
    if (selectedEvents.length === currentItems.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(currentItems.map(event => event.id as string));
    }
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
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by ticker or notes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex items-center gap-2">
          {bulkMode && (
            <Button 
              onClick={handleBulkDelete} 
              variant="destructive" 
              size="sm"
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected ({selectedEvents.length})
            </Button>
          )}
          
          <Button 
            onClick={toggleBulkMode} 
            variant={bulkMode ? "default" : "outline"} 
            size="sm"
            className="flex items-center gap-1"
          >
            {bulkMode ? (
              <>
                <Check className="h-4 w-4" />
                Done
              </>
            ) : (
              <>
                <Checkbox className="h-4 w-4 mr-1" />
                Bulk Select
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {bulkMode && (
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedEvents.length === currentItems.length && currentItems.length > 0}
                    onCheckedChange={selectAllVisible}
                    aria-label="Select all"
                  />
                </TableHead>
              )}
              <SortableHeader field="ticker" label="Ticker" />
              <SortableHeader field="exDate" label="Date" />
              <SortableHeader field="amount" label="Amount" />
              <TableHead>Type</TableHead>
              <SortableHeader field="status" label="Status" />
              <TableHead>Notes</TableHead>
              {!bulkMode && <TableHead className="w-24">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={bulkMode ? 8 : 7} className="text-center py-6 text-muted-foreground">
                  No entries found
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((event, index) => (
                <TableRow key={`${event.id}-${index}`}>
                  {bulkMode && (
                    <TableCell>
                      <Checkbox 
                        checked={selectedEvents.includes(event.id as string)}
                        onCheckedChange={() => toggleEventSelection(event.id as string)}
                        aria-label={`Select ${event.ticker}`}
                      />
                    </TableCell>
                  )}
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
                  {!bulkMode && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditEvent(event)}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteEvent(event.id as string)}
                          className="h-8 w-8 text-destructive hover:text-destructive/90"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  )}
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

      {editingEvent && (
        <EventModal
          isOpen={!!editingEvent}
          onClose={() => setEditingEvent(null)}
          onSubmit={handleUpdateEvent}
          initialEvent={editingEvent}
        />
      )}
    </div>
  );
};

export default DividendListView;
