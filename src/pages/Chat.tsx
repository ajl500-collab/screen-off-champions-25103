import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Image, Smile, Mic } from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  user_id: string;
  content: string;
  message_type: string;
  created_at: string;
  profiles?: {
    display_name: string;
    avatar_emoji: string;
  };
}

const Chat = () => {
  const [activeTab, setActiveTab] = useState<"community" | "team">("community");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
    
    // Subscribe to new messages
    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_type=eq.${activeTab}`
        },
        (payload) => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeTab]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          id,
          user_id,
          content,
          message_type,
          created_at
        `)
        .eq('chat_type', activeTab)
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) throw error;
      
      // Fetch profiles separately
      const userIds = [...new Set(data?.map(m => m.user_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_emoji')
        .in('id', userIds);

      // Merge profiles with messages
      const messagesWithProfiles = data?.map(msg => ({
        ...msg,
        profiles: profiles?.find(p => p.id === msg.user_id)
      })) || [];

      setMessages(messagesWithProfiles as any);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          chat_type: activeTab,
          message_type: 'text',
          content: newMessage
        });

      if (error) throw error;
      setNewMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Chat</h1>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "community" | "team")} className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="team">Team Chat</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {/* Messages Container */}
            <div className="bg-card border border-border rounded-2xl p-4 mb-4" style={{ height: 'calc(100vh - 280px)', overflowY: 'auto' }}>
              {loading ? (
                <div className="text-center text-muted-foreground">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-center text-muted-foreground">No messages yet. Start the conversation!</div>
              ) : (
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div key={message.id} className="bg-muted/20 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{message.profiles?.avatar_emoji || '😎'}</span>
                        <span className="font-semibold text-sm">{message.profiles?.display_name || 'Player'}</span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="bg-card border border-border rounded-2xl p-3">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Image className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Smile className="w-5 h-5" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Mic className="w-5 h-5" />
                </Button>
                <Button onClick={sendMessage} size="icon" className="bg-primary">
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Chat;
