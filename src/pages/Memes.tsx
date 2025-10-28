import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MemeBank } from "@/features/memes/MemeBank";
import { RoastEngine } from "@/features/memes/RoastEngine";
import { supabase } from "@/integrations/supabase/client";
import { memesCopy } from "@/features/dashboard/copy";

const Memes = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background pb-24 pt-20">
      <Header />
      
      {/* Header */}
      <div className="bg-card/50 backdrop-blur-sm border-b border-border/50 px-4 py-4 sticky top-16 z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold">{memesCopy.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Safe, funny roasts powered by your stats
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <Tabs defaultValue="bank" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="bank">Meme Bank</TabsTrigger>
            <TabsTrigger value="roast">Roast Engine</TabsTrigger>
          </TabsList>

          <TabsContent value="bank">
            <MemeBank />
          </TabsContent>

          <TabsContent value="roast">
            <RoastEngine />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Memes;
