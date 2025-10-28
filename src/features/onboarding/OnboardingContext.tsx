import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface OnboardingState {
  onboardingComplete: boolean;
  screenTimeConnected: boolean;
  demoMode: boolean;
  squadName: string;
  squadMode: 'solo' | 'duo' | 'squad';
}

interface OnboardingContextType extends OnboardingState {
  setScreenTimeConnected: (connected: boolean) => void;
  setDemoMode: (demo: boolean) => void;
  setSquadName: (name: string) => void;
  setSquadMode: (mode: 'solo' | 'duo' | 'squad') => void;
  completeOnboarding: () => void;
}

const defaultState: OnboardingState = {
  onboardingComplete: false,
  screenTimeConnected: false,
  demoMode: false,
  squadName: '',
  squadMode: 'solo',
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<OnboardingState>(() => {
    const stored = localStorage.getItem('onboarding-state');
    return stored ? JSON.parse(stored) : defaultState;
  });

  useEffect(() => {
    localStorage.setItem('onboarding-state', JSON.stringify(state));
  }, [state]);

  const setScreenTimeConnected = (connected: boolean) => {
    setState(prev => ({ ...prev, screenTimeConnected: connected }));
  };

  const setDemoMode = (demo: boolean) => {
    setState(prev => ({ ...prev, demoMode: demo }));
  };

  const setSquadName = (name: string) => {
    setState(prev => ({ ...prev, squadName: name }));
  };

  const setSquadMode = (mode: 'solo' | 'duo' | 'squad') => {
    setState(prev => ({ ...prev, squadMode: mode }));
  };

  const completeOnboarding = () => {
    setState(prev => ({ ...prev, onboardingComplete: true }));
  };

  return (
    <OnboardingContext.Provider
      value={{
        ...state,
        setScreenTimeConnected,
        setDemoMode,
        setSquadName,
        setSquadMode,
        completeOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};
