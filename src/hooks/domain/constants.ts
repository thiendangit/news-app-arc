export const QUERY_KEYS = {
    COMMENTS: 'comments',
    INFINITE_STORIES: 'infinite-stories',
    ITEM: 'item',
    PROFILE: 'profile',
    STORIES: 'stories',
    STORY_WITH_COMMENTS: 'story-with-comments',
    USER: 'user',
} as const;
export const CACHE_TIMES = {
    EXTENDED: 60 * 60 * 1000, 
    LONG: 30 * 60 * 1000, 
    MEDIUM: 10 * 60 * 1000, 
    SHORT: 5 * 60 * 1000, 
} as const;
export const STALE_TIMES = {
    LONG: 10 * 60 * 1000, 
    MEDIUM: 5 * 60 * 1000, 
    SHORT: 2 * 60 * 1000, 
} as const; 