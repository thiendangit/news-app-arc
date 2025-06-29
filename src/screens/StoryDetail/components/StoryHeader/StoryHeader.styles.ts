import { useTheme } from '@/theme';

export const useStoryHeaderStyles = () => {
    const theme = useTheme();
    const { colors, fonts, gutters, layout } = theme;

    return {
        animatedBackButton: [
            {
                backgroundColor: 'rgba(255,255,255,0.9)',
                borderRadius: 20,
                height: 40,
                width: 40,
            },
            layout.itemsCenter,
            layout.justifyCenter,
        ],

        animatedHeader: [
            {
                backgroundColor: colors.gray50,
                borderBottomColor: colors.gray100,
                borderBottomWidth: 1,
                left: 0,
                position: 'absolute' as const,
                right: 0,
                top: 0,
                zIndex: 1000,
            },
            gutters.paddingTop_40,
            gutters.paddingBottom_12,
        ],

        animatedHeaderContent: [
            layout.row,
            layout.itemsCenter,
            layout.justifyBetween,
            gutters.paddingHorizontal_16,
        ],

        animatedHeaderTitle: [
            fonts.size_16,
            fonts.bold,
            fonts.gray800,
            { flex: 1 },
            gutters.marginHorizontal_12,
        ],

        animatedLikeButton: [
            {
                backgroundColor: 'rgba(255,255,255,0.9)',
                borderRadius: 20,
                height: 40,
                width: 40,
            },
            layout.itemsCenter,
            layout.justifyCenter,
        ],

        animatedLikeIcon: {
            height: 24,
            width: 24,
        },

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

        floatingBackButton: [
            {
                left: 16,
                position: 'absolute' as const,
                top: 44,
                zIndex: 1001,
            },
        ],

        floatingMoreButton: [
            {
                position: 'absolute' as const,
                right: 16,
                top: 44,
                zIndex: 1001,
            },
        ],

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
    };
}; 