/**
 * Hook to get effective color scheme based on theme mode preference
 */

import { useColorScheme } from 'react-native';
import { useThemeStore } from '../stores/themeStore';

export const useEffectiveColorScheme = () => {
  const deviceColorScheme = useColorScheme();
  const themeMode = useThemeStore((state) => state.themeMode);

  if (themeMode === 'system') {
    return deviceColorScheme || 'light';
  }

  return themeMode;
};
