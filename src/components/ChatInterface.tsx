import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, Image as ImageIcon, Smile, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import EmojiPicker from "./EmojiPicker";
import GifPicker from "./GifPicker";
import ImageZoomDialog from "./ImageZoomDialog";

interface Message {
  id: string;
  user_id: string;
  content: string;
  message_type: string;
  chat_type: string;
  created_at: string;
  media_url?: string;
  profiles?: {
    display_name: string;
    avatar_emoji: string;
  };
}

interface ChatInterfaceProps {
  onClose: () => void;
}

const ChatInterface = ({ onClose }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentTeamId, setCurrentTeamId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"community" | "team">("community");
  const [isLoading, setIsLoading] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      loadMessages();
      subscribeToMessages();
    }
  }, [currentUserId, activeTab, currentTeamId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCurrentUserId(user.id);
      
      try {
        const { data: teamMember }: any = await (supabase as any)
          .from("team_members")
          .select("team_id")
          .eq("user_id", user.id)
          .single();
        
        if (teamMember) {
          setCurrentTeamId(teamMember.team_id);
        }
      } catch (error) {
        console.log("No team found for user");
      }
    }
  };

  const loadMessages = async () => {
    try {
      let query = (supabase as any)
        .from("chat_messages")
        .select(`
          *,
          profiles:user_id (
            display_name,
            avatar_emoji
          )
        `)
        .eq("chat_type", activeTab)
        .order("created_at", { ascending: true })
        .limit(100);

      if (activeTab === "team" && currentTeamId) {
        query = query.eq("team_id", currentTeamId);
      }

      const { data, error } = await query;

      if (error) {
        toast({
          title: "Error loading messages",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setMessages(data || []);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`chat-${activeTab}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `chat_type=eq.${activeTab}`,
        },
        async (payload: any) => {
          try {
            const { data: profile }: any = await (supabase as any)
              .from("profiles")
              .select("display_name, avatar_emoji")
              .eq("id", payload.new.user_id)
              .single();

            setMessages((current) => [
              ...current,
              { ...payload.new, profiles: profile } as Message,
            ]);
          } catch (error) {
            console.error("Error fetching profile:", error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUserId) return;

    setIsLoading(true);

    const messageData: any = {
      user_id: currentUserId,
      content: newMessage,
      message_type: "text",
      chat_type: activeTab,
    };

    if (activeTab === "team" && currentTeamId) {
      messageData.team_id = currentTeamId;
    }

    try {
      const { error } = await (supabase as any)
        .from("chat_messages")
        .insert([messageData]);

      if (error) {
        toast({
          title: "Error sending message",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentUserId) return;

    setIsLoading(true);

    try {
      toast({
        title: "Uploading...",
        description: "Your image is being uploaded",
      });

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        
        const messageData: any = {
          user_id: currentUserId,
          content: file.name,
          message_type: "image",
          chat_type: activeTab,
          media_url: base64String,
        };

        if (activeTab === "team" && currentTeamId) {
          messageData.team_id = currentTeamId;
        }

        const { error } = await (supabase as any)
          .from("chat_messages")
          .insert([messageData]);

        if (error) {
          toast({
            title: "Error",
            description: "Failed to send image",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success",
            description: "Image sent successfully",
          });
        }
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
  };

  const handleGifSelect = async (gifUrl: string) => {
    if (!currentUserId) return;

    setIsLoading(true);

    const messageData: any = {
      user_id: currentUserId,
      content: "GIF",
      message_type: "gif",
      chat_type: activeTab,
      media_url: gifUrl,
    };

    if (activeTab === "team" && currentTeamId) {
      messageData.team_id = currentTeamId;
    }

    try {
      const { error } = await (supabase as any)
        .from("chat_messages")
        .insert([messageData]);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to send GIF",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending GIF:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-[60] flex flex-col">
      {/* Header */}
      <div className="flex-none p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <h2 className="text-lg font-bold">Chat</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-none border-b border-border bg-card">
        <div className="flex">
          <button
            onClick={() => setActiveTab("community")}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === "community"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            Community
            {activeTab === "community" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("team")}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === "team"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            Team Chat
            {activeTab === "team" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-background">
        {activeTab === "team" && !currentTeamId ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Join a team to access team chat
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${
                  message.user_id === currentUserId ? "flex-row-reverse" : ""
                }`}
              >
                <Avatar className="w-8 h-8 flex-none">
                  <AvatarFallback className="text-sm">
                    {message.profiles?.avatar_emoji || "😊"}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`flex flex-col ${
                    message.user_id === currentUserId ? "items-end" : "items-start"
                  } max-w-[75%]`}
                >
                  <span className="text-xs text-muted-foreground mb-1 px-1">
                    {message.profiles?.display_name || "User"}
                  </span>
                  <div
                    className={`rounded-3xl px-4 py-2.5 ${
                      message.user_id === currentUserId
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border"
                    }`}
                  >
                    {message.media_url ? (
                      <img
                        src={message.media_url}
                        alt="Shared media"
                        className="rounded-2xl max-w-[250px] max-h-[300px] cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setZoomedImage(message.media_url!)}
                      />
                    ) : (
                      <p className="text-sm break-words">{message.content}</p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1 px-1">
                    {new Date(message.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="flex-none p-3 border-t border-border bg-card">
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
          />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || (activeTab === "team" && !currentTeamId)}
            className="flex-none hover:bg-accent"
          >
            <ImageIcon className="w-5 h-5" />
          </Button>

          <GifPicker onGifSelect={handleGifSelect} />

          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Message..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              disabled={isLoading || (activeTab === "team" && !currentTeamId)}
              className="pr-10 rounded-full border-border bg-muted"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <EmojiPicker onEmojiSelect={handleEmojiSelect} />
            </div>
          </div>

          <Button
            onClick={sendMessage}
            disabled={isLoading || !newMessage.trim() || (activeTab === "team" && !currentTeamId)}
            size="icon"
            className="flex-none rounded-full bg-primary hover:bg-primary/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Image Zoom Dialog */}
      <ImageZoomDialog 
        imageUrl={zoomedImage || ''} 
        isOpen={!!zoomedImage} 
        onClose={() => setZoomedImage(null)} 
      />
    </div>
  );
};

export default ChatInterface;