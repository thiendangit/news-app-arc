import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { AssetByVariant, IconByVariant, Skeleton } from '@/components/atoms';
import { SafeScreen } from '@/components/templates';

import { useExampleStyles } from './Example.styles';
import { useExampleViewModel } from './Example.viewModel';

function Example() {
  const {
    fetchOneUserQuery,
    handleFetchUser,
    handleResetError,
    onChangeTheme,
    t,
    theme,
    toggleLanguage,
  } = useExampleViewModel();

  const styles = useExampleStyles();

  return (
    <SafeScreen
      isError={fetchOneUserQuery.isError}
      onResetError={() => {
        handleResetError();
      }}
    >
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.backgroundCircle} />

          <View style={styles.imageContainer}>
            <AssetByVariant
              path="logo"
              resizeMode="contain"
              style={styles.image}
            />
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              {t('screen_example.title')}
            </Text>
            <Text style={styles.description}>
              {t('screen_example.description')}
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <Skeleton
              height={64}
              loading={fetchOneUserQuery.isLoading}
              style={styles.skeleton}
              width={64}
            >
              <TouchableOpacity
                onPress={handleFetchUser}
                style={styles.button}
                testID="fetch-user-button"
              >
                <IconByVariant path="send" stroke={theme.colors.purple500} />
              </TouchableOpacity>
            </Skeleton>

            <TouchableOpacity
              onPress={onChangeTheme}
              style={styles.button}
              testID="change-theme-button"
            >
              <IconByVariant path="theme" stroke={theme.colors.purple500} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={toggleLanguage}
              style={styles.button}
              testID="change-language-button"
            >
              <IconByVariant path="language" stroke={theme.colors.purple500} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

export default Example;
