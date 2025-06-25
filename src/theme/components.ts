import type { ComponentTheme } from '@/theme/types/theme';
import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';
type AllStyle = {} & Record<string, ImageStyle | TextStyle | ViewStyle>;
const generateComponentStyles = ({
  backgrounds,
  fonts,
  layout,
}: ComponentTheme) => {
  return {
    buttonCircle: {
      ...layout.justifyCenter,
      ...layout.itemsCenter,
      ...backgrounds.purple100,
      ...fonts.gray400,
      borderRadius: 16,
      height: 32,
      width: 32,
    },
    circle250: {
      borderRadius: 140,
      height: 250,
      width: 250,
    },
  } as const satisfies AllStyle;
};
export default generateComponentStyles;
