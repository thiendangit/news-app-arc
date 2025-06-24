import React from 'react';
import {
    ActivityIndicator,
    Image,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
} from 'react-native';
import { LinkPreview } from '@flyerhq/react-native-link-preview';
import { PreviewData } from '@flyerhq/react-native-link-preview/lib/types';

import { useTheme } from '@/theme';
import { StoryItemModel } from '@/models';

type CommentItemProps = {
    comment: StoryItemModel;
    depth: number;
    isExpanded: boolean;
    isLoadingReplies: boolean;
    onToggleReplies: (comment: StoryItemModel) => void;
    children?: React.ReactNode;
};

const windowWidth = Dimensions.get('window').width;

export const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    depth,
    isExpanded,
    isLoadingReplies,
    onToggleReplies,
    children,
}) => {
    const theme = useTheme();

    // Extract URLs from comment text
    const extractUrls = (text: string): string[] => {
        const urlRegex = /(https?:\/\/[^\s<>"]+)/gi;
        return text.match(urlRegex) || [];
    };

    const hasReplies = comment.kids && comment.kids.length > 0;
    const urls = comment.text ? extractUrls(comment.text) : [];
    const hasUrls = urls.length > 0;

    const renderLinkPreview = (url: string, index: number) => (
        <View key={index} style={styles.linkPreviewContainer}>
            <LinkPreview
                containerStyle={styles.linkPreviewContainer}
                enableAnimation
                renderLinkPreview={(payload: {
                    aspectRatio?: number;
                    containerWidth: number;
                    previewData?: PreviewData;
                }) => {
                    const imageUrl = payload.previewData?.image?.url;
                    if (imageUrl) {
                        return (
                            <Image
                                resizeMode="cover"
                                source={{ uri: imageUrl }}
                                style={styles.linkPreviewImage}
                            />
                        );
                    }
                    return undefined;
                }}
                text={url}
            />
        </View>
    );

    const indentStyle = {
        borderLeftColor: theme.colors.orange500,
        borderLeftWidth: depth > 0 ? 2 : 0,
        marginLeft: depth * 12,
        paddingLeft: depth > 0 ? 16 : 0,
    };

    const styles = {
        commentContainer: {
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            marginBottom: 12,
            padding: 16,
            elevation: depth > 0 ? 0 : 0,
            shadowColor: '#000',
            shadowOffset: { height: 1, width: 0 },
            shadowOpacity: 0,
            shadowRadius: 2,
        },
        commentHeader: {
            alignItems: 'center' as const,
            flexDirection: 'row' as const,
            justifyContent: 'space-between' as const,
            marginBottom: 12,
        },
        commentAuthorContainer: {
            alignItems: 'center' as const,
            flexDirection: 'row' as const,
        },
        avatarPlaceholder: {
            alignItems: 'center' as const,
            backgroundColor: theme.colors.orange500,
            borderRadius: 14,
            height: 28,
            justifyContent: 'center' as const,
            marginRight: 8,
            width: 28,
        },
        avatarText: {
            color: '#FFFFFF',
            fontSize: 12,
            fontWeight: 'bold' as const,
        },
        commentAuthor: {
            color: theme.colors.gray800,
            fontSize: 14,
            fontWeight: '600' as const,
        },
        commentTime: {
            color: theme.colors.gray400,
            fontSize: 12,
        },
        commentText: {
            color: theme.colors.gray800,
            fontSize: 14,
            lineHeight: 20,
            marginBottom: hasUrls ? 12 : 8,
        },
        linkPreviewContainer: {
            borderRadius: 8,
            marginBottom: 8,
            overflow: 'hidden' as const,
        },
        linkPreviewImage: {
            aspectRatio: windowWidth / (windowWidth * 0.6),
            borderRadius: 8,
        },
        repliesButton: {
            alignSelf: 'flex-start' as const,
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            paddingVertical: 4,
        },
        repliesText: {
            color: theme.colors.orange500,
            fontSize: 12,
            fontWeight: '600' as const,
        },
        repliesContainer: {
            marginTop: 8,
        },
    };

    return (
        <View>
            <View style={[styles.commentContainer, indentStyle]}>
                <View style={styles.commentHeader}>
                    <View style={styles.commentAuthorContainer}>
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>
                                {(comment.by || 'A').charAt(0).toUpperCase()}
                            </Text>
                        </View>
                        <Text style={styles.commentAuthor}>
                            {comment.by || 'Anonymous'}
                        </Text>
                    </View>
                    <Text style={styles.commentTime}>
                        {comment.timeFormatted ||
                            (comment.time ? new Date(comment.time * 1000).toLocaleString() : '')}
                    </Text>
                </View>

                {comment.text ? (
                    <Text style={styles.commentText}>
                        {comment.text.replaceAll(/<[^>]*>/g, '')}
                    </Text>
                ) : null}

                {/* Link Previews */}
                {hasUrls && (
                    <View>
                        {urls.slice(0, 2).map((url, index) => renderLinkPreview(url, index))}
                        {urls.length > 2 && (
                            <Text style={[styles.commentText, { fontSize: 12, fontStyle: 'italic' }]}>
                                +{urls.length - 2} more links
                            </Text>
                        )}
                    </View>
                )}

                {hasReplies ? (
                    <TouchableOpacity
                        style={styles.repliesButton}
                        onPress={() => onToggleReplies(comment)}
                        disabled={isLoadingReplies}
                    >
                        {isLoadingReplies ? (
                            <>
                                <ActivityIndicator size="small" color={theme.colors.orange500} />
                                <Text style={[styles.repliesText, { marginLeft: 8 }]}>
                                    Loading replies...
                                </Text>
                            </>
                        ) : (
                            <Text style={styles.repliesText}>
                                {isExpanded ? '▼' : '▶'} {comment.kids.length} replies
                            </Text>
                        )}
                    </TouchableOpacity>
                ) : null}
            </View>

            {/* Render nested replies */}
            {isExpanded && children && (
                <View style={styles.repliesContainer}>
                    {children}
                </View>
            )}
        </View>
    );
}; 