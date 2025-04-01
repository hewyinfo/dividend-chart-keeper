
# Dividend Tracker Application Guide

## Overview
The Dividend Tracker is a web application designed to help investors monitor and manage their dividend income. It provides tools for tracking dividend events, visualizing payment patterns, and monitoring cash utilization over time.

## Features

### Authentication
- User account creation and login functionality
- Secure data storage linked to user accounts
- Development bypass option for testing

### Dividend Event Management
- **Add Dividend Events**
  - Enter ticker symbols with search functionality
  - Record ex-dividend and payment dates
  - Track dividend amounts and yields
  - Add notes for each dividend event
  - Calculate yield on cost based on purchase price
  
- **Cash Utilization Tracking**
  - Add cash deposits or withdrawals
  - Track total cash invested in dividend stocks
  
- **Edit & Delete Events**
  - Modify existing dividend entries
  - Bulk selection for multiple deletions
  - Individual event editing capabilities
  
- **Search & Filter**
  - Filter by ticker symbol
  - Filter by safety score rating
  - Search by notes or ticker

### Data Visualization
- **Chart Views**
  - Line charts of dividend payments over time
  - Bar charts of cash utilization
  - Visual representation of dividend income trends
  
- **List View**
  - Sortable columns (date, amount, ticker, etc.)
  - Pagination for large datasets
  - Visual indicators for received vs. pending dividends
  
- **Calendar View**
  - Monthly calendar showing upcoming dividend dates
  - Visual distinction between ex-dividend and payment dates

### Data Management
- **Export Functionality**
  - CSV export of dividend data
  - Downloadable records for external analysis

## Technical Implementation

### Components
- **EventModal**
  - Form for adding and editing dividend events
  - Integration with stock data search
  - Validation for required fields
  
- **SearchTickerModal**
  - Ticker symbol search functionality
  - Display of stock information including:
    - Current price
    - Dividend yield
    - Payment dates
    - Safety scores
  
- **DividendListView**
  - Tabular display of dividend events
  - Sorting by any column
  - Pagination controls
  - Edit and delete actions
  - Bulk selection capability

### Data Model
- **DividendEvent**
  - `id`: Unique identifier
  - `ticker`: Stock symbol
  - `exDate`: Ex-dividend date
  - `payDate`: Payment date
  - `yield`: Dividend yield percentage
  - `received`: Whether dividend has been received
  - `amount`: Dividend amount
  - `status`: Confirmed or Projected
  - `notes`: Additional information
  - `yieldOnCost`: Yield based on purchase price
  - `price`: Stock price at purchase
  - `safetyScore`: Reliability rating
  
- **StockData**
  - Stock price information
  - Company name
  - Dividend history
  - Security details

### Workflow
1. **Adding Dividend Events**
   - Click "Add Dividend" button
   - Enter ticker or search for stock
   - Fill in dividend details
   - Submit form
   
2. **Tracking Receipt**
   - Update dividend status when received
   - Toggle "Mark as Received" checkbox
   
3. **Analyzing Performance**
   - View charts for income trends
   - Monitor cash utilization
   - Track yield on cost

4. **Data Management**
   - Export to CSV for external analysis
   - Filter and search for specific records
   - Bulk edit or delete operations

## Styling and Design
- Responsive layout works on mobile and desktop
- Dark mode support
- Color-coded status indicators:
  - Green for received dividends
  - Yellow for pending dividends
  - Safety score indicators (High/Medium/Low)

## Technical Stack
- React with TypeScript
- Tailwind CSS for styling
- Shadcn UI components
- React Hook Form for form handling
- Recharts for data visualization
- Supabase for data persistence (optional)

## Best Practices
- **Dividend Tracking**
  - Record all dividend events promptly
  - Update receipt status when dividends are paid
  - Include purchase price for accurate yield on cost calculations
  
- **Data Management**
  - Regularly export data as backup
  - Use notes field for contextual information
  - Maintain consistency in data entry

## Troubleshooting
- If dividends aren't appearing in charts, verify the date formats
- For missing stock data, try refreshing the search or check ticker symbol
- Use the development mode to test functionality without authentication

## Future Enhancements
- Portfolio performance metrics
- Dividend growth tracking
- Tax reporting features
- Mobile application
