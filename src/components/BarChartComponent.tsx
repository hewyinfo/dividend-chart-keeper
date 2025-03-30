
import React, { useMemo } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";
import { format, parseISO, addMonths, isBefore } from "date-fns";
import { DividendEvent } from "@/types/dividend";

interface BarChartComponentProps {
  dividendEvents: DividendEvent[];
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({ dividendEvents }) => {
  const chartData = useMemo(() => {
    if (dividendEvents.length === 0) {
      // Generate sample data if no events
      const sampleData = [];
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 6);
      
      for (let i = 0; i < 7; i++) {
        const currentDate = addMonths(startDate, i);
        sampleData.push({
          date: format(currentDate, "MMM yyyy"),
          used: Math.floor(Math.random() * 500) + 100,
        });
      }
      return sampleData;
    }
    
    // Process actual dividend events
    const now = new Date();
    const sixMonthsAgo = addMonths(now, -6);
    
    // Filter events in the last 6 months
    const relevantEvents = dividendEvents
      .filter(event => isBefore(sixMonthsAgo, parseISO(event.exDate)))
      .map(event => ({
        date: format(parseISO(event.exDate), "MMM yyyy"),
        // Simulate cash utilized based on yield - if yield is not provided, use random value
        used: event.yield ? Math.floor(event.yield * 100) : Math.floor(Math.random() * 300) + 100
      }));
    
    // Group by month and sum values
    const groupedData: Record<string, number> = {};
    relevantEvents.forEach(item => {
      if (groupedData[item.date]) {
        groupedData[item.date] += item.used;
      } else {
        groupedData[item.date] = item.used;
      }
    });
    
    // Convert to array for Recharts
    return Object.entries(groupedData).map(([date, used]) => ({
      date,
      used
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
    <div className="h-[300px]" role="img" aria-label="Bar chart of cash utilized over time">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
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
            formatter={(value) => [`$${value}`, "Cash Utilized"]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          <Bar 
            dataKey="used" 
            fill="#4ADE80" 
            radius={[4, 4, 0, 0]}
            name="Cash Utilized"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
