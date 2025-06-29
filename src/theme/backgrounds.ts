import type { Backgrounds } from '@/theme/types/backgrounds';
import type { UnionConfiguration } from '@/theme/types/config';
import type { ViewStyle } from 'react-native';

export const generateBackgrounds = (configuration: UnionConfiguration) => {
  return Object.entries(configuration.backgrounds).reduce<Backgrounds>(
    (accumulator, [key, value]) => {
      return Object.assign(accumulator, {
        [key]: {
          backgroundColor: value,
        },
      });
    },
    {} as Backgrounds,
  );
};

export const staticBackgroundStyles = {} as const satisfies Record<
  string,
  ViewStyle
>;
