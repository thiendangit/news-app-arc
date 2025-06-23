import type { RootScreenProps } from '@/navigation/types';

import { ActivityIndicator, Text, View } from 'react-native';

import { Paths } from '@/navigation/paths';

import { AssetByVariant } from '@/components/atoms';
import { SafeScreen } from '@/components/templates';

import { useStartupStyles } from './Startup.styles';
import { useStartupViewModel } from './Startup.viewModel';


function Startup({ navigation, route }: RootScreenProps<Paths.Startup>) {
  const {
    isError,
    isFetching,
    t,
  } = useStartupViewModel({ navigation, route });

  const styles = useStartupStyles();

  return (
    <SafeScreen>
      <View style={styles.container}>
        <AssetByVariant
          path="logo"
          resizeMode="contain"
          style={styles.image}
        />
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

export default Startup;
