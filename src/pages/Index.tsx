
import React, { useState } from "react";
import { Plus, Download, Search, CircleDollarSign, List, BarChart, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useDividendData } from "@/hooks/use-dividend-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DividendChart from "@/components/dividend/DividendChart";
import DividendCalendar from "@/components/dividend/DividendCalendar";
import DividendListView from "@/components/dividend/DividendListView";
import EventModal from "@/components/EventModal";
import { DividendEvent } from "@/types/dividend";
import { ThemeToggle } from "@/components/ThemeToggle";
import AddCashModal from "@/components/dividend/AddCashModal";

const DividendDashboard = () => {
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState("chart");
  const { toast } = useToast();
  
  const {
    dividendEvents,
    isLoading,
    error,
    filters,
    addEvent,
    updateFilters,
    exportData,
    addCashEvent,
  } = useDividendData();

  const handleAddEvent = async (event: DividendEvent) => {
    const result = await addEvent(event);
    if (result) {
      setIsEventModalOpen(false);
    }
  };

  const handleAddCash = async (amount: number, date: Date, notes: string) => {
    const result = await addCashEvent(amount, date, notes);
    if (result) {
      setIsCashModalOpen(false);
      toast({
        title: "Success",
        description: `Added ${amount.toFixed(2)} to cash utilized`,
      });
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
      <header className="mb-8 flex flex-col items-center">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
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
            variant="outline"
            size="sm"
            onClick={() => setIsCashModalOpen(true)}
            className="gap-2"
          >
            <CircleDollarSign className="h-4 w-4" />
            <span>Add Cash</span>
          </Button>
          
          <Button
            onClick={() => setIsEventModalOpen(true)}
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
        <Card className="my-4 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
          <CardContent className="p-6">
            <p className="text-red-700 dark:text-red-400">{error}</p>
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
        <Tabs value={activeView} onValueChange={setActiveView} className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-4">
            <TabsTrigger value="chart" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span>Chart</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Calendar</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              <span>List</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Performance Chart</h2>
              <DividendChart dividendEvents={filteredEvents} />
            </div>
          </TabsContent>
          
          <TabsContent value="calendar" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Dividend Calendar</h2>
              <DividendCalendar dividendEvents={filteredEvents} />
            </div>
          </TabsContent>
          
          <TabsContent value="list" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Dividend List</h2>
              <DividendListView 
                dividendEvents={filteredEvents} 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>
          </TabsContent>
        </Tabs>
      )}

      <EventModal 
        isOpen={isEventModalOpen} 
        onClose={() => setIsEventModalOpen(false)}
        onSubmit={handleAddEvent}
      />
      
      <AddCashModal
        isOpen={isCashModalOpen}
        onClose={() => setIsCashModalOpen(false)}
        onSubmit={handleAddCash}
      />
    </div>
  );
};

export default DividendDashboard;
