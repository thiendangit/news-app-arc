import React from 'react';
import { Animated, StatusBar, Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/theme';

import { AssetByVariant, IconByVariant } from '@/components/atoms';

import { StoryHeaderProps } from '../../StoryDetail.types';
import { useStoryHeaderStyles } from './StoryHeader.styles.ts';

export function StoryHeader({
    getEnhancedTitle,
    isLike,
    onBack,
    onLike,
    showHeader,
}: StoryHeaderProps) {
    const theme = useTheme();
    const styles = useStoryHeaderStyles();

    return (
        <>
            <StatusBar
                backgroundColor="transparent"
                barStyle={showHeader ? 'dark-content' : 'light-content'}
                translucent
            />

            {/* Floating Back Button */}
            <View style={styles.floatingBackButton}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <IconByVariant path="arrow-left" stroke={theme.colors.gray800} />
                </TouchableOpacity>
            </View>

            {/* Floating Like Button */}
            <View style={styles.floatingMoreButton}>
                <TouchableOpacity onPress={onLike} style={styles.moreButton}>
                    <AssetByVariant
                        path={isLike ? 'heart_tint' : 'heart'}
                        style={styles.moreButtonIconSize}
                    />
                </TouchableOpacity>
            </View>

            {/* Animated Header */}
            <Animated.View
                style={[
                    styles.animatedHeader,
                    {
                        opacity: showHeader ? 1 : 0,
                        transform: [
                            {
                                translateY: showHeader ? 0 : -50,
                            },
                        ],
                    },
                ]}
            >
                <View style={styles.animatedHeaderContent}>
                    <TouchableOpacity onPress={onBack} style={styles.animatedBackButton}>
                        <IconByVariant path="arrow-left" stroke={theme.colors.gray800} />
                    </TouchableOpacity>
                    <Text numberOfLines={1} style={styles.animatedHeaderTitle}>
                        {getEnhancedTitle()}
                    </Text>
                    <TouchableOpacity onPress={onLike} style={styles.animatedLikeButton}>
                        <AssetByVariant
                            path={isLike ? 'heart_tint' : 'heart'}
                            style={styles.animatedLikeIcon}
                        />
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </>
    );
} 