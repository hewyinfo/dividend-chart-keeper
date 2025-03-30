
import React, { useMemo } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";
import { format, parseISO, addMonths, isBefore } from "date-fns";
import { DividendEvent, ChartDataPoint } from "@/types/dividend";

interface LineChartComponentProps {
  dividendEvents: DividendEvent[];
}

const LineChartComponent: React.FC<LineChartComponentProps> = ({ dividendEvents }) => {
  const chartData = useMemo(() => {
    if (dividendEvents.length === 0) {
      // Generate sample data if no events
      const sampleData: ChartDataPoint[] = [];
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 6);
      
      for (let i = 0; i < 7; i++) {
        const currentDate = addMonths(startDate, i);
        sampleData.push({
          date: format(currentDate, "MMM yyyy"),
          value: Math.floor(Math.random() * 80) + 20,
        });
      }
      return sampleData;
    }
    
    // Process actual dividend events
    const now = new Date();
    const sixMonthsAgo = addMonths(now, -6);
    
    // Get all payDates that have a valid date and are within the last 6 months
    const payoutDates = dividendEvents
      .filter(event => event.payDate && isBefore(sixMonthsAgo, parseISO(event.payDate)))
      .map(event => ({
        date: format(parseISO(event.payDate!), "MMM yyyy"),
        value: event.yield || 1 // Use yield or default to 1
      }));
    
    // Group by month and sum values
    const groupedData: Record<string, number> = {};
    payoutDates.forEach(item => {
      if (groupedData[item.date]) {
        groupedData[item.date] += item.value;
      } else {
        groupedData[item.date] = item.value;
      }
    });
    
    // Convert to array for Recharts
    return Object.entries(groupedData).map(([date, value]) => ({
      date,
      value: Number(value.toFixed(2))
    })).sort((a, b) => {
      // Sort by date
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
  }, [dividendEvents]);
  
  if (chartData.length === 0) {
    return <div className="h-[300px] flex items-center justify-center text-gray-400">No data available</div>;
  }

  return (
    <div className="h-[300px]" role="img" aria-label="Line chart of dividend payouts over time">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tickMargin={10}
            stroke="#888888"
          />
          <YAxis 
            tickFormatter={(value) => `$${value}`}
            stroke="#888888"
          />
          <Tooltip 
            formatter={(value) => [`$${value}`, "Dividend Payout"]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6, stroke: "#2563EB" }}
            name="Dividend Payout"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;
