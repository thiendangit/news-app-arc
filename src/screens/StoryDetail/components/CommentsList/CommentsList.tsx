import { StoryItemModel } from '@/models';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { useI18n } from '@/hooks';

import { Skeleton } from '@/components/atoms';
import { CommentItem } from '@/components/molecules';

import { CommentsListProps } from '../../StoryDetail.types';
import { useCommentsListStyles } from './CommentsList.styles';

export function CommentsList({
    comments,
    expandedComments,
    hasMoreComments,
    isLoading,
    isLoadingMore,
    loadingRepliesIds,
    onLoadMore,
    onToggleReplies,
    story,
}: CommentsListProps) {
    const { t } = useI18n();
    const styles = useCommentsListStyles();

    const renderComment = (
        comment: StoryItemModel,
        depth: number,
        allComments: StoryItemModel[]
    ) => {
        const isExpanded = expandedComments.has(comment.id);
        const isLoadingReplies = loadingRepliesIds.has(comment.id);
        return (
            <CommentItem
                comment={comment}
                depth={depth}
                isExpanded={isExpanded}
                isLoadingReplies={isLoadingReplies}
                key={comment.id}
                onToggleReplies={onToggleReplies}
            >
                {isExpanded && isLoadingReplies ? (
                    // Skeleton loading for replies
                    <View style={{ marginLeft: (depth + 1) * 16, marginTop: 8 }}>
                        {Array.from({ length: 2 }).map((_, index) => (
                            <View key={index} style={{ marginBottom: 12, paddingVertical: 8 }}>
                                <View
                                    style={{
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        marginBottom: 6,
                                    }}
                                >
                                    <Skeleton
                                        height={12}
                                        loading
                                        style={{ marginRight: 10 }}
                                        width="18%"
                                    />
                                    <Skeleton height={10} loading width="12%" />
                                </View>
                                <Skeleton
                                    height={14}
                                    loading
                                    style={{ marginBottom: 4 }}
                                    width="100%"
                                />
                                <Skeleton
                                    height={14}
                                    loading
                                    style={{ marginBottom: 4 }}
                                    width="75%"
                                />
                                <Skeleton height={14} loading width="60%" />
                            </View>
                        ))}
                    </View>
                ) : isExpanded ? (
                    allComments
                        .filter((c) => c.parent === comment.id)
                        .map((reply) => renderComment(reply, depth + 1, allComments))
                ) : undefined}
            </CommentItem>
        );
    };

    const renderSkeletonComments = () => (
        <View style={{ paddingHorizontal: 0 }}>
            {Array.from({ length: 4 }).map((_, index) => (
                <View key={index} style={{ marginBottom: 20, paddingVertical: 12 }}>
                    <View
                        style={{
                            alignItems: 'center',
                            flexDirection: 'row',
                            marginBottom: 8,
                        }}
                    >
                        <Skeleton
                            height={14}
                            loading
                            style={{ marginRight: 12 }}
                            width="20%"
                        />
                        <Skeleton height={12} loading width="15%" />
                    </View>
                    <Skeleton
                        height={16}
                        loading
                        style={{ marginBottom: 6 }}
                        width="100%"
                    />
                    <Skeleton
                        height={16}
                        loading
                        style={{ marginBottom: 6 }}
                        width="85%"
                    />
                    <Skeleton
                        height={16}
                        loading
                        style={{ marginBottom: 10 }}
                        width="70%"
                    />
                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                        <Skeleton
                            height={12}
                            loading
                            style={{ marginRight: 16 }}
                            width="12%"
                        />
                        <Skeleton height={12} loading width="10%" />
                    </View>
                </View>
            ))}
        </View>
    );

    const renderLoadMoreSkeleton = () => (
        <View style={{ marginTop: 16 }}>
            {Array.from({ length: 2 }).map((_, index) => (
                <View key={index} style={{ marginBottom: 20, paddingVertical: 12 }}>
                    <View
                        style={{
                            alignItems: 'center',
                            flexDirection: 'row',
                            marginBottom: 8,
                        }}
                    >
                        <Skeleton
                            height={14}
                            loading
                            style={{ marginRight: 12 }}
                            width="20%"
                        />
                        <Skeleton height={12} loading width="15%" />
                    </View>
                    <Skeleton
                        height={16}
                        loading
                        style={{ marginBottom: 6 }}
                        width="100%"
                    />
                    <Skeleton
                        height={16}
                        loading
                        style={{ marginBottom: 6 }}
                        width="85%"
                    />
                    <Skeleton height={16} loading width="70%" />
                </View>
            ))}
        </View>
    );

    return (
        <View style={[styles.commentsSection, { paddingBottom: 8 }]}>
            <View style={styles.commentsHeader}>
                <Text style={styles.commentsTitle}>
                    {t('story_detail.comments_section')}
                </Text>
                <Text style={styles.commentsCount}>
                    ({story?.kids?.length ?? 0})
                </Text>
            </View>

            {isLoading && comments.length === 0 ? (
                renderSkeletonComments()
            ) : comments.length > 0 ? (
                <FlashList
                    data={comments.filter((comment) => comment.parent)}
                    estimatedItemSize={120}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => renderComment(item, 0, comments)}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>{t('story_detail.no_comments')}</Text>
                </View>
            )}

            {isLoadingMore ? (
                renderLoadMoreSkeleton()
            ) : hasMoreComments ? (
                <TouchableOpacity onPress={onLoadMore} style={styles.loadMoreButton}>
                    <Text style={styles.loadMoreText}>
                        {t('story_detail.load_more_comments')}
                    </Text>
                </TouchableOpacity>
            ) : undefined}
        </View>
    );
} 