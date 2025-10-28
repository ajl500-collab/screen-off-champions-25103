import { useLatestRoast, useLatestMotivation } from "@/lib/ai/queries";
import { AIMessageCard } from "./AIMessageCard";
import { Skeleton } from "./ui/skeleton";

export const LatestAIMessage = () => {
  const { data: latestRoast, isLoading: roastLoading } = useLatestRoast();
  const { data: latestMotivation, isLoading: motivationLoading } = useLatestMotivation();

  if (roastLoading || motivationLoading) {
    return <Skeleton className="h-24 w-full" />;
  }

  // Determine which message is most recent
  const roastTime = latestRoast ? new Date(latestRoast.created_at).getTime() : 0;
  const motivationTime = latestMotivation ? new Date(latestMotivation.created_at).getTime() : 0;

  const latestMessage = roastTime > motivationTime ? latestRoast : latestMotivation;
  const messageType = roastTime > motivationTime ? "roast" : "motivation";

  if (!latestMessage) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-foreground">
        {messageType === "roast" ? "🔥 Latest Roast" : "✨ Latest Motivation"}
      </h3>
      <AIMessageCard
        content={latestMessage.content}
        type={messageType}
        createdAt={latestMessage.created_at}
        triggerReason={latestMessage.trigger_reason}
      />
    </div>
  );
};
