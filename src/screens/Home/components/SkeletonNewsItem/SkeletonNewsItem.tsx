import React from 'react';
import { View } from 'react-native';

import { Skeleton } from '@/components/atoms';

import { useSkeletonNewsItemStyles } from './SkeletonNewsItem.styles';

type Props = {
    readonly index: number | string;
    readonly opacity?: number;
};

export function SkeletonNewsItem({ index, opacity = 1 }: Props) {
    const styles = useSkeletonNewsItemStyles();

    return (
        <View
            key={`skeleton-${index}`}
            style={[
                styles.newsCard,
                {
                    opacity,
                },
            ]}
        >
            <View style={styles.newsContent}>
                {/* Image placeholder with shimmer effect */}
                <View style={styles.imageContainer}>
                    <Skeleton
                        height={120}
                        loading
                        style={styles.imageSkeleton}
                        width="100%"
                    />
                </View>

                {/* Title lines with varying lengths */}
                <View style={styles.titleContainer}>
                    <View style={styles.titleLine}>
                        <Skeleton height={16} loading width="100%" />
                    </View>
                </View>

                {/* Metadata row - mimicking source • time • domain */}
                <View style={styles.metadataContainer}>
                    <View style={styles.sourceContainer}>
                        <Skeleton height={12} loading width="100%" />
                    </View>
                    <View style={styles.dotContainer} />
                    <View style={styles.timeContainer}>
                        <Skeleton height={12} loading width="100%" />
                    </View>
                    <View style={styles.dotContainer} />
                    <View style={styles.domainContainer}>
                        <Skeleton height={12} loading width="100%" />
                    </View>
                </View>

                {/* Actions row */}
                <View style={styles.actionsContainer}>
                    <View style={styles.leftActions}>
                        {/* Score */}
                        <View style={styles.scoreAction}>
                            <View style={styles.scoreIcon}>
                                <Skeleton height={14} loading width={14} />
                            </View>
                            <View style={styles.scoreText}>
                                <Skeleton height={12} loading width="100%" />
                            </View>
                        </View>

                        {/* Comments */}
                        <View style={styles.commentAction}>
                            <View style={styles.commentIcon}>
                                <Skeleton height={14} loading width={14} />
                            </View>
                            <View style={styles.commentText}>
                                <Skeleton height={12} loading width="100%" />
                            </View>
                        </View>

                        {/* Type badge */}
                        <View style={styles.typeBadge}>
                            <Skeleton height={20} loading width={40} />
                        </View>
                    </View>

                    {/* More button */}
                    <View style={styles.moreButton}>
                        <Skeleton height={16} loading width={16} />
                    </View>
                </View>
            </View>
        </View>
    );
} 