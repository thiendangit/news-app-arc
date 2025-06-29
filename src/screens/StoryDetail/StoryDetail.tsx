import { StoryItemModel } from '@/models';
import { PreviewData } from '@flyerhq/react-native-link-preview/lib/types';
import { memo, useCallback, useState } from 'react';
import isEqual from 'react-fast-compare';
import {
    Alert,
    Animated,
    Linking,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    Share,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { useI18n } from '@/hooks';

import { Skeleton } from '@/components/atoms';

import { CommentsList, StoryContent, StoryHeader, StoryHeaderContent } from './components';
import { useStoryDetailStyles } from './StoryDetail.styles';
import { StoryDetailProps } from './StoryDetail.types';
import { useStoryDetailViewModel } from './StoryDetail.viewModel';

function StoryDetail({ navigation, route }: StoryDetailProps) {
    const { storyId } = route.params;
    const { t } = useI18n();
    const styles = useStoryDetailStyles();
    const [expandedComments, setExpandedComments] = useState<Set<number>>(
        new Set()
    );
    const [isLike, setIsLike] = useState<boolean>(true);
    const [previewData, setPreviewData] = useState<PreviewData>();
    const [scrollY] = useState(new Animated.Value(0));
    const [showHeader, setShowHeader] = useState(false);

    const HEADER_IMAGE_HEIGHT = 300;
    const {
        handlers: { fetchReplies, handleResetError, loadMoreComments },
        selectors: {
            comments,
            hasMoreComments,
            isError,
            isLoading,
            isLoadingMore,
            loadingRepliesIds,
            story,
        },
    } = useStoryDetailViewModel(storyId);

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
            Alert.alert(t('story_detail.actions.copy_link'), story.url, [
                { style: 'cancel', text: 'Cancel' },
                {
                    onPress: () => {
                        Alert.alert(t('story_detail.actions.copy_success'));
                    },
                    text: 'OK',
                },
            ]);
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
        setIsLike(!isLike);
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const handlePreviewDataFetched = useCallback((data: PreviewData) => {
        setPreviewData(data);
    }, []);

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        {
            listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
                const offsetY = event.nativeEvent.contentOffset.y;
                const shouldShowHeader = offsetY > HEADER_IMAGE_HEIGHT - 100;
                if (shouldShowHeader !== showHeader) {
                    setShowHeader(shouldShowHeader);
                }
            },
            useNativeDriver: false,
        }
    );

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
        return (
            story?.title ?? previewData?.title ?? t('story_detail.story_type.story')
        );
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

    // Loading State
    if (isLoading && !story) {
        return (
            <View style={styles.container}>
                {/* Header with floating buttons only */}
                <StoryHeader
                    getEnhancedTitle={() => t('story_detail.loading_story')}
                    isLike={isLike}
                    onBack={handleBack}
                    onLike={handleLike}
                    showHeader={false}
                />
                <ScrollView style={styles.scrollViewContainer}>
                    <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
                        <Skeleton
                            height={200}
                            loading
                            style={{ borderRadius: 12, marginBottom: 16 }}
                            width="100%"
                        />
                        <Skeleton
                            height={24}
                            loading
                            style={{ marginBottom: 8 }}
                            width="60%"
                        />
                        <Skeleton
                            height={48}
                            loading
                            style={{ marginBottom: 12 }}
                            width="100%"
                        />
                        <Skeleton
                            height={16}
                            loading
                            style={{ marginBottom: 16 }}
                            width="40%"
                        />
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Error State
    if (isError && !story) {
        return (
            <View style={styles.container}>
                {/* Header with floating buttons only */}
                <StoryHeader
                    getEnhancedTitle={() => t('story_detail.failed_to_load')}
                    isLike={isLike}
                    onBack={handleBack}
                    onLike={handleLike}
                    showHeader={false}
                />
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

    // Success State
    return (
        <View style={styles.container}>
            {/* Floating Header (Back & Like buttons + Animated header) */}
            <StoryHeader
                getEnhancedTitle={getEnhancedTitle}
                isLike={isLike}
                onBack={handleBack}
                onLike={handleLike}
                showHeader={showHeader}
            />

            <ScrollView
                bounces
                contentContainerStyle={{ paddingBottom: 40 }}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                style={styles.scrollViewContainer}
            >
                {/* Header Content (Image, Title, etc.) */}
                <StoryHeaderContent
                    story={story}
                    previewData={previewData}
                    getEnhancedTitle={getEnhancedTitle}
                    getStoryTypeText={getStoryTypeText}
                    onPreviewDataFetched={handlePreviewDataFetched}
                />

                <View style={styles.contentContainer}>
                    <StoryContent
                        getEnhancedDescription={getEnhancedDescription}
                        onCopyLink={handleCopyLink}
                        onOpenURL={handleOpenURL}
                        onShare={handleShare}
                        previewData={previewData}
                        story={story}
                    />

                    <CommentsList
                        comments={comments}
                        expandedComments={expandedComments}
                        hasMoreComments={hasMoreComments}
                        isLoading={isLoading}
                        isLoadingMore={isLoadingMore}
                        loadingRepliesIds={loadingRepliesIds}
                        onLoadMore={loadMoreComments}
                        onToggleReplies={toggleReplies}
                        story={story}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

export const StoryDetailScreen = memo(StoryDetail, isEqual);