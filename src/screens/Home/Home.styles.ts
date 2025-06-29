import { useTheme } from '@/theme';

export const useHomeStyles = () => {
    const { components, gutters, layout } = useTheme();

    return {
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

        iconNotification: {
            height: 14,
            width: 11,
        },

        logo: {
            height: 50,
            width: 100,
        },

        newsContainer: layout.flex_1,
    };
}; 