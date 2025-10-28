/**
 * Centralized copy for ScreenVS
 * Tone: Competitive, playful, slightly spicy—but never mean/unsafe
 */

export const COPY = {
  // Core Loop
  coreLoop: {
    title: "How It Works",
    steps: [
      {
        number: "1",
        title: "Track Automatically",
        description: "Connect once. Your screen time syncs automatically—no manual entry, no cheating.",
        emoji: "📱"
      },
      {
        number: "2",
        title: "Compete Weekly",
        description: "Get matched into solos, duos, or squads. New week, new battle, new bragging rights.",
        emoji: "⚔️"
      },
      {
        number: "3",
        title: "Win or Get Roasted",
        description: "Top the leaderboard for glory. Bottom out? Prepare for memes and shame.",
        emoji: "🏆"
      }
    ]
  },

  // Hero
  hero: {
    badge: "🏆 Join the Competition",
    headline: "Turn Screen Time Into",
    headlineAccent: "Epic Competition",
    subheadline: "Compete with your squad to spend less time doom-scrolling. Weekly battles, live leaderboards, and bragging rights. Losers get roasted. Winners get glory.",
    ctaPrimary: "Start Competing",
    ctaSecondary: "How It Works",
    ctaDemo: "View Demo"
  },

  // Dashboard
  dashboard: {
    title: "Dashboard",
    noDataYet: "No data yet—add your screen time to get started",
    todayAtGlance: "Today at a Glance",
    weeklyProgress: "Weekly Progress",
    efficiencyMeter: "Efficiency Meter",
    streak: (days: number) => `🔥 ${days}-day streak—don't choke`,
    streakSingle: "🔥 1-day streak—keep it rolling",
    deltaBetter: (percent: number) => `${percent}% better than yesterday`,
    deltaWorse: (percent: number) => `Oof. Up ${percent}% from yesterday. Touch grass?`,
    goldDay: "🥇 Gold Day",
    silverDay: "🥈 Silver Day",
    bronzeDay: "🥉 Bronze Day",
    algorithmExplainer: "Your efficiency score = (Productive% - Unproductive%). Score ranges from 0% to 100% (clamped at 0 minimum)."
  },

  // Leaderboard
  leaderboard: {
    title: "Leaderboard",
    emptySquad: "Your squad is empty—invite 2 friends to start roasting",
    rankUp: (delta: number) => `↑ +${delta}`,
    rankDown: (delta: number) => `↓ ${delta}`,
    badges: {
      mostImproved: "📈 Most Improved",
      streakKing: "🔥 Streak King",
      clutchComeback: "💪 Clutch Comeback"
    }
  },

  // Profile
  profile: {
    playerCard: "Player Card",
    knownFor: "Known for:",
    tier: {
      diamond: "💎 Diamond",
      gold: "🥇 Gold",
      silver: "🥈 Silver",
      bronze: "🥉 Bronze"
    }
  },

  // Empty States
  empty: {
    noData: "Nothing here yet",
    noDataSubtext: "Add your screen time to see insights",
    noFriends: "No friends yet—invite your squad",
    noCommunities: "Not in any communities yet"
  },

  // Toasts / Feedback
  feedback: {
    milestoneReached: "🎉 Milestone reached!",
    streakLost: "💔 Streak broken—start over",
    rankUp: "📈 You moved up!",
    rankDown: "📉 You dropped a spot",
    efficiencyHigh: "🔥 Crushing it today",
    efficiencyLow: "⚠️ Screen time's creeping up"
  },

  // Features
  features: {
    squadUp: {
      title: "Squad Up Weekly",
      description: "Get randomly matched into solos, duos, or squads every week. New teams, new competition, maximum chaos."
    },
    autoTrack: {
      title: "Auto Screen Tracking",
      description: "Connect via Apple Shortcuts. Your screen time syncs automatically. No manual logging, no cheating."
    },
    winGlory: {
      title: "Win Glory & Bragging Rights",
      description: "Dominate the leaderboard and flex on your friends. Top performers get legendary status."
    },
    losersRoasted: {
      title: "Losers Get Roasted",
      description: "Last place? Prepare for meme notifications and profile pic changes. The shame is real and hilarious."
    }
  },

  // CTA
  cta: {
    title: "Ready to Compete?",
    subtitle: "Join thousands already battling their screen time",
    button: "Get Started Free"
  },

  // Footer
  footer: {
    tagline: "Turn screen time into competition.",
    copyright: "All rights reserved. Made for the squad."
  },

  // Pricing
  pricing: {
    header: {
      title: "Pick Your Plan.",
      subtitle: "Both versions make you less of a scroll zombie — one just does it faster."
    },
    free: {
      title: "Forever free (unless you lose a bet).",
      tagline: "Perfect for casual competitors and professional procrastinators.",
      features: [
        "Weekly challenges",
        "Leaderboard access",
        "Basic insights",
        "Community meme pool"
      ]
    },
    pro: {
      title: "Cheaper than your doomscroll habit.",
      tagline: "For people who take self-improvement way too seriously.",
      features: [
        "Advanced efficiency insights",
        "Custom meme packs",
        "Priority squads",
        "Unlimited roasts",
        "7-day trend analysis",
        "Early access to new features"
      ]
    },
    faq: {
      title: "Frequently Asked Questions",
      questions: [
        {
          question: "Will I really get roasted?",
          answer: "Lovingly. Never maliciously. We promise."
        },
        {
          question: "Can I play solo?",
          answer: "Yes. Solo, duos, or squads — your choice every week."
        },
        {
          question: "Does it work without Apple?",
          answer: "Yep. You can use demo mode or Webhook connections (coming soon)."
        },
        {
          question: "Do I lose progress if I downgrade?",
          answer: "Nope. You'll just miss out on advanced insights and meme packs."
        },
        {
          question: "Can I cancel anytime?",
          answer: "Always. No guilt. No exit surveys asking 'why?'."
        }
      ]
    },
    cta: {
      title: "Ready to reclaim your focus?",
      button: "Upgrade Now →"
    },
    proActivated: {
      title: "Pro Mode activated 💸",
      description: "Welcome to the upper tier."
    },
    stayFree: {
      title: "Still free. Still focused.",
      description: "You're already competing at a high level."
    }
  },

  // Communities
  communities: {
    header: {
      title: "Your Squads",
      subtitle: "Compete, roast, and grow together."
    },
    activeSquads: "Active Squads",
    empty: {
      title: "You haven't joined a squad yet.",
      subtitle: "Everyone needs someone to roast them into greatness.",
      suggestionsTitle: "Quick start with these:"
    },
    suggestions: [
      { name: "Study Crew", emoji: "🎓" },
      { name: "Gym Bros", emoji: "💪" },
      { name: "Focus Queens", emoji: "🧘" },
      { name: "Dorm Rivals", emoji: "🎮" }
    ],
    createModal: {
      title: "Create New Squad",
      description: "Name your squad. Keep it clever.",
      nameLabel: "Squad Name",
      emojiLabel: "Choose an emoji",
      submitButton: "Create & Copy Invite Link"
    },
    joinModal: {
      title: "Join via Invite Link",
      description: "Paste the invite link you received from a friend.",
      linkLabel: "Invite Link",
      submitButton: "Join Squad"
    },
    createSuccess: {
      title: "Squad created! 🎉",
      description: "Invite link copied to clipboard."
    },
    joinSuccess: {
      title: "Welcome aboard. 🚀",
      description: "Prepare to get judged."
    },
    quickJoinSuccess: {
      title: "Joined squad! 🎉",
      description: (name: string) => `You're now part of ${name}.`
    }
  }
} as const;
