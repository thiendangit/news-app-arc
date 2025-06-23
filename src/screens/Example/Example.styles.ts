import { useTheme } from '@/theme';

export const useExampleStyles = () => {
    const { backgrounds, components, fonts, gutters, layout } = useTheme();

    return {
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
        image: {
            height: 300,
            width: 300,
        },
        imageContainer: [
            layout.absolute,
            gutters.paddingTop_80,
        ],
        skeleton: {
            borderRadius: components.buttonCircle.borderRadius,
        },
        textContainer: [
            gutters.marginTop_40,
        ],
        title: [
            fonts.size_40,
            fonts.gray800,
            fonts.bold,
        ],
    };
}; 