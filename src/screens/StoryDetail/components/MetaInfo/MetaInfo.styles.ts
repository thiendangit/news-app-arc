import { useTheme } from '@/theme';

export const useMetaInfoStyles = () => {
    const theme = useTheme();
    const { colors, fonts, gutters, layout } = theme;

    return {
        // Base Meta Card
        metaCard: [
            {
                backgroundColor: colors.gray50,
                borderRadius: 12,
                elevation: 2,
                padding: 12,
                shadowColor: '#000',
                shadowOffset: { height: 1, width: 0 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
            },
            gutters.marginTop_12,
            gutters.marginBottom_12,
        ],

        // Floating/Absolute Meta Card
        bottomRow: [
            layout.row,
            layout.itemsCenter,
            layout.justifyBetween,
        ],

        floatingCard: [
            {
                backdropFilter: 'blur(10px)' as const,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: 16,
                elevation: 8,
                left: 16,
                marginBottom: 0,
                position: 'absolute' as const,
                right: 16,
                shadowColor: '#000',
                shadowOffset: { height: 4, width: 0 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
                top: 0,
                zIndex: 10,
            },
        ],

        metaIcon: {
            height: 12,
            marginRight: 4,
            tintColor: colors.gray400,
            width: 12,
        },

        metaItem: [
            layout.row,
            layout.itemsCenter,
        ],

        metaText: [
            {
                color: colors.gray800,
                fontSize: 11,
            },
        ],

        pointsLabel: [
            {
                color: '#FFFFFF',
                fontSize: 10,
                opacity: 0.9,
            },
        ],

        rewardIcon: {
            height: 12,
            tintColor: '#FFFFFF',
            width: 12,
        },

        scoreBadge: [
            {
                backgroundColor: colors.orange500,
                borderRadius: 16,
                paddingHorizontal: 8,
                paddingVertical: 4,
            },
            layout.row,
            layout.itemsCenter,
        ],

        scoreText: [
            fonts.size_12,
            fonts.bold,
            {
                color: '#FFFFFF',
                marginLeft: 4,
                marginRight: 2,
            },
        ],

        timeText: [
            {
                color: colors.gray400,
                fontSize: 11,
            },
        ],

        topRow: [
            layout.row,
            layout.itemsCenter,
            layout.justifyBetween,
            { marginBottom: 8 },
        ],

        typeBadge: [
            {
                backgroundColor: '#E3F2FD',
                borderRadius: 8,
                paddingHorizontal: 6,
                paddingVertical: 2,
            },
        ],

        typeText: [
            {
                color: '#1976D2',
                fontSize: 10,
                fontWeight: 'bold' as const,
                letterSpacing: 0.3,
            },
        ],
    };
};