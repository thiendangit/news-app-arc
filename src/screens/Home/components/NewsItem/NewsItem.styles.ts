import { useTheme } from '@/theme';

export const useNewsItemStyles = () => {
    const theme = useTheme();
    const { colors, fonts, gutters, layout } = theme;

    return {
        actionButton: [
            layout.row,
            layout.itemsCenter,
            gutters.marginRight_12,
        ],
        actionText: [
            fonts.size_12,
            fonts.gray400,
            {
                marginLeft: 4,
            },
        ],
        icon: {
            height: 14,
            width: 14,
        },
        iconMoreContainer: [
            layout.itemsCenter,
            layout.justifyCenter,
            {
                height: 32,
                width: 32,
            },
        ],
        linkPreviewContainer: [
            { marginBottom: 4 },
            { borderRadius: 8, overflow: 'hidden' as const },
        ],
        linkPreviewImage: {
            backgroundColor: '#eee',
            borderRadius: 8,
            minHeight: 120,
            width: '100%' as never,
        },
        newsActions: [
            layout.row,
            layout.itemsCenter,
            layout.justifyBetween,
        ],
        newsCard: [
            {
                backgroundColor: colors.gray50,
                borderRadius: 16,
                marginBottom: 16,
                shadowColor: colors.gray800,
                shadowOffset: { height: 2, width: 0 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            gutters.padding_16,
        ],
        newsContent: {
            flex: 1,
        },
        newsDomain: [
            fonts.size_12,
            fonts.gray400,
        ],
        newsDot: [
            fonts.size_12,
            fonts.gray400,
            {
                marginHorizontal: 8,
            },
        ],
        newsMetadata: [
            layout.row,
            layout.itemsCenter,
            gutters.marginBottom_12,
        ],
        newsSource: [
            fonts.size_12,
            fonts.gray400,
            fonts.bold,
        ],
        newsTime: [
            fonts.size_12,
            fonts.gray400,
        ],
        newsTitle: [
            fonts.size_16,
            fonts.gray800,
            fonts.bold,
            {
                lineHeight: 22,
            },
            gutters.marginBottom_12,
        ],
        scoreText: [
            fonts.size_12,
            fonts.bold,
            {
                color: colors.orange500,
                marginLeft: 4,
            },
        ],
        storyType: [
            fonts.size_12,
            fonts.bold,
            {
                color: colors.orange500,
            },
        ],
    };
}; 