import React from 'react';
import { View } from 'react-native';

import { SkeletonNewsItem } from '@/screens/Home/components';

import { useLoadMoreFooterStyles } from './LoadMoreFooter.styles';

export function LoadMoreFooter() {
    const styles = useLoadMoreFooterStyles();

    return (
        <View style={styles.container}>
            {Array.from({ length: 2 })
                .fill(0)
                .map((_, index) => (
                    <View key={`footer-skeleton-${index}`} style={styles.itemContainer}>
                        <SkeletonNewsItem index={`footer-${index}`} opacity={0.5} />
                    </View>
                ))}
        </View>
    );
} 