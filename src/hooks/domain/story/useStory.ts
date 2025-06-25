import { StoryItemModel } from '@/models';
import { storyService, StoryType } from '@/services/storyService';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { CACHE_TIMES, QUERY_KEYS, STALE_TIMES } from '@/hooks';
export const useStory = () => {
    const useStoriesQuery = (type: StoryType, page = 0, limit = 20) => {
        return useQuery({
            gcTime: CACHE_TIMES.MEDIUM,
            queryFn: () => storyService.getStoriesPaginated(type, page, limit),
            queryKey: [QUERY_KEYS.STORIES, type, page, limit],
            staleTime: STALE_TIMES.MEDIUM,
        });
    };
    const useInfiniteStoriesQuery = (type: StoryType, limit = 20) => {
        return useInfiniteQuery({
            gcTime: CACHE_TIMES.MEDIUM,
            getNextPageParam: (lastPage: StoryItemModel[], allPages) => {
                return lastPage.length === limit ? allPages.length : undefined;
            },
            initialPageParam: 0,
            queryFn: ({ pageParam = 0 }) =>
                storyService.getStoriesPaginated(type, pageParam, limit),
            queryKey: [QUERY_KEYS.INFINITE_STORIES, type, limit],
            staleTime: STALE_TIMES.MEDIUM,
        });
    };
    const useStoryWithCommentsQuery = (id: number, maxComments = 10) => {
        return useQuery({
            enabled: !!id,
            gcTime: CACHE_TIMES.LONG, 
            queryFn: () => storyService.getStoryWithComments(id, maxComments),
            queryKey: [QUERY_KEYS.STORY_WITH_COMMENTS, id, maxComments],
            staleTime: STALE_TIMES.MEDIUM,
        });
    };
    const useItemQuery = (id: number) => {
        return useQuery({
            enabled: !!id,
            gcTime: CACHE_TIMES.EXTENDED,
            queryFn: () => storyService.getItem(id),
            queryKey: [QUERY_KEYS.ITEM, id],
            staleTime: STALE_TIMES.LONG, 
        });
    };
    const useCommentsQuery = (commentIds: number[]) => {
        return useQuery({
            enabled: commentIds.length > 0,
            gcTime: CACHE_TIMES.LONG,
            queryFn: () => storyService.getComments(commentIds),
            queryKey: [QUERY_KEYS.COMMENTS, commentIds],
            staleTime: STALE_TIMES.LONG,
        });
    };
    const useUserQuery = (username: string) => {
        return useQuery({
            enabled: !!username,
            gcTime: CACHE_TIMES.EXTENDED,
            queryFn: () => storyService.getUser(username),
            queryKey: [QUERY_KEYS.USER, username],
            staleTime: STALE_TIMES.LONG,
        });
    };
    return {
        useCommentsQuery,
        useInfiniteStoriesQuery,
        useItemQuery,
        useStoriesQuery,
        useStoryWithCommentsQuery,
        useUserQuery,
    };
}; 