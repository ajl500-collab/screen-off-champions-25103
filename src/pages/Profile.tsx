import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { PlayerCard } from "@/features/profile/PlayerCard";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Profile = () => {
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
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <h1 className="text-xl font-bold">Player Card</h1>
          <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Player Card Content */}
      <div className="px-4 pt-6 max-w-2xl mx-auto">
        <PlayerCard />
      </div>
    </div>
  );
};

export default Profile;
