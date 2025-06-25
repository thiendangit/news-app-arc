import { useTheme } from '@/theme';
export const useStoryDetailStyles = () => {
  const { colors, fonts, gutters, layout } = useTheme();
  return {
    actionButton: [
      {
        backgroundColor: colors.gray100,
        borderRadius: 8,
        height: 44,
        width: 44,
      },
      layout.itemsCenter,
      layout.justifyCenter,
    ],
    actionButtonText: [
      fonts.size_12,
      fonts.bold,
      {
        color: colors.gray800,
      },
      gutters.marginLeft_12,
    ],
    actionIcon: {
      height: 20,
      width: 20,
    },
    actionsContainer: [
      layout.row,
      layout.itemsCenter,
      {
        gap: 12,
      },
    ],
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
    bottomActionsContainer: [
      layout.row,
      layout.itemsCenter,
      layout.justifyBetween,
      gutters.marginTop_16,
    ],
    categoryBadge: [
      {
        alignSelf: 'flex-start' as const,
        backgroundColor: colors.orange500,
        borderRadius: 12,
      },
      gutters.marginBottom_12,
      gutters.paddingHorizontal_16,
      gutters.paddingVertical_12,
    ],
    categoryText: [
      fonts.size_12,
      fonts.bold,
      fonts.uppercase,
      {
        color: '#FFFFFF',
      },
    ],
    commentsCount: [fonts.size_16, fonts.gray400, gutters.marginLeft_12],
    commentsFlashList: {
      minHeight: 2,
    },
    commentsHeader: [layout.row, layout.itemsCenter, gutters.marginBottom_16],
    commentsSection: gutters.marginTop_24,
    commentsTitle: [fonts.size_16, fonts.bold, fonts.gray800],
    container: [
      {
        backgroundColor: colors.gray50,
      },
      layout.flex_1,
    ],
    contentContainer: [
      {
        backgroundColor: colors.gray50,
      },
      gutters.paddingHorizontal_24,
      gutters.paddingTop_24,
    ],
    defaultImageContainer: [
      {
        backgroundColor: colors.gray100,
        height: '100%' as const,
        width: '100%' as const,
      },
      layout.itemsCenter,
      layout.justifyCenter,
    ],
    defaultImageSize: {
      height: 60,
      opacity: 0.3,
      width: 60,
    },
    errorContainer: [
      layout.flex_1,
      layout.justifyCenter,
      layout.itemsCenter,
      gutters.paddingHorizontal_24,
    ],
    errorText: [
      fonts.size_16,
      fonts.alignCenter,
      {
        color: '#EF4444',
      },
    ],
    floatingBackButton: [
      {
        position: 'absolute' as const,
        top: 50,
        zIndex: 1000,
      },
      gutters.paddingLeft_24,
    ],
    floatingMoreButton: [
      {
        position: 'absolute' as const,
        right: 10,
        top: 50,
        zIndex: 1000,
      },
      gutters.paddingRight_24,
    ],
    headerContent: [
      {
        bottom: 0,
        left: 0,
        position: 'absolute' as const,
        right: 0,
        top: 0,
      },
    ],
    headerImage: {
      height: '100%' as const,
      width: '100%' as const,
    },
    headerImageContainer: {
      height: 300,
      position: 'relative' as const,
      width: '100%' as const,
    },
    headerOverlay: {
      backgroundColor: 'rgba(0,0,0,0.4)',
      bottom: 0,
      left: 0,
      position: 'absolute' as const,
      right: 0,
      top: 0,
    },
    headerSubtitle: [fonts.size_12, { color: '#FFFFFF' }],
    headerSubtitleContainer: [
      {
        alignSelf: 'flex-start' as const,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 4,
        padding: 4,
      },
    ],
    headerTitle: [
      fonts.size_24,
      fonts.bold,
      {
        color: '#FFFFFF',
        lineHeight: 32,
      },
      gutters.marginBottom_12,
    ],
    headerTitleContainer: [
      {
        bottom: 0,
        left: 0,
        position: 'absolute' as const,
        right: 0,
      },
      gutters.paddingHorizontal_24,
      gutters.paddingBottom_24,
    ],
    loadingContainer: [layout.flex_1, layout.justifyCenter, layout.itemsCenter],
    loadingText: [fonts.size_16, fonts.gray400, gutters.marginTop_12],
    loadMoreButton: [
      {
        backgroundColor: colors.gray100,
        borderRadius: 8,
      },
      layout.itemsCenter,
      gutters.marginTop_24,
      gutters.paddingVertical_12,
    ],
    loadMoreText: [
      fonts.size_16,
      fonts.bold,
      {
        color: colors.orange500,
      },
    ],
    metaInfoContainer: gutters.marginBottom_24,
    moreButton: [
      {
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 20,
        height: 40,
        width: 40,
      },
      layout.itemsCenter,
      layout.justifyCenter,
    ],
    moreButtonIconSize: {
      height: 24,
      width: 24,
    },
    readMoreButton: [
      {
        backgroundColor: colors.orange500,
        borderRadius: 8,
        flex: 1,
        marginRight: 12,
      },
      gutters.paddingHorizontal_16,
      gutters.paddingVertical_12,
    ],
    readMoreButtonText: [
      fonts.size_16,
      fonts.bold,
      fonts.alignCenter,
      {
        color: '#FFFFFF',
      },
    ],
    retryButton: [
      {
        backgroundColor: colors.orange500,
        borderRadius: 8,
      },
      gutters.marginTop_16,
      gutters.paddingHorizontal_24,
      gutters.paddingVertical_12,
    ],
    retryButtonText: [
      fonts.size_16,
      fonts.bold,
      {
        color: '#FFFFFF',
      },
    ],
    rewardIcon: {
      height: 16,
      width: 16,
    },
    row: [layout.row, layout.justifyBetween],
    scoreContainer: [
      layout.row,
      layout.itemsCenter,
      gutters.marginRight_12,
    ],
    scoreText: [
      fonts.size_12,
      fonts.bold,
      {
        color: colors.orange500,
      },
      gutters.marginLeft_12,
    ],
    scrollViewContainer: layout.flex_1,
    storyMeta: [fonts.size_12, fonts.gray400, gutters.marginBottom_12],
    storyMetaContainer: [
      layout.row,
      layout.itemsCenter,
      layout.wrap,
      gutters.marginBottom_12,
    ],
    storyText: [
      fonts.size_16,
      fonts.gray800,
      {
        lineHeight: 24,
      },
      gutters.marginBottom_16,
    ],
  };
};
