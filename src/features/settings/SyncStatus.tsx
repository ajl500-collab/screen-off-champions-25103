import { useState, useEffect } from "react";
import { Check, X, Loader2, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockSyncData } from "../dashboard/mockData";
import { syncCopy } from "../dashboard/copy";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "screenVS-sync-status";

export const SyncStatus = () => {
  const [connected, setConnected] = useState(mockSyncData.connected);
  const [lastUpdated, setLastUpdated] = useState(mockSyncData.lastUpdatedMinutesAgo);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const { toast } = useToast();

  // Load sync state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      setConnected(data.connected);
      setLastUpdated(data.lastUpdated);
    }
  }, []);

  // Save sync state to localStorage
  const saveSyncState = (isConnected: boolean, minutesAgo: number) => {
    const data = { connected: isConnected, lastUpdated: minutesAgo };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  // Mock reconnect flow
  const handleReconnect = async () => {
    setIsReconnecting(true);
    
    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const newConnected = !connected;
    setConnected(newConnected);
    setLastUpdated(0);
    saveSyncState(newConnected, 0);
    
    setIsReconnecting(false);
    
    toast({
      title: newConnected ? syncCopy.success : "Disconnected",
      description: newConnected ? syncCopy.connected.message : syncCopy.disconnected.message,
      duration: 2000,
    });
  };

  const status = connected ? syncCopy.connected : syncCopy.disconnected;
  const statusIcon = connected ? (
    <Check className="w-6 h-6 text-success" />
  ) : (
    <X className="w-6 h-6 text-destructive" />
  );

  return (
    <Card
      className={`p-6 transition-all duration-300 animate-fade-in ${
        connected
          ? "border-success bg-success/5"
          : "border-destructive bg-destructive/5 animate-pulse"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          {/* Status Icon */}
          <div
            className={`p-3 rounded-full ${
              connected ? "bg-success/20" : "bg-destructive/20"
            }`}
          >
            {statusIcon}
          </div>

          {/* Status Info */}
          <div>
            <h3 className="text-lg font-bold mb-1">{status.title}</h3>
            <p
              className={`text-sm mb-2 ${
                connected ? "text-success" : "text-destructive"
              }`}
            >
              {status.subtitle}
            </p>
            <p className="text-xs text-muted-foreground">
              {connected
                ? syncCopy.lastUpdated.replace("{minutes}", lastUpdated.toString())
                : status.message}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleReconnect}
          disabled={isReconnecting}
          variant={connected ? "outline" : "default"}
          className="gap-2"
        >
          {isReconnecting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {syncCopy.reconnecting}
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              {connected ? "Reconnect" : "Connect Now"}
            </>
          )}
        </Button>
      </div>

      {/* Status Message */}
      <div
        className={`text-sm font-medium ${
          connected ? "text-success" : "text-destructive"
        }`}
      >
        {status.message}
      </div>
    </Card>
  );
};
