import { useState, useEffect, useRef } from "react";
import { useMessages } from "@/lib/data/queries";
import { sendMessage as sendMessageMutation } from "@/lib/data/mutations";
import { subscribeToMessages } from "@/lib/realtime";
import { useProfile } from "@/lib/data/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { moderateText } from "@/lib/moderation";
import { checkChatRateLimit } from "@/lib/rateLimit";
import { format } from "date-fns";
import { trackEvent } from "@/lib/analytics";

interface SquadChatProps {
  squadId: string;
}

interface OptimisticMessage {
  id: string;
  squad_id: string;
  user_id: string;
  content: string;
  created_at: string;
  pending?: boolean;
  error?: boolean;
}

export const SquadChat = ({ squadId }: SquadChatProps) => {
  const { data: messages = [], refetch } = useMessages(squadId);
  const { data: profile } = useProfile();
  const [input, setInput] = useState("");
  const [optimisticMessages, setOptimisticMessages] = useState<OptimisticMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Combine real messages with optimistic messages
  const allMessages: OptimisticMessage[] = [
    ...messages.map(m => ({ ...m, pending: false, error: false })),
    ...optimisticMessages
  ];

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [allMessages]);

  // Subscribe to realtime messages
  useEffect(() => {
    if (!squadId) return;

    const unsubscribe = subscribeToMessages(squadId, (newMessage) => {
      // Remove optimistic message if this is our message
      setOptimisticMessages(prev => 
        prev.filter(m => m.content !== newMessage.content)
      );
      refetch();
    });

    return unsubscribe;
  }, [squadId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || !profile) return;

    const content = input.trim();
    
    // Moderation check
    const modResult = await moderateText(content);
    if (!modResult.ok) {
      toast.error(modResult.reason || "Message contains inappropriate content");
      return;
    }

    // Rate limit check
    if (!checkChatRateLimit(profile.id)) {
      toast.error("Slow down! You're sending messages too quickly");
      return;
    }

    // Create optimistic message
    const optimisticMsg: OptimisticMessage = {
      id: `temp-${Date.now()}`,
      squad_id: squadId,
      user_id: profile.id,
      content,
      created_at: new Date().toISOString(),
      pending: true,
    };

    setOptimisticMessages(prev => [...prev, optimisticMsg]);
    setInput("");
    setIsSending(true);

    try {
      await sendMessageMutation(squadId, content);
      trackEvent("message_sent", { squad_id: squadId, length: content.length });
      // Success - realtime will handle adding the real message
    } catch (error: any) {
      console.error("Failed to send message:", error);
      // Mark optimistic message as error
      setOptimisticMessages(prev =>
        prev.map(m =>
          m.id === optimisticMsg.id ? { ...m, error: true, pending: false } : m
        )
      );
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border border-border rounded-lg bg-card">
      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {allMessages.map((message) => {
            const isOwn = message.user_id === profile?.id;
            return (
              <div
                key={message.id}
                className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{message.user_id.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className={`flex flex-col ${isOwn ? "items-end" : ""}`}>
                  <div
                    className={`px-4 py-2 rounded-lg max-w-[70%] ${
                      isOwn
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    } ${message.pending ? "opacity-60" : ""} ${
                      message.error ? "border-2 border-destructive" : ""
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {format(new Date(message.created_at), "HH:mm")}
                    {message.pending && " (sending...)"}
                    {message.error && " (failed)"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={isSending}
            maxLength={1000}
          />
          <Button type="submit" size="icon" disabled={isSending || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
