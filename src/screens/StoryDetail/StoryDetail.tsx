import { StoryItemModel } from '@/models';
import { PreviewData } from '@flyerhq/react-native-link-preview/lib/types';
import { FlashList } from '@shopify/flash-list';
import { memo, useCallback, useState } from 'react';
import isEqual from 'react-fast-compare';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Linking, NativeScrollEvent, NativeSyntheticEvent,
    ScrollView,
    Share,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { useI18n } from '@/hooks';
import { useTheme } from '@/theme';

import { AssetByVariant, IconByVariant, Skeleton } from '@/components/atoms';
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
    const { t } = useI18n();
    const theme = useTheme();
    const styles = useStoryDetailStyles();
    const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
    const [isLike, setIsLike] = useState<boolean>(true);
    const [previewData, setPreviewData] = useState<PreviewData>();
    const [scrollY] = useState(new Animated.Value(0));
    const [showHeader, setShowHeader] = useState(false);

    const HEADER_IMAGE_HEIGHT = 300;
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

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        {
            listener: (event:  NativeSyntheticEvent<NativeScrollEvent>) => {
                const offsetY = event.nativeEvent.contentOffset.y;
                const shouldShowHeader = offsetY > HEADER_IMAGE_HEIGHT - 100;
                if (shouldShowHeader !== showHeader) {
                    setShowHeader(shouldShowHeader);
                }
            },
            useNativeDriver: false
        }
    );
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
                {isExpanded && isLoadingReplies ? (
                    // Skeleton loading for replies
                    <View style={{ marginLeft: (depth + 1) * 16, marginTop: 8 }}>
                        {Array.from({ length: 2 }).map((_, index) => (
                            <View key={index} style={{ marginBottom: 12, paddingVertical: 8 }}>
                                <View style={{ alignItems: 'center', flexDirection: 'row', marginBottom: 6 }}>
                                    <Skeleton height={12} loading style={{ marginRight: 10 }} width="18%" />
                                    <Skeleton height={10} loading width="12%" />
                                </View>
                                <Skeleton height={14} loading style={{ marginBottom: 4 }} width="100%" />
                                <Skeleton height={14} loading style={{ marginBottom: 4 }} width="75%" />
                                <Skeleton height={14} loading width="60%" />
                            </View>
                        ))}
                    </View>
                ) : isExpanded ? allComments
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
                {/* Floating back button - luôn hiển thị khi loading */}
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
                <ScrollView style={styles.scrollViewContainer}>
                    <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
                        <Skeleton height={200} loading style={{ borderRadius: 12, marginBottom: 16 }} width="100%" />
                        <Skeleton height={24} loading style={{ marginBottom: 8 }} width="60%" />
                        <Skeleton height={48} loading style={{ marginBottom: 12 }} width="100%" />
                        <Skeleton height={16} loading style={{ marginBottom: 16 }} width="40%" />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Skeleton height={16} loading width="30%" />
                            <Skeleton height={16} loading width="20%" />
                        </View>
                    </View>
                    <View style={{ paddingHorizontal: 16 }}>
                        <Skeleton height={16} loading style={{ marginBottom: 8 }} width="100%" />
                        <Skeleton height={16} loading style={{ marginBottom: 8 }} width="90%" />
                        <Skeleton height={16} loading style={{ marginBottom: 16 }} width="85%" />
                        <Skeleton height={40} loading style={{ borderRadius: 20, marginBottom: 20 }} width="50%" />
                    </View>
                    <View style={{ paddingHorizontal: 16 }}>
                        <Skeleton height={20} loading style={{ marginBottom: 16 }} width="40%" />
                        {Array.from({ length: 3 }).map((_, index) => (
                            <View key={index} style={{ marginBottom: 16 }}>
                                <View style={{ alignItems: 'center', flexDirection: 'row', marginBottom: 8 }}>
                                    <Skeleton height={16} loading style={{ marginRight: 12 }} width="25%" />
                                    <Skeleton height={12} loading width="15%" />
                                </View>
                                <Skeleton height={16} loading style={{ marginBottom: 4 }} width="100%" />
                                <Skeleton height={16} loading style={{ marginBottom: 4 }} width="80%" />
                                <Skeleton height={16} loading width="60%" />
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        );
    }
    if (isError && !story) {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="transparent" barStyle="light-content" translucent />
                {/* Floating back button - luôn hiển thị khi error */}
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
                barStyle={showHeader ? "dark-content" : "light-content"}
                translucent
            />
            {/* Animated Header */}
            <Animated.View style={[
                styles.animatedHeader,
                {
                    opacity: showHeader ? 1 : 0,
                    transform: [{
                        translateY: showHeader ? 0 : -50
                    }]
                }
            ]}>
                <View style={styles.animatedHeaderContent}>
                    <TouchableOpacity
                        onPress={() => { navigation.goBack(); }}
                        style={styles.animatedBackButton}
                    >
                        <IconByVariant path="arrow-left" stroke={theme.colors.gray800} />
                    </TouchableOpacity>
                    <Text numberOfLines={1} style={styles.animatedHeaderTitle}>
                        {getEnhancedTitle()}
                    </Text>
                    <TouchableOpacity onPress={handleLike} style={styles.animatedLikeButton}>
                        <AssetByVariant path={isLike ? "heart_tint" : "heart"} style={styles.animatedLikeIcon} />
                    </TouchableOpacity>
                </View>
            </Animated.View>
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
                contentContainerStyle={{ paddingBottom: 40 }}
                onScroll={handleScroll}
                scrollEventThrottle={16}
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
                    <View style={[styles.commentsSection, { paddingBottom: 8 }]}>
                        <View style={styles.commentsHeader}>
                            <Text style={styles.commentsTitle}>
                                {t('story_detail.comments_section')}
                            </Text>
                            <Text style={styles.commentsCount}>
                                ({story?.commentsCount ?? 0})
                            </Text>
                        </View>
                        {isLoading && comments.length === 0 ? (
                            // Skeleton loading for comments
                            <View style={{ paddingHorizontal: 0 }}>
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <View key={index} style={{ marginBottom: 20, paddingVertical: 12 }}>
                                        <View style={{ alignItems: 'center', flexDirection: 'row', marginBottom: 8 }}>
                                            <Skeleton height={14} loading style={{ marginRight: 12 }} width="20%" />
                                            <Skeleton height={12} loading width="15%" />
                                        </View>
                                        <Skeleton height={16} loading style={{ marginBottom: 6 }} width="100%" />
                                        <Skeleton height={16} loading style={{ marginBottom: 6 }} width="85%" />
                                        <Skeleton height={16} loading style={{ marginBottom: 10 }} width="70%" />
                                        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                            <Skeleton height={12} loading style={{ marginRight: 16 }} width="12%" />
                                            <Skeleton height={12} loading width="10%" />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        ) : comments.length > 0 ? (
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
                        {isLoadingMore ? <View style={{ marginTop: 16 }}>
                            {Array.from({ length: 2 }).map((_, index) => (
                                <View key={index} style={{ marginBottom: 20, paddingVertical: 12 }}>
                                    <View style={{ alignItems: 'center', flexDirection: 'row', marginBottom: 8 }}>
                                        <Skeleton height={14} loading style={{ marginRight: 12 }} width="20%" />
                                        <Skeleton height={12} loading width="15%" />
                                    </View>
                                    <Skeleton height={16} loading style={{ marginBottom: 6 }} width="100%" />
                                    <Skeleton height={16} loading style={{ marginBottom: 6 }} width="85%" />
                                    <Skeleton height={16} loading width="70%" />
                                </View>
                            ))}
                        </View> : undefined}
                        {hasMoreComments && !isLoadingMore ? (
                            <TouchableOpacity
                                onPress={loadMoreComments}
                                style={styles.loadMoreButton}
                            >
                                <Text style={styles.loadMoreText}>
                                    {t('story_detail.load_more_comments')}
                                </Text>
                            </TouchableOpacity>
                        ) : <ActivityIndicator />}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

export const StoryDetailScreen = memo(StoryDetail, isEqual);