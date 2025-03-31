
import React from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface DividendHeaderProps {
  onOpenSettings: () => void;
}

const DividendHeader: React.FC<DividendHeaderProps> = ({ onOpenSettings }) => {
  const { user, signOut } = useAuth();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dividend Calendar</h1>
        <p className="text-muted-foreground">
          Track and manage your dividend investments
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
        <Button variant="outline" onClick={onOpenSettings} className="w-full md:w-auto">
          <Settings className="mr-2 h-4 w-4" />
          API Settings
        </Button>
        <Button variant="outline" onClick={signOut} className="w-full md:w-auto">
          Sign Out
        </Button>
        {user && (
          <div className="flex items-center bg-muted px-4 py-2 rounded-md text-sm">
            {user.email}
          </div>
        )}
      </div>
    </div>
  );
};

export default DividendHeader;
