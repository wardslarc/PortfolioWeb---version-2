import React, { createContext, useContext, useState } from "react";

type TimePeriod = "morning" | "afternoon" | "night" | null;

interface ThemeContextType {
  manualTimePeriod: TimePeriod;
  setManualTimePeriod: (period: TimePeriod) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // This powers the manual morning / afternoon / night preview used by the UI.
  const [manualTimePeriod, setManualTimePeriod] = useState<TimePeriod>(null);

  return (
    <ThemeContext.Provider value={{ manualTimePeriod, setManualTimePeriod }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Sections depend on this provider, so failing loudly is better than
    // rendering with missing theme state.
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
