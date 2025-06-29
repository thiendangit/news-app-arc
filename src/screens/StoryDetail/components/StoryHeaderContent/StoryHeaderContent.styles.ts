import { useTheme } from '@/theme';

export const useStoryHeaderContentStyles = () => {
    const theme = useTheme();
    const { fonts, gutters, layout } = theme;

    return {
        categoryBadge: [
            {
                alignSelf: 'flex-start' as const,
                backgroundColor: 'rgba(255,107,53,0.9)',
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 4,
            },
            gutters.marginBottom_12,
        ],

        categoryText: [
            fonts.size_12,
            fonts.bold,
            {
                color: '#FFFFFF',
            },
        ],

        defaultImageContainer: [
            layout.itemsCenter,
            layout.justifyCenter,
            layout.flex_1,
        ],

        defaultImageSize: {
            height: 60,
            width: 120,
        },

        headerContent: [
            {
                bottom: 0,
                left: 0,
                position: 'absolute' as const,
                right: 0,
            },
        ],

        headerImage: {
            height: 300,
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
    };
}; 