import Header from "@/components/Header";
import { HelpCircle, Mail, MessageCircle, Book } from "lucide-react";
import { Button } from "@/components/ui/button";

const Support = () => {
  return (
    <div className="min-h-screen bg-background pb-24 pt-24">
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <HelpCircle className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">Support Center</h1>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-card border border-border rounded-2xl p-6">
            <Mail className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Email Support</h3>
            <p className="text-muted-foreground mb-4">Get help from our support team</p>
            <Button className="w-full">support@screenvs.com</Button>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <MessageCircle className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Community Chat</h3>
            <p className="text-muted-foreground mb-4">Ask questions in our community</p>
            <Button className="w-full">Join Community</Button>
          </div>
        </div>

        <div className="space-y-6">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Book className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-bold mb-2">How do I sync my screen time data?</h3>
                <p className="text-muted-foreground">Connect via Apple Shortcuts or manually enter your daily screen time in the Dashboard. Data syncs automatically once connected.</p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-bold mb-2">How are efficiency scores calculated?</h3>
                <p className="text-muted-foreground">Efficiency scores are based on your screen time patterns and app usage categories. Productive apps boost your score, while time-wasting apps lower it.</p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-bold mb-2">Can I change teams mid-week?</h3>
                <p className="text-muted-foreground">No, team assignments are locked for the duration of the weekly competition. New teams are formed at the start of each week.</p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-bold mb-2">What happens if I come in last place?</h3>
                <p className="text-muted-foreground">Last place gets friendly roasts and memes from the community. It's all in good fun to keep everyone motivated!</p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-bold mb-2">Is my data private?</h3>
                <p className="text-muted-foreground">Yes! Only your username, efficiency score, and leaderboard ranking are visible to others. Detailed app usage remains private.</p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-bold mb-2">How do I delete my account?</h3>
                <p className="text-muted-foreground">Go to Settings → Account → Delete Account. All your data will be permanently removed.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Support;
