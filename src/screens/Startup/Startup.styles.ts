import { useTheme } from '@/theme';

export const useStartupStyles = () => {
    const { fonts, gutters, layout } = useTheme();

    return {
        container: [
            layout.flex_1,
            layout.col,
            layout.itemsCenter,
            layout.justifyCenter,
        ],
        errorText: [
            fonts.size_16,
            fonts.red500,
        ],
        image: {
            height: 300,
            width: 300,
        },
        loadingIndicator: [
            gutters.marginVertical_24,
        ],
    };
}; 