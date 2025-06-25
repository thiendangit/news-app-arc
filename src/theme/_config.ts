import type { ThemeConfiguration } from '@/theme/types/config';

import { DarkTheme, DefaultTheme } from '@react-navigation/native';
export const enum Variant {
  DARK = 'dark',
}
const colorsLight = {
  gray100: '#f3f3f3',
  gray200: '#A1A1A1',
  gray400: '#4D4D4D',
  gray50: '#FFFFFF',
  gray800: '#303030',
  orange100: '#FFE5D9',
  orange50: '#2D1B13',
  orange500: '#FF6B35',
  purple100: '#E1E1EF',
  purple50: '#1B1A23',
  purple500: '#FF6B35',
  red500: '#C13333',
  skeleton: '#A1A1A1',
} as const;
const colorsDark = {
  gray100: '#000000',
  gray200: '#BABABA',
  gray400: '#969696',
  gray50: '#EFEFEF',
  gray800: '#E0E0E0',
  orange100: '#2D1B13',
  orange50: '#2D1B13',
  orange500: '#FF8A65',
  purple100: '#252732',
  purple50: '#1B1A23',
  purple500: '#FF8A65',
  red500: '#C13333',
  skeleton: '#303030',
} as const;
const sizes = [12, 16, 24, 32, 40, 80] as const;
export const config = {
  backgrounds: colorsLight,
  borders: {
    colors: colorsLight,
    radius: [4, 16],
    widths: [1, 2],
  },
  colors: colorsLight,
  fonts: {
    colors: colorsLight,
    sizes,
  },
  gutters: sizes,
  navigationColors: {
    ...DefaultTheme.colors,
    background: '#FFFFFF',
    card: '#FFFFFF',
  },
  variants: {
    dark: {
      backgrounds: colorsDark,
      borders: {
        colors: colorsDark,
      },
      colors: colorsDark,
      fonts: {
        colors: colorsDark,
      },
      navigationColors: {
        ...DarkTheme.colors,
        background: colorsDark.purple50,
        card: colorsDark.purple50,
      },
    },
  },
} as const satisfies ThemeConfiguration;
