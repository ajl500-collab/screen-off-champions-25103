import Header from "@/components/Header";
import { SyncStatus } from "@/features/settings/SyncStatus";
import { SyncWebhook } from "@/features/settings/SyncWebhook";
import { ConnectedServices } from "@/features/settings/ConnectedServices";
import { CsvImport } from "@/features/ingest/CsvImport";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const SyncSettings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24 pt-24">
      <Header />

      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/settings")}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Settings
          </Button>
          <h1 className="text-2xl font-bold mb-2">Sync Status</h1>
          <p className="text-muted-foreground">
            Manage your screen-time data connections and integrations.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <SyncStatus />
        <SyncWebhook />
        <ConnectedServices />
        <CsvImport />
      </div>
    </div>
  );
};

export default SyncSettings;
