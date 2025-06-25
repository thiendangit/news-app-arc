import type { RootStackParamList } from '@/navigation/types';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Paths } from '@/navigation/paths';
import { useTheme } from '@/theme';

import { HomeScreen, StartUpScreen, StoryDetailScreen } from '@/screens';
const Stack = createStackNavigator<RootStackParamList>();
function ApplicationNavigator() {
  const { navigationTheme, variant } = useTheme();
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator key={variant} screenOptions={{ headerShown: false }}>
          <Stack.Screen component={StartUpScreen} name={Paths.Startup} />
          <Stack.Screen component={HomeScreen} name={Paths.Home} />
          <Stack.Screen component={StoryDetailScreen} name={Paths.StoryDetail} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
export default ApplicationNavigator;
