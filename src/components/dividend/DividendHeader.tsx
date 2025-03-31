
import React from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

const DividendHeader: React.FC = () => {
  return (
    <header className="mb-8 flex flex-col items-center">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="text-3xl font-bold mb-2 text-center">Dividend Tracker</h1>
      <p className="text-muted-foreground text-center">
        Track and visualize your dividend investments
      </p>
    </header>
  );
};

export default DividendHeader;
