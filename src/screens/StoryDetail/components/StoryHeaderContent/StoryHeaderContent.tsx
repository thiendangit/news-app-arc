import { StoryItemModel } from '@/models';
import { PreviewData } from '@flyerhq/react-native-link-preview/lib/types';
import React from 'react';
import { Text, View } from 'react-native';

import { AssetByVariant } from '@/components/atoms';
import { LinkPreviewImage } from '@/components/molecules';

import { useStoryHeaderContentStyles } from './StoryHeaderContent.styles';

export type StoryHeaderContentProps = {
    readonly getEnhancedTitle: () => string;
    readonly getStoryTypeText: (type?: string) => string;
    readonly onPreviewDataFetched: (data: PreviewData) => void;
    readonly story: StoryItemModel;
};

export function StoryHeaderContent({
    getEnhancedTitle,
    getStoryTypeText,
    onPreviewDataFetched,
    story,
}: StoryHeaderContentProps) {
    const styles = useStoryHeaderContentStyles();

    const renderStoryPreview = (url?: string) => {
        if (!url) {
            return (
                <View style={styles.headerImageContainer}>
                    <View style={styles.defaultImageContainer}>
                        <AssetByVariant path="logo" style={styles.defaultImageSize} />
                    </View>
                </View>
            );
        }
        return (
            <View style={styles.headerImageContainer}>
                <LinkPreviewImage
                    containerStyle={styles.headerImageContainer}
                    enableAnimation={false}
                    imageStyle={styles.headerImage}
                    onPreviewDataFetched={onPreviewDataFetched}
                    url={url}
                />
            </View>
        );
    };

    return (
        <View style={styles.headerImageContainer}>
            {renderStoryPreview(story.url)}
            <View style={styles.headerOverlay} />
            <View style={styles.headerContent}>
                <View style={styles.headerTitleContainer}>
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>
                            {getStoryTypeText(story.type).toUpperCase()}
                        </Text>
                    </View>
                    <Text style={styles.headerTitle}>{getEnhancedTitle()}</Text>
                    <View style={styles.headerSubtitleContainer}>
                        <Text style={styles.headerSubtitle}>
                            by {story.by || 'Unknown'}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
} 