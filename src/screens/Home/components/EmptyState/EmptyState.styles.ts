import { useTheme } from '@/theme';

export const useEmptyStateStyles = () => {
    const theme = useTheme();
    const { colors, fonts, gutters, layout } = theme;

    return {
        container: [
            layout.itemsCenter,
            layout.justifyCenter,
            gutters.padding_24,
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
        retryText: [
            fonts.size_16,
            fonts.bold,
            {
                color: colors.gray50,
            },
        ],
        text: [
            fonts.size_16,
            fonts.gray400,
            fonts.alignCenter,
        ],
    };
}; 