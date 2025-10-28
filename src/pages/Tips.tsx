import { PowerTipsCarousel } from "@/features/tips/PowerTipsCarousel";
import Header from "@/components/Header";

const Tips = () => {
  return (
    <div className="min-h-screen bg-background pb-24 pt-24">
      <Header />
      
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Power-Tips</h1>
          <p className="text-muted-foreground">
            Quick wins to reduce screen time without sacrificing productivity.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <PowerTipsCarousel />

        {/* Additional Info */}
        <div className="mt-12 space-y-6">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
            <h3 className="font-bold mb-3">Why These Work</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>
                  <strong>Grayscale Mode</strong> removes color dopamine hits, making apps
                  less engaging.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>
                  <strong>Notification Triage</strong> cuts interruptions by 70% on average.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>
                  <strong>App Limits</strong> create conscious friction before mindless
                  scrolling.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>
                  <strong>Home Screen Organization</strong> reduces "muscle memory" app
                  launches.
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              Pro Tip 🎯
            </h3>
            <p className="text-sm text-muted-foreground">
              Stack 3+ tips together for maximum effect. Users who implement grayscale +
              app limits + notification triage see 40% reduction in unproductive time
              within one week.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tips;
