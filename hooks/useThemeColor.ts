/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import DARK_COLORS from '@/constants/DarkColors';
import LIGHT_COLORS from '@/constants/LightColors';
import { useColorScheme } from '@/hooks/useColorScheme';

const Colors = {
  light: LIGHT_COLORS,
  dark: DARK_COLORS,
};

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof LIGHT_COLORS & keyof typeof DARK_COLORS
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}