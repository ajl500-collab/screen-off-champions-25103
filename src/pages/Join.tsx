import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { joinSquad } from "@/lib/data/mutations";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Join = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const code = searchParams.get("code");
    
    if (!code) {
      toast.error("No invite code provided");
      setStatus("error");
      setTimeout(() => navigate("/communities"), 2000);
      return;
    }

    const handleJoin = async () => {
      try {
        await joinSquad(code);
        toast.success("Successfully joined squad!");
        setStatus("success");
        setTimeout(() => navigate("/communities"), 1500);
      } catch (error: any) {
        console.error("Failed to join squad:", error);
        if (error.message.includes("Already a member")) {
          toast.error("You're already in this squad");
        } else if (error.message.includes("Invalid invite code")) {
          toast.error("Invalid invite code");
        } else {
          toast.error("Failed to join squad");
        }
        setStatus("error");
        setTimeout(() => navigate("/communities"), 2000);
      }
    };

    handleJoin();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        {status === "loading" && (
          <>
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="text-lg text-foreground">Joining squad...</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="text-6xl">🎉</div>
            <p className="text-lg text-foreground">Successfully joined!</p>
            <p className="text-sm text-muted-foreground">Redirecting...</p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="text-6xl">😢</div>
            <p className="text-lg text-foreground">Failed to join squad</p>
            <p className="text-sm text-muted-foreground">Redirecting...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Join;
