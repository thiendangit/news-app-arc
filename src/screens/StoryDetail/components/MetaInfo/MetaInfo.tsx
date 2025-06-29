import { StoryItemModel } from '@/models';
import React from 'react';
import { Text, View } from 'react-native';

import { useI18n } from '@/hooks';

import { AssetByVariant } from '@/components/atoms';

import { useMetaInfoStyles } from './MetaInfo.styles';

export type MetaInfoProps = {
    readonly isFloating?: boolean;
    readonly story: StoryItemModel;
};

export function MetaInfo({ isFloating = false, story }: MetaInfoProps) {
    const { t } = useI18n();
    const styles = useMetaInfoStyles();

    return (
        <View style={[styles.metaCard, isFloating ? styles.floatingCard : {}]}>
            <View style={styles.topRow}>
                {/* Score Badge */}
                <View style={styles.scoreBadge}>
                    <AssetByVariant path="reward" style={styles.rewardIcon} />
                    <Text style={styles.scoreText}>
                        {story.score || 0}
                    </Text>
                    <Text style={styles.pointsLabel}>
                        {t('story_detail.points')}
                    </Text>
                </View>

                {/* Story Type Badge */}
                <View style={styles.typeBadge}>
                    <Text style={styles.typeText}>
                        {story.type.toUpperCase() || 'STORY'}
                    </Text>
                </View>
            </View>

            <View style={styles.bottomRow}>
                {/* Comments Info */}
                <View style={styles.metaItem}>
                    <AssetByVariant path="comment" style={styles.metaIcon} />
                    <Text style={styles.metaText}>
                        {story.kids.length || 0} {t('story_detail.comments')}
                    </Text>
                </View>

                {/* Time Info */}
                <View style={styles.metaItem}>
                    <Text style={styles.timeText}>
                        {story.timeFormatted}
                    </Text>
                </View>
            </View>
        </View>
    );
} 