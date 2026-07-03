import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = {
  isDark: boolean;
  toggleDark: (value: boolean) => void;
  colors: {
    background: string;
    card: string;
    text: string;
    subtext: string;
    border: string;
    primary: string;
  };
};

const lightColors = {
  background: '#ffffff',
  card: '#f5f5f5',
  text: '#222222',
  subtext: '#666666',
  border: '#eeeeee',
  primary: '#2e7d32',
};

const darkColors = {
  background: '#121212',
  card: '#1e1e1e',
  text: '#f0f0f0',
  subtext: '#aaaaaa',
  border: '#333333',
  primary: '#4caf50',
};

const ThemeContext = createContext<Theme | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('darkMode').then((val) => {
      if (val === 'true') setIsDark(true);
    });
  }, []);

  const toggleDark = async (value: boolean) => {
    setIsDark(value);
    await AsyncStorage.setItem('darkMode', value.toString());
  };

  return (
    <ThemeContext.Provider
      value={{ isDark, toggleDark, colors: isDark ? darkColors : lightColors }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}