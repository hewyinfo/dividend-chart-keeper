
import React from "react";
import { BarChart, Calendar, List } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DividendEvent } from "@/types/dividend";
import DividendChart from "@/components/dividend/DividendChart";
import DividendCalendar from "@/components/dividend/DividendCalendar";
import DividendListView from "@/components/dividend/DividendListView";

interface ViewContainerProps {
  dividendEvents: DividendEvent[];
  searchQuery: string;
  activeView: string;
  onActiveViewChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

const ViewContainer: React.FC<ViewContainerProps> = ({
  dividendEvents,
  searchQuery,
  activeView,
  onActiveViewChange,
  onSearchChange,
}) => {
  return (
    <Tabs value={activeView} onValueChange={onActiveViewChange} className="space-y-4">
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
          <DividendChart dividendEvents={dividendEvents} />
        </div>
      </TabsContent>
      
      <TabsContent value="calendar" className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Dividend Calendar</h2>
          <DividendCalendar dividendEvents={dividendEvents} />
        </div>
      </TabsContent>
      
      <TabsContent value="list" className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Dividend List</h2>
          <DividendListView 
            dividendEvents={dividendEvents} 
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ViewContainer;
