import { useTheme } from '@/theme';
export const useExampleStyles = () => {
    const { backgrounds, colors, components, fonts, gutters, layout } = useTheme();
    return {
        actionButton: [
            layout.row,
            layout.itemsCenter,
            gutters.marginRight_16,
        ],
        actionText: [
            fonts.size_12,
            { color: colors.gray400 },
            gutters.marginLeft_16,
        ],
        backgroundCircle: [
            layout.relative,
            backgrounds.gray100,
            components.circle250,
        ],
        button: [
            components.buttonCircle,
            gutters.marginBottom_16,
        ],
        buttonRow: [
            layout.row,
            layout.justifyBetween,
            layout.fullWidth,
            gutters.marginTop_16,
        ],
        container: [
            layout.justifyCenter,
            layout.itemsCenter,
            gutters.marginTop_80,
        ],
        content: [
            gutters.paddingHorizontal_32,
            gutters.marginTop_40,
        ],
        description: [
            fonts.size_16,
            fonts.gray200,
            gutters.marginBottom_40,
        ],
        emptyContainer: [
            layout.flex_1,
            layout.justifyCenter,
            layout.itemsCenter,
            gutters.paddingVertical_32,
        ],
        emptyText: [
            fonts.size_16,
            { color: colors.gray400 },
            gutters.marginBottom_16,
        ],
        header: [
            layout.row,
            layout.justifyBetween,
            layout.itemsCenter,
            gutters.paddingHorizontal_16,
        ],
        headerActions: [
            layout.row,
            layout.itemsCenter,
        ],
        headerButton: [
            gutters.marginLeft_12,
            components.buttonCircle,
        ],
        headerTitle: [
            layout.row,
            layout.itemsCenter,
        ],
        icon: {
            height: 14,
            width: 14,
        },
        iconMoreContainer: [
            layout.itemsEnd,
            layout.flex_1
        ],
        iconNotification: {
            height: 14,
            width: 11,
        },
        image: {
            height: 300,
            width: 300,
        },
        imageContainer: [
            layout.absolute,
            gutters.paddingTop_80,
        ],
        latestText: [
            fonts.size_16,
            fonts.bold,
            { color: colors.orange500 },
            gutters.marginRight_16,
        ],
        linkPreviewContainer: [
            { marginBottom: 8 },
            { borderRadius: 8, overflow: 'hidden' as const },
        ],
        linkPreviewImage: {
            backgroundColor: '#eee',
            borderRadius: 8,
            minHeight: 120,
            width: '100%' as never,
        },
        loadingContainer: [
            layout.flex_1,
            layout.justifyCenter,
            layout.itemsCenter,
            gutters.paddingVertical_32,
        ],
        loadingFooter: [
            layout.itemsCenter,
            gutters.paddingVertical_16,
        ],
        loadingText: [
            fonts.size_16,
            { color: colors.gray400 },
            gutters.marginTop_12,
        ],
        logo: {
            height: 50,
            width: 100,
        },
        newsActions: [
            layout.row,
            layout.itemsCenter,
        ],
        newsCard: [
            backgrounds.gray100,
            gutters.padding_16,
            gutters.marginBottom_16,
            gutters.marginHorizontal_16,
            { borderRadius: 12 },
        ],
        newsContainer: [
            layout.flex_1,
        ],
        newsContent: [
            layout.flex_1,
        ],
        newsDomain: [
            fonts.size_12,
            { color: colors.gray400 },
        ],
        newsDot: [
            fonts.size_12,
            { color: colors.gray400 },
            gutters.marginHorizontal_16,
        ],
        newsList: [
        ],
        newsMetadata: [
            layout.row,
            layout.itemsCenter,
            layout.wrap,
            gutters.marginBottom_12,
        ],
        newsSource: [
            fonts.size_12,
            { color: colors.orange500 },
        ],
        newsText: [
            fonts.size_16,
            fonts.bold,
            { color: colors.gray800 },
        ],
        newsTime: [
            fonts.size_12,
            { color: colors.gray400 },
        ],
        newsTitle: [
            fonts.size_16,
            fonts.bold,
            { color: colors.gray800 },
            gutters.marginBottom_16,
        ],
        retryButton: [
            gutters.paddingHorizontal_16,
            gutters.paddingVertical_12,
            { backgroundColor: colors.orange100 },
            { borderRadius: 8 },
        ],
        retryText: [
            fonts.size_16,
            fonts.bold,
            { color: colors.orange500 },
        ],
        scoreText: [
            fonts.size_12,
            fonts.bold,
            { color: colors.orange500 },
            {marginLeft: 8},
        ],
        skeleton: {
            borderRadius: components.buttonCircle.borderRadius,
        },
        storyType: [
            fonts.size_12,
            fonts.bold,
            { color: colors.orange500 },
            { backgroundColor: colors.orange100 },
            { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 8 },
        ],
        textContainer: [
            gutters.marginTop_40,
        ],
        title: [
            fonts.size_40,
            fonts.gray800,
            fonts.bold,
        ]
    };
}; 