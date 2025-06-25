import { StoryItemModel } from '@/models';
import { PreviewData } from '@flyerhq/react-native-link-preview/lib/types';
import { FlashList } from '@shopify/flash-list';
import { memo, useCallback, useState } from 'react';
import isEqual from 'react-fast-compare';
import {
    ActivityIndicator,
    Alert,
    Linking,
    ScrollView,
    Share,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { useI18n } from '@/hooks';
import { useTheme } from '@/theme';

import { AssetByVariant, IconByVariant } from '@/components/atoms';
import { CommentItem, LinkPreviewImage } from '@/components/molecules';

import { useStoryDetailStyles } from './StoryDetail.styles';
import { useStoryDetailViewModel } from './StoryDetail.viewModel';
type Props = {
    readonly navigation: {
        goBack: () => void;
    };
    readonly route: {
        params: {
            storyId: number;
        };
    };
};
function StoryDetail({ navigation, route }: Props) {
    const { storyId } = route.params;
    const theme = useTheme();
    const { t } = useI18n();
    const styles = useStoryDetailStyles();
    const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
    const [isLike, setIsLike] = useState<boolean>(true);
    const [previewData, setPreviewData] = useState<PreviewData>();
    const { handlers: {
        fetchReplies,
        handleResetError,
        loadMoreComments,
    },
        selectors: {
            comments,
            hasMoreComments,
            isError,
            isLoading,
            isLoadingMore,
            loadingRepliesIds,
            story,
        } } = useStoryDetailViewModel(storyId);
    const handleOpenURL = async (url: string) => {
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                Linking.openURL(url);
            } else {
                Alert.alert('Error', t('story_detail.url_error.cannot_open'));
            }
        } catch {
            Alert.alert('Error', t('story_detail.url_error.open_error'));
        }
    };
    const handleCopyLink = () => {
        if (story?.url) {
            Alert.alert(
                t('story_detail.actions.copy_link'),
                story.url,
                [
                    { style: 'cancel', text: 'Cancel' },
                    { onPress: () => { Alert.alert(t('story_detail.actions.copy_success')); }, text: 'OK' }
                ]
            );
        }
    };
    const handleShare = async () => {
        if (story?.url && story.title) {
            try {
                await Share.share({
                    message: `${story.title}\n${story.url}`,
                    title: story.title,
                    url: story.url,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        }
    };
    const handleLike = () => {
        setIsLike(!isLike)
    };
    const handlePreviewDataFetched = useCallback((data: PreviewData) => {
        setPreviewData(data);
    }, []);
    const renderStoryPreview = (url?: string) => {
        if (!url) {
            return (
                <View style={styles.headerImageContainer}>
                    <View style={styles.defaultImageContainer}>
                        <AssetByVariant
                            path="logo"
                            style={styles.defaultImageSize}
                        />
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
                    onPreviewDataFetched={handlePreviewDataFetched}
                    url={url}
                />
            </View>
        );
    };
    const toggleReplies = (comment: StoryItemModel) => {
        const commentId = comment.id;
        const isExpanded = expandedComments.has(commentId);
        if (isExpanded) {
            const newExpanded = new Set(expandedComments);
            newExpanded.delete(commentId);
            setExpandedComments(newExpanded);
        } else {
            const newExpanded = new Set(expandedComments);
            newExpanded.add(commentId);
            setExpandedComments(newExpanded);
            if (comment.kids.length > 0) {
                const existingReplyIds = new Set(comments.map(c => c.id));
                const missingReplyIds = comment.kids.filter(id => !existingReplyIds.has(id));
                if (missingReplyIds.length > 0) {
                    fetchReplies(commentId, missingReplyIds);
                }
            }
        }
    };
    const renderComment = (comment: StoryItemModel, depth: number, allComments: StoryItemModel[]) => {
        const isExpanded = expandedComments.has(comment.id);
        const isLoadingReplies = loadingRepliesIds.has(comment.id);
        return (
            <CommentItem
                comment={comment}
                depth={depth}
                isExpanded={isExpanded}
                isLoadingReplies={isLoadingReplies}
                key={comment.id}
                onToggleReplies={toggleReplies}
            >
                { }
                {isExpanded ? allComments
                    .filter(c => c.parent === comment.id)
                    .map(reply => renderComment(reply, depth + 1, allComments)) : undefined
                }
            </CommentItem>
        );
    };
    if (isLoading && !story) {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="transparent" barStyle="light-content" translucent />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator color={theme.colors.orange500} size="large" />
                    <Text style={styles.loadingText}>{t('story_detail.loading_story')}</Text>
                </View>
            </View>
        );
    }
    if (isError && !story) {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="transparent" barStyle="light-content" translucent />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>
                        {t('story_detail.failed_to_load')}
                    </Text>
                    <TouchableOpacity onPress={handleResetError} style={styles.retryButton}>
                        <Text style={styles.retryButtonText}>{t('story_detail.retry')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    const getStoryTypeText = (type?: string) => {
        switch (type?.toLowerCase()) {
            case 'ask': {
                return t('story.type.ask');
            }
            case 'job': {
                return t('story.type.job');
            }
            case 'poll': {
                return t('story_detail.story_type.poll');
            }
            case 'show': {
                return t('story.type.show');
            }
            default: {
                return t('story.type.story');
            }
        }
    };
    const getEnhancedTitle = () => {
        return story?.title ?? previewData?.title ?? t('story_detail.story_type.story');
    };
    const getEnhancedDescription = () => {
        if (previewData?.description) {
            return previewData.description;
        }
        if (story?.text) {
            return story.text.replaceAll(/<[^>]*>/g, '');
        }
        return undefined;
    };
    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor="transparent"
                barStyle="light-content"
                translucent
            />
            <View style={styles.row}>
                { }
                <View style={styles.floatingBackButton}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack();
                        }}
                        style={styles.backButton}
                    >
                        <IconByVariant path="arrow-left" stroke={theme.colors.gray800} />
                    </TouchableOpacity>
                </View>
                { }
                <View style={styles.floatingMoreButton}>
                    <TouchableOpacity onPress={handleLike} style={styles.moreButton}>
                        <AssetByVariant path={isLike ? "heart_tint" : "heart"} style={styles.moreButtonIconSize} />
                    </TouchableOpacity>
                </View>
            </View>
            { }
            <ScrollView
                bounces
                showsVerticalScrollIndicator={false}
                style={styles.scrollViewContainer}
            >
                { }
                <View style={styles.headerImageContainer}>
                    { }
                    {renderStoryPreview(story?.url)}
                    { }
                    <View style={styles.headerOverlay} />
                    { }
                    <View style={styles.headerContent}>
                        { }
                        <View style={styles.headerTitleContainer}>
                            { }
                            <View style={styles.categoryBadge}>
                                <Text style={styles.categoryText}>
                                    {getStoryTypeText(story?.type)}
                                </Text>
                            </View>
                            <Text style={styles.headerTitle}>{getEnhancedTitle()}</Text>
                            <View style={styles.headerSubtitleContainer}>
                                <Text style={styles.headerSubtitle}>
                                    {t('story_detail.by')} {story?.by ?? 'Unknown'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                { }
                <View style={styles.contentContainer}>
                    { }
                    {story ? (
                        <View style={styles.metaInfoContainer}>
                            <View style={styles.storyMetaContainer}>
                                <View style={styles.scoreContainer}>
                                    <AssetByVariant path="reward" style={styles.rewardIcon} />
                                    <Text style={styles.scoreText}>
                                        {story.score || 0} {t('story_detail.points')}
                                    </Text>
                                </View>
                                <Text style={styles.storyMeta}>
                                    • {story.commentsCount || 0} {t('story_detail.comments')} •{' '}
                                    {story.timeFormatted}
                                </Text>
                            </View>
                            { }
                            {getEnhancedDescription() ? (
                                <Text style={styles.storyText}>
                                    {getEnhancedDescription()}
                                </Text>
                            ) : undefined}
                            { }
                            <View style={styles.bottomActionsContainer}>
                                { }
                                {story.url ? (
                                    <TouchableOpacity
                                        onPress={() => { handleOpenURL(story.url || ''); }}
                                        style={styles.readMoreButton}
                                    >
                                        <Text style={styles.readMoreButtonText}>
                                            {t('story_detail.read_full_article')}
                                        </Text>
                                    </TouchableOpacity>
                                ) : undefined}
                                { }
                                <View style={styles.actionsContainer}>
                                    <TouchableOpacity onPress={handleCopyLink} style={styles.actionButton}>
                                        <AssetByVariant path="copy" style={styles.actionIcon} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
                                        <AssetByVariant path="share" style={styles.actionIcon} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ) : undefined}
                    { }
                    <View style={styles.commentsSection}>
                        <View style={styles.commentsHeader}>
                            <Text style={styles.commentsTitle}>
                                {t('story_detail.comments_section')}
                            </Text>
                            <Text style={styles.commentsCount}>
                                ({story?.commentsCount ?? 0})
                            </Text>
                        </View>
                        {comments.length > 0 ? (
                            <FlashList
                                data={comments.filter(comment => comment.parent)}
                                estimatedItemSize={120}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => renderComment(item, 0, comments)}
                                scrollEnabled={false}
                                showsVerticalScrollIndicator={false}
                            />
                        ) : (
                            <View style={styles.loadingContainer}>
                                <Text style={styles.loadingText}>
                                    {t('story_detail.no_comments')}
                                </Text>
                            </View>
                        )}
                        {hasMoreComments ? (
                            <TouchableOpacity
                                disabled={isLoadingMore}
                                onPress={loadMoreComments}
                                style={styles.loadMoreButton}
                            >
                                {isLoadingMore ? (
                                    <ActivityIndicator
                                        color={theme.colors.orange500}
                                        size="small"
                                    />
                                ) : (
                                    <Text style={styles.loadMoreText}>
                                        {t('story_detail.load_more_comments')}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        ) : undefined}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
export const StoryDetailScreen = memo(StoryDetail, isEqual);