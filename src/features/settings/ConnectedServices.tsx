import { useState } from "react";
import { Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useSettings } from "@/lib/data/queries";
import { setSyncConnected } from "@/lib/data/mutations";
import { syncCopy } from "../dashboard/copy";
import { useToast } from "@/hooks/use-toast";

interface SyncService {
  name: string;
  enabled: boolean;
  description: string;
  icon: string;
  disabled?: boolean;
}

export const ConnectedServices = () => {
  const { data: settings } = useSettings();
  const [isTroubleshootOpen, setIsTroubleshootOpen] = useState(false);
  const { toast } = useToast();

  const services: SyncService[] = [
    {
      name: "Apple Shortcuts",
      enabled: settings?.sync_connected || false,
      description: "Primary data source for daily screen-time tracking.",
      icon: "🍎",
      disabled: false,
    },
    {
      name: "Webhooks",
      enabled: false,
      description: "Future integration for Android or external imports.",
      icon: "🌐",
      disabled: true,
    },
  ];

  const handleToggle = async (serviceName: string) => {
    if (serviceName === "Apple Shortcuts") {
      const newEnabled = !settings?.sync_connected;
      await setSyncConnected(newEnabled);
      
      toast({
        title: newEnabled ? "Service enabled" : "Service disabled",
        description: `${serviceName} has been ${newEnabled ? "enabled" : "disabled"}.`,
        duration: 2000,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Connected Services Card */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Connected Services</h3>
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.name}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                service.enabled
                  ? "border-primary/20 bg-primary/5"
                  : "border-border bg-card"
              } ${service.disabled ? "opacity-50" : ""}`}
            >
              <div className="flex items-start gap-4 flex-1">
                {/* Service Icon */}
                <div className="text-3xl">{service.icon}</div>

                {/* Service Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{service.name}</h4>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5"
                          >
                            <Info className="w-3 h-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-xs">
                            We'll never access private data; only total usage time.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {service.disabled && (
                      <span className="text-xs text-muted-foreground">
                        (Coming soon)
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {service.description}
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <Switch
                checked={service.enabled}
                onCheckedChange={() => handleToggle(service.name)}
                disabled={service.disabled}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Troubleshooting Section */}
      <Collapsible
        open={isTroubleshootOpen}
        onOpenChange={setIsTroubleshootOpen}
      >
        <Card className="p-6">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex items-center justify-between p-0 h-auto"
            >
              <h4 className="font-semibold">{syncCopy.troubleshoot.title}</h4>
              {isTroubleshootOpen ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <ul className="space-y-2">
              {syncCopy.troubleshoot.steps.map((step, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="text-primary mt-0.5">•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
};
