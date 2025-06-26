import { StoryItemModel, StoryWithDetailsModel } from '@/models';
import { storyService } from '@/services';
import { useEffect, useMemo, useState } from 'react';

import { useStory } from '@/hooks';
export const useStoryDetailViewModel = (storyId: number, initialStory?: StoryWithDetailsModel) => {
    const { useStoryWithCommentsQuery } = useStory();
    const [displayedComments, setDisplayedComments] = useState<StoryItemModel[]>([]);
    const [commentsToShow, setCommentsToShow] = useState(10);
    const [loadingRepliesIds, setLoadingRepliesIds] = useState<Set<number>>(new Set());
    const [isLoadingMoreComments, setIsLoadingMoreComments] = useState(false);
    const storyQuery = useStoryWithCommentsQuery(storyId, commentsToShow);
    const story: StoryWithDetailsModel | undefined = useMemo(() => {
        return storyQuery.data ?? initialStory;
    }, [initialStory, storyQuery.data]);
    useEffect(() => {
        if (storyQuery.data?.comments) {
            setDisplayedComments(storyQuery.data.comments);
        }
    }, [storyQuery.data?.comments]);

    useEffect(() => {
        if (!storyQuery.isLoading && !storyQuery.isFetching) {
            setIsLoadingMoreComments(false);
        }
    }, [storyQuery.isLoading, storyQuery.isFetching]);
    const hasMoreComments = story?.kids && commentsToShow < story.kids.length;
    const handleResetError = () => {
        storyQuery.refetch();
    };
    const handleRefresh = async () => {
        await storyQuery.refetch();
    };
    const loadMoreComments = () => {
        if (story?.kids && commentsToShow < story.kids.length && !isLoadingMoreComments && !storyQuery.isFetching) {
            setIsLoadingMoreComments(true);
            const newCommentsToShow = Math.min(commentsToShow + 10, story.kids.length);
            setCommentsToShow(newCommentsToShow);
        }
    };
    const fetchReplies = async (commentId: number, replyIds: number[]) => {
        if (replyIds.length === 0) return;
        setLoadingRepliesIds(previous => new Set([commentId, ...previous]));
        try {
            const replies = await storyService.getComments(replyIds);
            setDisplayedComments(previous => {
                const existingIds = new Set(previous.map(c => c.id));
                const newReplies = replies.filter(reply => !existingIds.has(reply.id));
                return [...previous, ...newReplies];
            });
        } catch (error) {
            console.error('Failed to fetch replies:', error);
        } finally {
            setLoadingRepliesIds(previous => {
                const newSet = new Set(previous);
                newSet.delete(commentId);
                return newSet;
            });
        }
    };
    return {
        handlers: {
            fetchReplies,
            handleRefresh,
            handleResetError,
            loadMoreComments,
        },
        selectors: {
            comments: displayedComments,
            commentsToShow,
            error: storyQuery.error,
            hasMoreComments: !!hasMoreComments,
            isError: storyQuery.isError,
            isLoading: storyQuery.isLoading,
            isLoadingMore: isLoadingMoreComments,
            isRefreshing: storyQuery.isRefetching,
            loadingRepliesIds,
            story: story,
        },
        tests: {
            displayedComments,
            setCommentsToShow,
            setDisplayedComments,
            setIsLoadingMoreComments,
            setLoadingRepliesIds,
            storyQuery,
        },
    };
}; 