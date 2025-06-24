import type { RootScreenProps } from '@/navigation/types';

import {memo} from "react";
import isEqual from "react-fast-compare";
import { ActivityIndicator, Text, View } from 'react-native';

import { Paths } from '@/navigation/paths';

import { AssetByVariant } from '@/components/atoms';
import { SafeScreen } from '@/components/templates';

import { useStartupStyles } from './Startup.styles';
import { useStartupViewModel } from './Startup.viewModel';

function Startup({ navigation, route }: RootScreenProps<Paths.Startup>) {
  const {
    selectors: { isError, isFetching, t },
  } = useStartupViewModel({ navigation, route });

  const styles = useStartupStyles();

  return (
    <SafeScreen>
      <View style={styles.container}>
        <AssetByVariant path="logo" resizeMode="contain" style={styles.image} />
        {isFetching ? (
          <ActivityIndicator size="large" style={styles.loadingIndicator} />
        ) : undefined}
        {isError ? (
          <Text style={styles.errorText}>{t('common_error')}</Text>
        ) : undefined}
      </View>
    </SafeScreen>
  );
}

export const StartUpScreen = memo(Startup, isEqual);
