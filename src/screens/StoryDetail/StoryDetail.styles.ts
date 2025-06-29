import { useTheme } from '@/theme';

export const useStoryDetailStyles = () => {
  const theme = useTheme();
  const { colors, fonts, gutters, layout } = theme;

  return {
    backButton: [
      {
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 20,
        height: 40,
        width: 40,
      },
      layout.itemsCenter,
      layout.justifyCenter,
    ],

    container: [
      layout.flex_1,
      {
        backgroundColor: colors.gray50,
      },
    ],

    contentContainer: gutters.paddingHorizontal_16,

    errorContainer: [
      layout.flex_1,
      layout.justifyCenter,
      layout.itemsCenter,
      gutters.paddingVertical_32,
    ],

    errorText: [fonts.size_16, fonts.gray400, gutters.marginBottom_16],

    floatingBackButton: [
      {
        left: 16,
        position: 'absolute' as const,
        top: 50,
        zIndex: 100,
      },
    ],

    retryButton: [
      {
        backgroundColor: colors.orange500,
        borderRadius: 8,
      },
      gutters.paddingHorizontal_16,
      gutters.paddingVertical_12,
      gutters.marginTop_16,
    ],

    retryButtonText: [
      fonts.size_16,
      fonts.bold,
      {
        color: '#FFFFFF',
      },
    ],

    scrollViewContainer: layout.flex_1,
  };
};
