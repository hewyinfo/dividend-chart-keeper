import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DividendEvent, ChartDataPoint } from "@/types/dividend";
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, addMonths } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";

type TimeScale = "daily" | "weekly" | "monthly" | "quarterly" | "annually";

interface DividendChartProps {
  dividendEvents: DividendEvent[];
}

const DividendChart: React.FC<DividendChartProps> = ({ dividendEvents }) => {
  const [timeScale, setTimeScale] = React.useState<TimeScale>("monthly");
  const [showCashUtilized, setShowCashUtilized] = React.useState(true);
  const [showDividendsPaid, setShowDividendsPaid] = React.useState(true);
  const [showProjectedDividends, setShowProjectedDividends] = React.useState(true);

  // Generate chart data based on the time scale
  const chartData = React.useMemo(() => {
    if (!dividendEvents.length) {
      return [];
    }

    // Sort events by date
    const sortedEvents = [...dividendEvents].sort(
      (a, b) => new Date(a.exDate).getTime() - new Date(b.exDate).getTime()
    );

    // If no events, return empty array
    if (!sortedEvents.length) return [];

    const firstDate = parseISO(sortedEvents[0].exDate);
    const lastDate = addMonths(new Date(), 12); // Show projected data for next 12 months
    
    let datePoints: Date[] = [];
    
    // Generate date points based on time scale
    switch (timeScale) {
      case "daily":
        datePoints = eachDayOfInterval({ start: firstDate, end: lastDate });
        break;
      case "weekly":
        datePoints = eachDayOfInterval({ start: firstDate, end: lastDate })
          .filter((date, index) => index % 7 === 0);
        break;
      case "monthly":
        datePoints = Array.from({ length: 12 * 2 }) // 2 years of months
          .map((_, i) => startOfMonth(addMonths(firstDate, i)))
          .filter(date => date <= lastDate);
        break;
      case "quarterly":
        datePoints = Array.from({ length: 12 * 2 }) // 2 years of quarters
          .map((_, i) => startOfMonth(addMonths(firstDate, i)))
          .filter((date, index) => index % 3 === 0 && date <= lastDate);
        break;
      case "annually":
        datePoints = Array.from({ length: 5 }) // 5 years
          .map((_, i) => startOfMonth(addMonths(firstDate, i * 12)))
          .filter(date => date <= lastDate);
        break;
    }

    let cumulativePaid = 0;
    let cumulativeProjected = 0;
    let cashUtilized = 0;

    return datePoints.map(date => {
      const dateString = format(date, "yyyy-MM-dd");
      
      // Calculate dividends paid up to this date
      const paidEvents = sortedEvents.filter(
        event => 
          new Date(event.payDate || event.exDate) <= date && 
          event.received && 
          event.amount
      );
      
      paidEvents.forEach(event => {
        if (!isNaN(Number(event.amount))) {
          cumulativePaid += Number(event.amount);
        }
      });

      // Calculate projected dividends for this date
      const projectedEvents = sortedEvents.filter(
        event => 
          new Date(event.payDate || event.exDate) <= date && 
          !event.received && 
          event.amount
      );
      
      projectedEvents.forEach(event => {
        if (!isNaN(Number(event.amount))) {
          cumulativeProjected += Number(event.amount);
        }
      });

      // Calculate cash utilized for this date (assuming price * 100 shares per event)
      const investedEvents = sortedEvents.filter(
        event => new Date(event.exDate) <= date && event.price
      );
      
      investedEvents.forEach(event => {
        if (!isNaN(Number(event.price))) {
          cashUtilized += Number(event.price) * 100; // Assuming 100 shares per event
        }
      });

      return {
        date: dateString,
        cashUtilized,
        cumulativePaid,
        cumulativeProjected: cumulativePaid + cumulativeProjected,
        events: sortedEvents.filter(
          event => format(new Date(event.exDate), "yyyy-MM-dd") === dateString
        ),
      };
    });
  }, [dividendEvents, timeScale]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dateEvents = chartData.find(
        item => item.date === label
      )?.events || [];

      return (
        <div className="bg-white p-4 rounded-md shadow-md border border-gray-200 max-w-xs">
          <p className="font-semibold">{format(parseISO(label), "MMMM d, yyyy")}</p>
          
          {payload.map((entry: any) => (
            <p key={entry.name} className="text-sm">
              <span 
                className="inline-block w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}: ${entry.value.toFixed(2)}
            </p>
          ))}
          
          {dateEvents.length > 0 && (
            <div className="mt-2 border-t border-gray-200 pt-2">
              <p className="font-medium text-sm">Dividend Events:</p>
              <div className="max-h-32 overflow-auto">
                {dateEvents.map((event, idx) => (
                  <div key={idx} className="text-xs mt-1 p-1 bg-gray-50 rounded">
                    <div className="font-medium">{event.ticker}</div>
                    <div>Amount: ${event.amount?.toFixed(2) || "N/A"}</div>
                    <div>Ex-Date: {format(new Date(event.exDate), "MMM d, yyyy")}</div>
                    {event.payDate && (
                      <div>Pay Date: {format(new Date(event.payDate), "MMM d, yyyy")}</div>
                    )}
                    {event.notes && <div className="italic">{event.notes}</div>}
                    <Badge 
                      variant={event.received ? "success" : "outline"}
                      className={event.received ? "bg-green-100 text-green-800" : ""}
                    >
                      {event.received ? "Received" : "Pending"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Dividend Performance</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2">
          <ToggleGroup type="multiple" variant="outline" className="justify-start">
            <ToggleGroupItem 
              value="cash" 
              aria-label="Toggle Cash Utilized"
              data-state={showCashUtilized ? "on" : "off"}
              onClick={() => setShowCashUtilized(!showCashUtilized)}
              className="text-xs data-[state=on]:bg-green-100 data-[state=on]:text-green-800"
            >
              Cash
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="paid" 
              aria-label="Toggle Dividends Paid"
              data-state={showDividendsPaid ? "on" : "off"}
              onClick={() => setShowDividendsPaid(!showDividendsPaid)}
              className="text-xs data-[state=on]:bg-blue-100 data-[state=on]:text-blue-800"
            >
              Paid
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="projected" 
              aria-label="Toggle Projected Dividends"
              data-state={showProjectedDividends ? "on" : "off"}
              onClick={() => setShowProjectedDividends(!showProjectedDividends)}
              className="text-xs data-[state=on]:bg-blue-100 data-[state=on]:text-blue-800"
            >
              Projected
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <ToggleGroup type="single" value={timeScale} onValueChange={(value: TimeScale) => value && setTimeScale(value)}>
            <ToggleGroupItem value="daily" className="text-xs">Daily</ToggleGroupItem>
            <ToggleGroupItem value="weekly" className="text-xs">Weekly</ToggleGroupItem>
            <ToggleGroupItem value="monthly" className="text-xs">Monthly</ToggleGroupItem>
            <ToggleGroupItem value="quarterly" className="text-xs">Quarterly</ToggleGroupItem>
            <ToggleGroupItem value="annually" className="text-xs">Annually</ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(parseISO(date), "MMM d")}
              />
              <YAxis 
                yAxisId="left"
                orientation="left"
                stroke="#55DD6E"
                domain={[0, 'dataMax + 1000']}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke="#1831F2"
                domain={[0, 'dataMax + 500']}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {showCashUtilized && (
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="cashUtilized" 
                  name="Cash Utilized"
                  stroke="#55DD6E" 
                  strokeWidth={2}
                  dot={false}
                />
              )}
              {showDividendsPaid && (
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="cumulativePaid" 
                  name="Dividends Paid"
                  stroke="#1831F2" 
                  strokeWidth={2}
                  dot={false}
                />
              )}
              {showProjectedDividends && (
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="cumulativeProjected" 
                  name="Projected Dividends"
                  stroke="#1831F2" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DividendChart;
