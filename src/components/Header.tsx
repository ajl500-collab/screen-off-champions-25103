import logo from "@/assets/screen-vs-logo.png";
import { useNavigate } from "react-router-dom";
import { Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const navigate = useNavigate();
  const [rank, setRank] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserRank = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setRank(null);
        setUserId(null);
        return;
      }
      
      setUserId(session.user.id);
      
      // Get current user's efficiency score
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('efficiency_score')
        .eq('id', session.user.id)
        .single();
      
      if (!currentProfile) return;
      
      // Count how many users have higher efficiency score
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gt('efficiency_score', currentProfile.efficiency_score);
      
      setRank((count || 0) + 1);
    };
    
    fetchUserRank();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUserRank();
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/")}
          >
            <img 
              src={logo} 
              alt="Screen VS Logo" 
              className="w-12 h-12 object-contain"
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Screen<span className="italic">VS</span>
            </h1>
          </div>
          
          {rank && userId && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <Trophy className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">#{rank}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
