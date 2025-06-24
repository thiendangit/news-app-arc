import { AssetByVariant, IconByVariant } from '@/components/atoms';
import { CommentItem } from '@/components/molecules';
import { useStoryDetailViewModel } from './StoryDetail.viewModel';
import { useTheme } from '@/theme';
import { memo, useState } from 'react';
import isEqual from 'react-fast-compare';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Linking,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { StoryItemModel } from '@/models';

type Props = {
    route: {
        params: {
            storyId: number;
        };
    };
    navigation: {
        goBack: () => void;
    };
};

function StoryDetail({ route, navigation }: Props) {
    const { storyId } = route.params;
    const theme = useTheme();

    // State for managing expanded replies
    const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());

    const {
        story,
        comments,
        isLoading,
        isError,
        isLoadingMore,
        hasMoreComments,
        handleResetError,
        loadMoreComments,
        fetchReplies,
        loadingRepliesIds,
    } = useStoryDetailViewModel(storyId);

    const handleOpenURL = async (url: string) => {
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert('Error', `Cannot open URL: ${url}`);
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while opening the URL');
        }
    };

    const renderStoryPreview = (url?: string) => {
        if (!url) {
            return (
                <View style={styles.headerImageContainer}>
                    <View style={styles.defaultImageContainer}>
                        <AssetByVariant
                            path="logo"
                            style={{ width: 60, height: 60, opacity: 0.3 }}
                        />
                    </View>
                </View>
            );
        }

        const domain = url.replace(/^https?:\/\//, '').split('/')[0];
        const imageUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;

        return (
            <View style={styles.headerImageContainer}>
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.headerImage}
                    defaultSource={require('@/theme/assets/images/logo.png')}
                />
            </View>
        );
    };

    // Function to toggle replies visibility and fetch if needed
    const toggleReplies = async (comment: StoryItemModel) => {
        const commentId = comment.id;
        const isExpanded = expandedComments.has(commentId);

        if (isExpanded) {
            // Collapse replies
            const newExpanded = new Set(expandedComments);
            newExpanded.delete(commentId);
            setExpandedComments(newExpanded);
        } else {
            // Expand replies - fetch them if not already loaded
            const newExpanded = new Set(expandedComments);
            newExpanded.add(commentId);
            setExpandedComments(newExpanded);

            // Check if replies are already loaded
            if (comment.kids && comment.kids.length > 0) {
                const existingReplyIds = new Set(comments.map(c => c.id));
                const missingReplyIds = comment.kids.filter(id => !existingReplyIds.has(id));

                if (missingReplyIds.length > 0) {
                    // Fetch missing replies
                    await fetchReplies(commentId, missingReplyIds);
                }
            }
        }
    };

    const renderComment = (comment: StoryItemModel, depth: number, allComments: StoryItemModel[]) => {
        const isExpanded = expandedComments.has(comment.id);
        const isLoadingReplies = loadingRepliesIds.has(comment.id);

        return (
            <CommentItem
                key={comment.id}
                comment={comment}
                depth={depth}
                isExpanded={isExpanded}
                isLoadingReplies={isLoadingReplies}
                onToggleReplies={toggleReplies}
            >
                {/* Render nested replies if expanded */}
                {isExpanded && allComments
                    .filter(c => c.parent === comment.id)
                    .map(reply => renderComment(reply, depth + 1, allComments))
                }
            </CommentItem>
        );
    };

    const styles = {
        container: {
            backgroundColor: theme.colors.gray50,
            flex: 1,
        },
        floatingBackButton: {
            position: 'absolute' as const,
            top: (StatusBar.currentHeight || 44) + 10,
            left: 16,
            zIndex: 1000,
        },
        floatingMoreButton: {
            position: 'absolute' as const,
            top: (StatusBar.currentHeight || 44) + 10,
            right: 16,
            zIndex: 1000,
        },
        headerImageContainer: {
            position: 'relative' as const,
            height: 300,
            width: '100%' as const,
        },
        headerImage: {
            width: '100%' as const,
            height: '100%' as const,
            resizeMode: 'cover' as const,
        },
        defaultImageContainer: {
            width: '100%' as const,
            height: '100%' as const,
            backgroundColor: theme.colors.orange500,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
        },
        headerOverlay: {
            position: 'absolute' as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
        },
        headerContent: {
            position: 'absolute' as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'flex-end' as const,
            paddingBottom: 30,
            paddingHorizontal: 16,
        },
        backButton: {
            alignItems: 'center' as const,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 20,
            height: 40,
            justifyContent: 'center' as const,
            width: 40,
        },
        moreButton: {
            alignItems: 'center' as const,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 20,
            height: 40,
            justifyContent: 'center' as const,
            width: 40,
        },
        headerTitleContainer: {
            paddingHorizontal: 20,
            paddingTop: 60, // Add top padding to avoid floating buttons
        },
        categoryBadge: {
            alignSelf: 'flex-start' as const,
            backgroundColor: theme.colors.orange500,
            borderRadius: 12,
            marginBottom: 12,
            paddingHorizontal: 12,
            paddingVertical: 6,
        },
        categoryText: {
            color: '#FFFFFF',
            fontSize: 12,
            fontWeight: '600' as const,
            textTransform: 'uppercase' as const,
        },
        headerTitle: {
            color: '#FFFFFF',
            fontSize: 24,
            fontWeight: 'bold' as const,
            lineHeight: 32,
            textAlign: 'left' as const,
        },
        headerSubtitle: {
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: 14,
            marginTop: 8,
        },
        contentContainer: {
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            marginTop: -20,
            minHeight: Dimensions.get('window').height - 200,
            paddingTop: 24,
            paddingHorizontal: 20,
            paddingBottom: 40,
        },
        storyMeta: {
            color: theme.colors.gray400,
            fontSize: 14,
            marginBottom: 16,
        },
        storyText: {
            color: theme.colors.gray800,
            fontSize: 16,
            lineHeight: 24,
            marginBottom: 20,
            marginTop: 16,
        },
        readMoreButton: {
            backgroundColor: theme.colors.orange500,
            borderRadius: 12,
            marginTop: 16,
            paddingVertical: 12,
            alignItems: 'center' as const,
        },
        readMoreButtonText: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '600' as const,
        },
        commentsSection: {
            marginTop: 20,
        },
        commentsHeader: {
            alignItems: 'center' as const,
            flexDirection: 'row' as const,
            marginBottom: 16,
        },
        commentsTitle: {
            color: theme.colors.gray800,
            fontSize: 18,
            fontWeight: 'bold' as const,
        },
        commentsCount: {
            color: theme.colors.gray400,
            fontSize: 16,
            marginLeft: 8,
        },
        loadMoreButton: {
            alignItems: 'center' as const,
            backgroundColor: theme.colors.orange100,
            borderRadius: 12,
            marginTop: 16,
            paddingVertical: 12,
        },
        loadMoreText: {
            color: theme.colors.orange500,
            fontSize: 16,
            fontWeight: '600' as const,
        },
        loadingContainer: {
            alignItems: 'center' as const,
            flex: 1,
            justifyContent: 'center' as const,
            paddingVertical: 40,
        },
        loadingText: {
            color: theme.colors.gray400,
            fontSize: 16,
            marginTop: 12,
        },
        errorContainer: {
            alignItems: 'center' as const,
            flex: 1,
            justifyContent: 'center' as const,
            paddingHorizontal: 20,
        },
        errorText: {
            color: theme.colors.gray400,
            fontSize: 16,
            marginBottom: 20,
            textAlign: 'center' as const,
        },
        retryButton: {
            backgroundColor: theme.colors.orange500,
            borderRadius: 12,
            paddingHorizontal: 24,
            paddingVertical: 12,
        },
        retryButtonText: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '600' as const,
        },
    };

    if (isLoading && !story) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator color={theme.colors.orange500} size="large" />
                    <Text style={styles.loadingText}>Loading story...</Text>
                </View>
            </View>
        );
    }

    if (isError && !story) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>
                        Failed to load story. Please try again.
                    </Text>
                    <TouchableOpacity onPress={handleResetError} style={styles.retryButton}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* Floating Back Button */}
            <View style={styles.floatingBackButton}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <IconByVariant path="arrow-left" stroke={theme.colors.gray800} />
                </TouchableOpacity>
            </View>

            {/* Floating More Button */}
            <View style={styles.floatingMoreButton}>
                <TouchableOpacity style={styles.moreButton}>
                    <AssetByVariant path="more" style={{ height: 20, width: 20 }} />
                </TouchableOpacity>
            </View>

            {/* Main ScrollView for entire content including header */}
            <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                bounces={true}
            >
                {/* Header with hero image */}
                <View style={styles.headerImageContainer}>
                    {/* Background Image */}
                    {renderStoryPreview(story?.url)}

                    {/* Dark Overlay */}
                    <View style={styles.headerOverlay} />

                    {/* Header Content */}
                    <View style={styles.headerContent}>
                        {/* Title and subtitle at bottom */}
                        <View style={styles.headerTitleContainer}>
                            {/* Category Badge */}
                            <View style={styles.categoryBadge}>
                                <Text style={styles.categoryText}>
                                    {story?.type || 'Story'}
                                </Text>
                            </View>

                            <Text style={styles.headerTitle}>
                                {story?.title || 'Story Detail'}
                            </Text>

                            <Text style={styles.headerSubtitle}>
                                by {story?.by ?? 'Unknown'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Content Container */}
                <View style={styles.contentContainer}>
                    {/* Meta information */}
                    {story && (
                        <View style={{ marginBottom: 20 }}>
                            <Text style={styles.storyMeta}>
                                {story.score || 0} points • {story.commentsCount || 0} comments • {story.timeFormatted}
                            </Text>

                            {/* Story text content */}
                            {story.text && (
                                <Text style={styles.storyText}>
                                    {story.text.replaceAll(/<[^>]*>/g, '')}
                                </Text>
                            )}

                            {/* Read full article button */}
                            {story.url && (
                                <TouchableOpacity
                                    onPress={() => handleOpenURL(story.url)}
                                    style={styles.readMoreButton}
                                >
                                    <Text style={styles.readMoreButtonText}>
                                        Read Full Article
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}

                    {/* Comments Section */}
                    <View style={styles.commentsSection}>
                        <View style={styles.commentsHeader}>
                            <Text style={styles.commentsTitle}>Comments</Text>
                            <Text style={styles.commentsCount}>
                                ({story?.commentsCount || 0})
                            </Text>
                        </View>

                        {comments.length > 0 ? (
                            comments.map((comment: StoryItemModel) => renderComment(comment, 0, comments))
                        ) : (
                            <View style={styles.loadingContainer}>
                                <Text style={styles.loadingText}>No comments yet</Text>
                            </View>
                        )}

                        {hasMoreComments && (
                            <TouchableOpacity
                                disabled={isLoadingMore}
                                onPress={loadMoreComments}
                                style={styles.loadMoreButton}
                            >
                                {isLoadingMore ? (
                                    <ActivityIndicator color={theme.colors.orange500} size="small" />
                                ) : (
                                    <Text style={styles.loadMoreText}>Load More Comments</Text>
                                )}
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

export const StoryDetailScreen = memo(StoryDetail, isEqual);