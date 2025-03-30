
import React, { useState } from "react";
import { Plus, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useDividendData } from "@/hooks/use-dividend-data";
import DividendChart from "@/components/dividend/DividendChart";
import DividendCalendar from "@/components/dividend/DividendCalendar";
import EventModal from "@/components/EventModal";
import { DividendEvent } from "@/types/dividend";

const DividendDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  const {
    dividendEvents,
    isLoading,
    error,
    filters,
    addEvent,
    updateFilters,
    exportData,
  } = useDividendData();

  const handleAddEvent = async (event: DividendEvent) => {
    const result = await addEvent(event);
    if (result) {
      setIsModalOpen(false);
    }
  };

  const filteredEvents = React.useMemo(() => {
    if (!searchQuery.trim()) return dividendEvents;
    
    const query = searchQuery.toLowerCase().trim();
    return dividendEvents.filter(event => 
      event.ticker.toLowerCase().includes(query) || 
      (event.notes && event.notes.toLowerCase().includes(query))
    );
  }, [dividendEvents, searchQuery]);

  const handleExportCsv = async () => {
    try {
      const csvData = await exportData();
      
      if (!csvData) {
        toast({
          title: "Error",
          description: "No data to export",
          variant: "destructive",
        });
        return;
      }
      
      // Create a download link for the CSV data
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      link.setAttribute("href", url);
      link.setAttribute("download", `dividend_data_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "CSV file downloaded successfully",
      });
    } catch (err) {
      console.error("Error exporting CSV:", err);
      toast({
        title: "Error",
        description: "Failed to export CSV. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-center">Dividend Tracker</h1>
        <p className="text-muted-foreground text-center">
          Track and visualize your dividend investments
        </p>
      </header>

      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ticker or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 self-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
          
          <Button
            onClick={() => setIsModalOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Dividend</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <Skeleton className="h-[500px] w-full rounded-xl" />
        </div>
      ) : error ? (
        <Card className="my-4 bg-red-50 border-red-200">
          <CardContent className="p-6">
            <p className="text-red-700">{error}</p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="chart">
          <div className="flex justify-center mb-4">
            <TabsList>
              <TabsTrigger value="chart">Chart View</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="chart" className="mt-0">
            <DividendChart dividendEvents={filteredEvents} />
          </TabsContent>
          
          <TabsContent value="calendar" className="mt-6">
            <DividendCalendar dividendEvents={filteredEvents} />
          </TabsContent>
        </Tabs>
      )}

      <EventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddEvent}
      />
    </div>
  );
};

export default DividendDashboard;
