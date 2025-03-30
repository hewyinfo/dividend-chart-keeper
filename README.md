
# Dividend App

A modern React application for tracking dividend events, visualizing payouts, and monitoring cash utilization over time.

## Features

- **Add Dividend Events**: Easily add new dividend events with ticker symbol, dates, and yield information.
- **Track Receipt Status**: Mark dividends as received to maintain accurate records.
- **Visualize Data**: View dividend payouts and cash utilization through interactive charts.
- **Responsive Design**: Works seamlessly on desktop and mobile devices.

## Project Structure

```
dividend-app/
├── src/
│   ├── components/
│   │   ├── BarChartComponent.tsx    # Bar chart for cash utilization
│   │   ├── EventModal.tsx           # Modal form for adding dividend events
│   │   └── LineChartComponent.tsx   # Line chart for dividend payouts
│   ├── pages/
│   │   └── Index.tsx                # Main Calendar page
│   ├── types/
│   │   └── dividend.ts              # TypeScript interfaces
│   ├── App.tsx                      # Main application component
│   └── index.css                    # Global styles
```

## Technologies Used

- **React**: Front-end library for building user interfaces
- **TypeScript**: Static typing for better code quality
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Composable charting library
- **React Hook Form**: Form handling with validation
- **date-fns**: Date utility library
- **shadcn/ui**: UI component library

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open your browser to: `http://localhost:8080`

## Usage

1. Click the "Add Dividend Event" button to open the form modal
2. Fill in the required fields (Ticker Symbol and Ex-Dividend Date)
3. Optionally add Pay Date, Dividend Yield, and check "Mark as Received" if applicable
4. Submit the form to add the event
5. View the event in the list and see updated charts

## Accessibility Features

- ARIA labels on interactive elements
- Keyboard navigation support
- Form validation with error messages
- Color contrast compliance
- Focus management in modal dialogs

## Future Enhancements

- Data persistence with local storage or backend integration
- Calendar view for visualizing dividend dates
- Filtering and sorting options for dividend events
- Portfolio performance metrics
- Export/import functionality for data backup
