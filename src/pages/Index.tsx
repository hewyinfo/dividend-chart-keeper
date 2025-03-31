
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDividendData } from "@/hooks/use-dividend-data";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import EventModal from "@/components/EventModal";
import AddCashModal from "@/components/dividend/AddCashModal";
import ApiSettingsModal from "@/components/settings/ApiSettingsModal";
import DividendHeader from "@/components/dividend/DividendHeader";
import FilterBar from "@/components/dividend/FilterBar";
import ViewContainer from "@/components/dividend/ViewContainer";
import { DividendEvent } from "@/types/dividend";

const DividendDashboard = () => {
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState("chart");
  const [minSafetyScore, setMinSafetyScore] = useState(0);
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
    if (!dividendEvents) return [];
    
    return dividendEvents.filter(event => {
      // Filter by search query
      const matchesSearch = !searchQuery.trim() || 
        event.ticker.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (event.notes && event.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Filter by safety score
      const matchesSafetyScore = minSafetyScore === 0 || 
        (event.safetyScore !== undefined && event.safetyScore >= minSafetyScore);
      
      return matchesSearch && matchesSafetyScore;
    });
  }, [dividendEvents, searchQuery, minSafetyScore]);

  const handleFilterBySafetyScore = (score: number) => {
    setMinSafetyScore(score);
  };

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
      <DividendHeader onOpenSettings={() => setIsSettingsModalOpen(true)} />

      <FilterBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onExportCsv={handleExportCsv}
        onAddCash={() => setIsCashModalOpen(true)}
        onAddDividend={() => setIsEventModalOpen(true)}
        onFilterBySafetyScore={handleFilterBySafetyScore}
        showSafetyScoreFilter={true}
      />

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
        <ViewContainer 
          dividendEvents={filteredEvents}
          searchQuery={searchQuery}
          activeView={activeView}
          onActiveViewChange={setActiveView}
          onSearchChange={setSearchQuery}
        />
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
      
      <ApiSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
};

export default DividendDashboard;
