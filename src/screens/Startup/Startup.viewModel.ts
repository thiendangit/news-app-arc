import type { RootScreenProps } from '@/navigation/types';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Paths } from '@/navigation/paths';
import { useTheme } from '@/theme';
export const useStartupViewModel = ({
  navigation,
}: RootScreenProps<Paths.Startup>) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { isError, isFetching, isSuccess } = useQuery({
    queryFn: () => {
      return Promise.resolve(true);
    },
    queryKey: ['startup'],
  });
  useEffect(() => {
    if (isSuccess) {
      navigation.reset({
        index: 0,
        routes: [{ name: Paths.Home }],
      });
    }
  }, [isSuccess, navigation]);
  return {
    selectors: {
      isError,
      isFetching,
      isSuccess,
      t,
      theme,
    },
  };
};
