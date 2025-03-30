
import React, { useState } from "react";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import EventModal from "@/components/EventModal";
import LineChartComponent from "@/components/LineChartComponent";
import BarChartComponent from "@/components/BarChartComponent";
import { DividendEvent } from "@/types/dividend";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CalendarPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dividendEvents, setDividendEvents] = useState<DividendEvent[]>([]);

  const handleAddEvent = (event: DividendEvent) => {
    setDividendEvents([...dividendEvents, event]);
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Dividend Calendar</h1>
      
      <div className="mb-8 flex justify-end">
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus size={18} aria-hidden="true" />
          <span>Add Dividend Event</span>
        </Button>
      </div>

      {dividendEvents.length > 0 && (
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Dividend Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dividendEvents.map((event, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div>
                      <span className="font-medium">{event.ticker}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        Ex-Date: {format(new Date(event.exDate), "MMM dd, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center">
                      {event.yield && (
                        <span className="text-sm text-gray-700 mr-3">
                          Yield: {event.yield}%
                        </span>
                      )}
                      {event.received ? (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          Received
                        </span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dividend Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChartComponent dividendEvents={dividendEvents} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cash Utilized</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChartComponent dividendEvents={dividendEvents} />
          </CardContent>
        </Card>
      </div>

      <EventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddEvent}
      />
    </div>
  );
};

export default CalendarPage;
