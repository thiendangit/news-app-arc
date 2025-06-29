import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { useI18n } from '@/hooks';

import { AssetByVariant } from '@/components/atoms';

import { StoryContentProps } from '../../StoryDetail.types';
import { MetaInfo } from '../MetaInfo';
import { useStoryContentStyles } from './StoryContent.styles';

export function StoryContent({
    getEnhancedDescription,
    onCopyLink,
    onOpenURL,
    onShare,
    story,
}: StoryContentProps) {
    const { t } = useI18n();
    const styles = useStoryContentStyles();

    if (!story) {
        return undefined;
    }

    return (
        <View style={styles.container}>
            {/* Meta Info Component */}
            <MetaInfo story={story} />

            {/* Story Description */}
            {getEnhancedDescription() ? (
                <View style={styles.descriptionContainer}>
                    <Text style={styles.storyText}>{getEnhancedDescription()}</Text>
                </View>
            ) : undefined}

            {/* Action Buttons */}
            <View style={styles.actionsCard}>
                {story.url ? (
                    <TouchableOpacity
                        onPress={() => {
                            onOpenURL(story.url || '');
                        }}
                        style={styles.readMoreButton}
                    >
                        <Text style={styles.readMoreButtonText}>
                            {t('story_detail.read_full_article')}
                        </Text>
                    </TouchableOpacity>
                ) : undefined}

                <View style={styles.secondaryActions}>
                    <TouchableOpacity onPress={onCopyLink} style={styles.actionButton}>
                        <AssetByVariant path="copy" style={styles.actionIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onShare} style={styles.actionButton}>
                        <AssetByVariant path="share" style={styles.actionIcon} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
} 