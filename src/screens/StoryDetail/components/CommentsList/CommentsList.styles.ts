import { useTheme } from '@/theme';

export const useCommentsListStyles = () => {
    const theme = useTheme();
    const { colors, fonts, gutters, layout } = theme;

    return {
        commentsCount: [
            fonts.size_16,
            fonts.gray400,
        ],

        commentsHeader: [
            layout.row,
            layout.itemsCenter,
            gutters.marginBottom_16,
        ],

        commentsSection: gutters.paddingHorizontal_16,

        commentsTitle: [
            fonts.size_24,
            fonts.bold,
            fonts.gray800,
            gutters.marginRight_12,
        ],

        loadingContainer: [
            layout.flex_1,
            layout.justifyCenter,
            layout.itemsCenter,
            gutters.paddingVertical_32,
        ],

        loadingText: [fonts.size_16, fonts.gray400, gutters.marginTop_12],

        loadMoreButton: [
            {
                backgroundColor: colors.gray100,
                borderRadius: 8,
                marginHorizontal: 16,
            },
            layout.itemsCenter,
            gutters.marginTop_16,
            gutters.marginBottom_16,
            gutters.paddingVertical_12,
        ],

        loadMoreText: [
            fonts.size_16,
            fonts.bold,
            {
                color: colors.orange500,
            },
        ],
    };
}; 