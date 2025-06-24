import { StoryItemModel, StoryWithDetailsModel } from '@/models';
import { storyService } from '@/services';
import {useEffect, useMemo, useState} from 'react';

import { useStory } from '@/hooks';

export const useStoryDetailViewModel = (storyId: number, initialStory?: StoryWithDetailsModel) => {
    const { useStoryWithCommentsQuery } = useStory();

    const [displayedComments, setDisplayedComments] = useState<StoryItemModel[]>([]);
    const [commentsToShow, setCommentsToShow] = useState(10);
    const [loadingRepliesIds, setLoadingRepliesIds] = useState<Set<number>>(new Set());

    // Get story with initial comments
    const storyQuery = useStoryWithCommentsQuery(storyId, commentsToShow);

    // Use initial story if provided, otherwise use query result
    const story: StoryWithDetailsModel | undefined = useMemo(() => {
        return storyQuery.data ?? initialStory;
    },[initialStory, storyQuery.data ]);

    // Update displayed comments when query data changes
    useEffect(() => {
        if (storyQuery.data?.comments) {
            setDisplayedComments(storyQuery.data.comments);
        }
    }, [storyQuery.data?.comments]);

    // Load more comments
    const loadMoreComments = () => {
        if (story?.kids && commentsToShow < story.kids.length) {
            const newCommentsToShow = Math.min(commentsToShow + 10, story.kids.length);
            setCommentsToShow(newCommentsToShow);
        }
    };

    // Check if there are more comments to load
    const hasMoreComments = story?.kids && commentsToShow < story.kids.length;

    const handleResetError = () => {
        storyQuery.refetch();
    };

    // Fetch replies for a specific comment
    const fetchReplies = async (commentId: number, replyIds: number[]) => {
        if (replyIds.length === 0) return;

        // Add to loading set
        setLoadingRepliesIds(previous => new Set([commentId, ...previous]));

        try {
            const replies = await storyService.getComments(replyIds);

            // Add replies to displayed comments (avoid duplicates)
            setDisplayedComments(previous => {
                const existingIds = new Set(previous.map(c => c.id));
                const newReplies = replies.filter(reply => !existingIds.has(reply.id));
                return [...previous, ...newReplies];
            });
        } catch (error) {
            console.error('Failed to fetch replies:', error);
        } finally {
            // Remove from loading set
            setLoadingRepliesIds(previous => {
                const newSet = new Set(previous);
                newSet.delete(commentId);
                return newSet;
            });
        }
    };

    return {
        comments: displayedComments, // Models already have timeFormatted
        error: storyQuery.error,
        fetchReplies,
        handleResetError,
        hasMoreComments: !!hasMoreComments,
        isError: storyQuery.isError,
        isLoading: storyQuery.isLoading,
        isLoadingMore: storyQuery.isFetching && !storyQuery.isLoading,
        loadingRepliesIds,
        loadMoreComments,
        story: story, // Model already has timeFormatted
    };
}; 