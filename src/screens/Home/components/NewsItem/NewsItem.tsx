import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';

import { AssetByVariant } from '@/components/atoms';
import { LinkPreviewImage } from '@/components/molecules';

import { NewsItemType } from '../../Home.types.ts';
import { useNewsItemStyles } from './NewsItem.styles.ts';

type Props = {
    readonly item: NewsItemType;
    readonly onPress: (item: NewsItemType) => void;
};

export function NewsItem({ item, onPress }: Props) {
    const styles = useNewsItemStyles();

    const handlePress = () => {
        onPress(item);
    };

    return (
        <TouchableOpacity onPress={handlePress} style={styles.newsCard}>
            <View style={styles.newsContent}>
                {item.url ? (
                    <LinkPreviewImage
                        containerStyle={styles.linkPreviewContainer}
                        imageStyle={styles.linkPreviewImage}
                        resizeMode={FastImage.resizeMode.cover}
                        url={item.url}
                    />
                ) : undefined}

                <Text numberOfLines={3} style={styles.newsTitle}>
                    {item.title}
                </Text>

                <View style={styles.newsMetadata}>
                    <Text style={styles.newsSource}>{item.source}</Text>
                    <Text style={styles.newsDot}>•</Text>
                    <Text style={styles.newsTime}>{item.timeAgo}</Text>
                    {item.domain ? (
                        <>
                            <Text style={styles.newsDot}>•</Text>
                            <Text style={styles.newsDomain}>{item.domain}</Text>
                        </>
                    ) : undefined}
                </View>

                <View style={styles.newsActions}>
                    <View style={styles.newsActions}>
                        <View style={styles.actionButton}>
                            <AssetByVariant path="reward" style={styles.icon} />
                            <Text style={styles.scoreText}>{item.score}</Text>
                        </View>

                        <View style={styles.actionButton}>
                            <AssetByVariant path="comment" style={styles.icon} />
                            <Text style={styles.actionText}>{item.commentsCount}</Text>
                        </View>

                        <TouchableOpacity style={styles.actionButton}>
                            <Text style={styles.storyType}>{item.type.toUpperCase()}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.iconMoreContainer}>
                        <AssetByVariant path="more" style={[styles.icon]} />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}