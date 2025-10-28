import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PowerTipCard } from "./PowerTipCard";
import { mockPowerTipsData, type PowerTip } from "../dashboard/mockData";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "screenVS-power-tips-tried";

export const PowerTipsCarousel = () => {
  const [tips, setTips] = useState<PowerTip[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load tips with tried state from localStorage
  useEffect(() => {
    const triedTips = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as number[];
    const tipsWithState = mockPowerTipsData.tips.map((tip) => ({
      ...tip,
      tried: triedTips.includes(tip.id),
    }));
    setTips(tipsWithState);
  }, []);

  const markTipTried = (tipId: number) => {
    const triedTips = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as number[];
    if (!triedTips.includes(tipId)) {
      triedTips.push(tipId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(triedTips));
    }

    setTips((prev) =>
      prev.map((tip) => (tip.id === tipId ? { ...tip, tried: true } : tip))
    );

    // Show XP toast
    toast({
      title: "+5 Efficiency XP",
      description: "Power-tip unlocked!",
      duration: 2000,
    });
  };

  const handleTipAction = (tip: PowerTip) => {
    if (tip.tried) return;

    switch (tip.actionType) {
      case "link":
        if (tip.actionData) {
          window.open(tip.actionData, "_blank");
        }
        break;
      case "toast":
        if (tip.actionData) {
          toast({
            title: tip.actionData,
            duration: 2000,
          });
        }
        break;
      case "tooltip":
        // Tooltip is shown on hover, just mark as tried on click
        break;
    }

    markTipTried(tip.id);
  };

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = 260 + 16; // card width + gap
      scrollContainerRef.current.scrollTo({
        left: cardWidth * index,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  const handlePrevious = () => {
    const newIndex = Math.max(0, currentIndex - 1);
    scrollToIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = Math.min(tips.length - 1, currentIndex + 1);
    scrollToIndex(newIndex);
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 260 + 16;
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentIndex(newIndex);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            Power-Tips 💡
          </h3>
          <p className="text-sm text-muted-foreground">Small tweaks. Big gains.</p>
        </div>
        <Button
          variant="ghost"
          onClick={() => navigate("/tips")}
          className="gap-2 text-primary"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Navigation Arrows (Desktop) */}
        <div className="hidden md:block">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={currentIndex === tips.length - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Scrollable Cards */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {tips.map((tip) => (
            <div key={tip.id} className="snap-start">
              <PowerTipCard tip={tip} onAction={handleTipAction} />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2">
        {tips.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-8 bg-primary"
                : "w-2 bg-muted-foreground/30"
            }`}
            aria-label={`Go to tip ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Text */}
      <div className="text-center text-xs text-muted-foreground">
        {tips.filter((t) => t.tried).length} / {tips.length} unlocked
      </div>
    </div>
  );
};
