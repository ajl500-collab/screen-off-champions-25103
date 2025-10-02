import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Send, Image as ImageIcon, Mic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import EmojiPicker from "./EmojiPicker";
import GifPicker from "./GifPicker";

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
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
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
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
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
      // Upload to a temporary storage location (you'd set up a proper bucket)
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${currentUserId}/${fileName}`;

      toast({
        title: "Uploading...",
        description: "Your image is being uploaded",
      });

      // For now, use a data URL as placeholder
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
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
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

  const handleVoiceMessage = () => {
    toast({
      title: "Coming Soon",
      description: "Voice messages will be available soon!",
    });
  };

  return (
    <div className="fixed inset-0 bg-background z-[60] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <h2 className="text-xl font-bold">Chat</h2>
        </div>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "community" | "team")} className="flex-1 flex flex-col">
        <TabsList className="w-full rounded-none border-b">
          <TabsTrigger value="community" className="flex-1">
            Community Chat
          </TabsTrigger>
          <TabsTrigger value="team" className="flex-1">
            Team Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="community" className="flex-1 flex flex-col mt-0">
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.user_id === currentUserId ? "flex-row-reverse" : ""
                  }`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      {message.profiles?.avatar_emoji || "😊"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`flex flex-col ${
                      message.user_id === currentUserId ? "items-end" : ""
                    }`}
                  >
                    <span className="text-xs text-muted-foreground mb-1">
                      {message.profiles?.display_name || "User"}
                    </span>
                    <div
                      className={`rounded-2xl px-4 py-3 max-w-[70vw] shadow-sm ${
                        message.user_id === currentUserId
                          ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground"
                          : "bg-card border border-border"
                      }`}
                    >
                      {message.media_url ? (
                        <img
                          src={message.media_url}
                          alt="Shared media"
                          className="rounded-lg max-w-full"
                        />
                      ) : (
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="team" className="flex-1 flex flex-col mt-0">
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            {!currentTeamId ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Join a team to access team chat
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.user_id === currentUserId ? "flex-row-reverse" : ""
                    }`}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        {message.profiles?.avatar_emoji || "😊"}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`flex flex-col ${
                        message.user_id === currentUserId ? "items-end" : ""
                      }`}
                    >
                      <span className="text-xs text-muted-foreground mb-1">
                        {message.profiles?.display_name || "User"}
                      </span>
                      <div
                        className={`rounded-2xl px-4 py-3 max-w-[70vw] shadow-sm ${
                          message.user_id === currentUserId
                            ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground"
                            : "bg-card border border-border"
                        }`}
                      >
                        {message.media_url ? (
                          <img
                            src={message.media_url}
                            alt="Shared media"
                            className="rounded-lg max-w-full"
                          />
                        ) : (
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">
                        {new Date(message.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Input Area */}
      <div className="p-4 border-t bg-card/50 backdrop-blur-sm">
        <div className="bg-muted/50 rounded-2xl p-2 border border-border/50">
          <div className="flex gap-2 items-center">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*,video/*"
              onChange={handleFileUpload}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="hover:bg-primary/10 hover:text-primary transition-colors"
              title="Upload Image"
            >
              <ImageIcon className="w-5 h-5" />
            </Button>
            <GifPicker onGifSelect={handleGifSelect} />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleVoiceMessage}
              className="hover:bg-primary/10 hover:text-primary transition-colors"
              title="Voice Message"
            >
              <Mic className="w-5 h-5" />
            </Button>
            <EmojiPicker onEmojiSelect={handleEmojiSelect} />
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              disabled={isLoading || (activeTab === "team" && !currentTeamId)}
              className="flex-1 border-0 bg-background/50 focus-visible:ring-1 focus-visible:ring-primary"
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !newMessage.trim() || (activeTab === "team" && !currentTeamId)}
              size="icon"
              className="bg-primary hover:bg-primary/90 transition-all hover:scale-105"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
