import { useTheme } from '@/theme';

export const useSkeletonNewsItemStyles = () => {
    const theme = useTheme();
    const { gutters, layout } = theme;

    return {
        actionsContainer: [layout.row, layout.itemsCenter, layout.justifyBetween],

        commentAction: [
            layout.row,
            layout.itemsCenter,
            gutters.marginRight_16,
        ],

        commentIcon: {
            backgroundColor: '#F0F0F0',
            borderRadius: 7,
            height: 14,
            marginRight: 4,
            width: 14,
        },

        commentText: {
            backgroundColor: '#EEEEEE',
            borderRadius: 2,
            height: 12,
            width: 16,
        },

        domainContainer: {
            backgroundColor: '#EEEEEE',
            borderRadius: 2,
            height: 12,
            width: 70,
        },

        dotContainer: {
            backgroundColor: '#DDDDDD',
            borderRadius: 1.5,
            height: 3,
            marginHorizontal: 8,
            width: 3,
        },

        imageContainer: {
            backgroundColor: '#F0F0F0',
            borderRadius: 12,
            height: 120,
            marginBottom: 12,
            overflow: 'hidden' as const,
            position: 'relative' as const,
            width: '100%' as const,
        },

        imageSkeleton: {
            backgroundColor: 'transparent',
            left: 0,
            position: 'absolute' as const,
            top: 0,
        },

        leftActions: [layout.row, layout.itemsCenter, { flex: 1 }],

        metadataContainer: [
            layout.row,
            layout.itemsCenter,
            gutters.marginBottom_12,
        ],

        moreButton: {
            backgroundColor: '#F0F0F0',
            borderRadius: 8,
            height: 16,
            width: 16,
        },

        newsCard: {
            backgroundColor: '#FAFAFA',
            borderRadius: 16,
            height: 240,
            marginBottom: 16,
            overflow: 'hidden' as const,
            paddingHorizontal: 16,
            paddingVertical: 16,
        },

        newsContent: {
            flex: 1,
        },

        scoreAction: [
            layout.row,
            layout.itemsCenter,
            gutters.marginRight_16,
        ],

        scoreIcon: {
            backgroundColor: '#F0F0F0',
            borderRadius: 7,
            height: 14,
            marginRight: 4,
            width: 14,
        },

        scoreText: {
            backgroundColor: '#EEEEEE',
            borderRadius: 2,
            height: 12,
            width: 20,
        },

        sourceContainer: {
            backgroundColor: '#EEEEEE',
            borderRadius: 2,
            height: 12,
            width: 50,
        },

        timeContainer: {
            backgroundColor: '#EEEEEE',
            borderRadius: 2,
            height: 12,
            width: 60,
        },

        titleContainer: gutters.marginBottom_12,

        titleLine: {
            backgroundColor: '#E8E8E8',
            borderRadius: 3,
            height: 16,
            marginBottom: 6,
            width: '92%' as const,
        },

        typeBadge: {
            alignItems: 'center' as const,
            backgroundColor: '#F0F0F0',
            borderRadius: 10,
            height: 20,
            justifyContent: 'center' as const,
            width: 40,
        },
    };
}; 