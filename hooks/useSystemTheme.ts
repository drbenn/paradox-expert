import DARK_COLORS from '@/constants/DarkColors';
import LIGHT_COLORS from '@/constants/LightColors';
import { useColorScheme } from 'react-native';

export const useSystemTheme = () => {
  const colorScheme = useColorScheme()
  const colors = colorScheme === 'dark' ? DARK_COLORS : LIGHT_COLORS;
  const isDarkMode = colorScheme === 'dark';
  
  return { colors, isDarkMode, colorScheme };
};