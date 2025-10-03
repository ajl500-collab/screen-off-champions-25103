import Header from "@/components/Header";
import { Shield } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background pb-24 pt-24">
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
        </div>
        
        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Your Privacy Matters</h2>
            <p>At ScreenVS, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Information We Collect</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Screen time data from your devices</li>
              <li>Profile information (username, display name, avatar)</li>
              <li>Usage statistics and app categories</li>
              <li>Team and community activity data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">How We Use Your Data</h2>
            <p>Your data is used exclusively to:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Calculate efficiency scores and leaderboard rankings</li>
              <li>Provide personalized insights and recommendations</li>
              <li>Enable team competitions and community features</li>
              <li>Improve the app experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Data Security</h2>
            <p>We implement industry-standard security measures to protect your information. Your screen time data is encrypted and stored securely.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Your Rights</h2>
            <p>You have the right to access, modify, or delete your personal data at any time through your profile settings.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Contact Us</h2>
            <p>For privacy concerns or questions, contact us at privacy@screenvs.com</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
