import { useTheme } from '@/theme';

export const useStoryContentStyles = () => {
    const theme = useTheme();
    const { colors, fonts, gutters, layout } = theme;

    return {
        container: [
            gutters.marginBottom_16,
        ],

        // Description Styles
        descriptionContainer: [
            {
                backgroundColor: '#FFFFFF',
                borderLeftColor: colors.orange500,
                borderLeftWidth: 3,
                borderRadius: 8,
                padding: 12,
            },
            gutters.marginBottom_12,
        ],

        storyText: [
            {
                color: colors.gray800,
                fontSize: 14,
                lineHeight: 20,
            },
        ],

        // Actions Card
        actionsCard: [
            {
                backgroundColor: '#FFFFFF',
                borderRadius: 12,
                elevation: 1,
                padding: 12,
                shadowColor: '#000',
                shadowOffset: { height: 1, width: 0 },
                shadowOpacity: 0.05,
                shadowRadius: 3,
            },
            layout.row,
            layout.itemsCenter,
            layout.justifyBetween,
        ],

        readMoreButton: [
            {
                backgroundColor: colors.orange500,
                borderRadius: 8,
                flex: 1,
                marginRight: 8,
                paddingVertical: 10,
            },
            layout.itemsCenter,
            layout.justifyCenter,
        ],

        readMoreButtonText: [
            fonts.bold,
            {
                color: '#FFFFFF',
                fontSize: 14,
            },
        ],

        secondaryActions: [
            layout.row,
            layout.itemsCenter,
        ],

        actionButton: [
            {
                backgroundColor: colors.gray100,
                borderRadius: 8,
                height: 36,
                marginLeft: 6,
                width: 36,
            },
            layout.itemsCenter,
            layout.justifyCenter,
        ],

        actionIcon: {
            height: 16,
            tintColor: colors.gray400,
            width: 16,
        },
    };
}; 