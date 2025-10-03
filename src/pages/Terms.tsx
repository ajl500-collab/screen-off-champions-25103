import Header from "@/components/Header";
import { FileText } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background pb-24 pt-24">
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <FileText className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">Terms of Service</h1>
        </div>
        
        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Acceptance of Terms</h2>
            <p>By using ScreenVS, you agree to these terms of service. Please read them carefully.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Fair Play Policy</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>All screen time data must be accurate and unmanipulated</li>
              <li>No cheating or gaming the system</li>
              <li>Respectful conduct in community chats and competitions</li>
              <li>No harassment or inappropriate content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">User Accounts</h2>
            <p>You are responsible for:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Maintaining the security of your account</li>
              <li>All activities that occur under your account</li>
              <li>Accurate profile information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Competition Rules</h2>
            <p>Weekly competitions are subject to our fair play policy. Winners are determined by efficiency scores calculated from verified screen time data.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Content Guidelines</h2>
            <p>Users must not post offensive, illegal, or inappropriate content. We reserve the right to remove content and suspend accounts that violate these guidelines.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Termination</h2>
            <p>We may terminate or suspend access to our service for violations of these terms without prior notice.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Continued use of ScreenVS constitutes acceptance of updated terms.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
