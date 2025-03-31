
import React, { useState } from "react";
import { format, getDate, startOfMonth, endOfMonth, eachDayOfInterval, startOfDay } from "date-fns";
import { DividendEvent } from "@/types/dividend";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DividendEventDetailsProps {
  date: Date;
  events: DividendEvent[];
  isOpen: boolean;
  onClose: () => void;
}

const DividendEventDetails: React.FC<DividendEventDetailsProps> = ({
  date,
  events,
  isOpen,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            Dividend Events for {format(date, "MMMM d, yyyy")}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[50vh] mt-4 pr-4">
          <div className="space-y-4">
            {events.length === 0 ? (
              <p className="text-muted-foreground">No dividend events for this date.</p>
            ) : (
              events.map((event, index) => (
                <div
                  key={`${event.ticker}-${index}`}
                  className="p-4 rounded-md border bg-card"
                >
                  <div className="flex justify-between items-start">
                    <div className="font-bold text-lg">{event.ticker}</div>
                    <Badge
                      variant={event.status === "Confirmed" ? "default" : "outline"}
                    >
                      {event.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <div className="text-sm text-muted-foreground">Ex-Dividend Date</div>
                      <div>{format(new Date(event.exDate), "MMM d, yyyy")}</div>
                    </div>
                    
                    {event.payDate && (
                      <div>
                        <div className="text-sm text-muted-foreground">Payment Date</div>
                        <div>{format(new Date(event.payDate), "MMM d, yyyy")}</div>
                      </div>
                    )}
                    
                    {event.amount !== undefined && (
                      <div>
                        <div className="text-sm text-muted-foreground">Amount</div>
                        <div>${event.amount.toFixed(4)}</div>
                      </div>
                    )}
                    
                    {event.yield !== undefined && (
                      <div>
                        <div className="text-sm text-muted-foreground">Dividend Yield</div>
                        <div>{event.yield.toFixed(2)}%</div>
                      </div>
                    )}
                    
                    {event.yieldOnCost !== undefined && (
                      <div>
                        <div className="text-sm text-muted-foreground">Yield on Cost</div>
                        <div>{event.yieldOnCost.toFixed(2)}%</div>
                      </div>
                    )}
                    
                    {event.price !== undefined && (
                      <div>
                        <div className="text-sm text-muted-foreground">Price</div>
                        <div>${event.price.toFixed(2)}</div>
                      </div>
                    )}
                  </div>
                  
                  {event.notes && (
                    <div className="mt-2">
                      <div className="text-sm text-muted-foreground">Notes</div>
                      <div className="bg-muted/30 p-2 rounded text-sm">{event.notes}</div>
                    </div>
                  )}
                  
                  <div className="flex justify-end mt-2">
                    <Badge
                      variant={event.received ? "outline" : "outline"}
                      className={
                        event.received
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      }
                    >
                      {event.received ? "Received" : "Pending"}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

interface DividendCalendarProps {
  dividendEvents: DividendEvent[];
}

const DividendCalendar: React.FC<DividendCalendarProps> = ({ dividendEvents }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<DividendEvent[]>([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const daysInMonth = React.useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const eventsMap = React.useMemo(() => {
    const map = new Map<string, DividendEvent[]>();
    
    dividendEvents.forEach(event => {
      // Map ex-dividend date events
      const exDate = startOfDay(new Date(event.exDate));
      const exDateKey = format(exDate, "yyyy-MM-dd");
      
      if (!map.has(exDateKey)) {
        map.set(exDateKey, []);
      }
      map.get(exDateKey)?.push({
        ...event,
        notes: `${event.notes || ''} (Ex-Dividend Date)`.trim()
      });
      
      // Map payment date events if available
      if (event.payDate) {
        const payDate = startOfDay(new Date(event.payDate));
        const payDateKey = format(payDate, "yyyy-MM-dd");
        
        if (!map.has(payDateKey)) {
          map.set(payDateKey, []);
        }
        map.get(payDateKey)?.push({
          ...event,
          notes: `${event.notes || ''} (Payment Date)`.trim()
        });
      }
    });
    
    return map;
  }, [dividendEvents]);

  const nextMonth = () => {
    setCurrentMonth(month => {
      const nextMonth = new Date(month);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return nextMonth;
    });
  };

  const prevMonth = () => {
    setCurrentMonth(month => {
      const prevMonth = new Date(month);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      return prevMonth;
    });
  };

  const handleDateClick = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const events = eventsMap.get(dateKey) || [];
    
    setSelectedDate(date);
    setSelectedEvents(events);
    
    if (events.length > 0) {
      setIsDetailsOpen(true);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Dividend Calendar</CardTitle>
          <CardDescription>
            {format(currentMonth, "MMMM yyyy")}
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevMonth}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(new Date())}
            aria-label="Current month"
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextMonth}
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center font-medium">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 mt-1">
          {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() }).map((_, i) => (
            <div key={`empty-${i}`} className="h-24 p-1" />
          ))}
          
          {daysInMonth.map((day) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const dayEvents = eventsMap.get(dateKey) || [];
            const hasEvents = dayEvents.length > 0;
            const isSelected = selectedDate && format(selectedDate, "yyyy-MM-dd") === dateKey;
            
            return (
              <div
                key={dateKey}
                className={`h-24 p-1 border rounded-md overflow-hidden transition-colors ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : hasEvents
                    ? "border-gray-200 hover:border-primary/50 cursor-pointer"
                    : "border-gray-100"
                }`}
                onClick={() => handleDateClick(day)}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-sm font-medium ${hasEvents ? "text-primary" : ""}`}>
                    {getDate(day)}
                  </span>
                  {hasEvents && (
                    <Badge className="text-xs">{dayEvents.length}</Badge>
                  )}
                </div>
                <div className="mt-1 space-y-1 overflow-hidden max-h-[calc(100%-22px)]">
                  {dayEvents.slice(0, 2).map((event, idx) => (
                    <div
                      key={`${event.ticker}-${idx}`}
                      className="text-xs p-1 bg-gray-50 rounded truncate"
                    >
                      <span className="font-medium">{event.ticker}</span>
                      <span className="text-gray-500 ml-1">
                        {event.notes?.includes("Ex-Dividend") ? "(Ex)" : "(Pay)"}
                      </span>
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500 italic">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      
      {isDetailsOpen && selectedDate && (
        <DividendEventDetails
          date={selectedDate}
          events={selectedEvents}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
        />
      )}
    </Card>
  );
};

export default DividendCalendar;
