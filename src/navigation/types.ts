import type { Paths } from '@/navigation/paths';
import type { StackScreenProps } from '@react-navigation/stack';
export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList,
> = StackScreenProps<RootStackParamList, S>;
export type RootStackParamList = {
  [Paths.Home]: undefined;
  [Paths.Startup]: undefined;
  [Paths.StoryDetail]: {
    story: any;
    storyId: number;
  };
};
