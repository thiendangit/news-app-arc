/**
 * Query keys constants for React Query
 * Helps with cache management and type safety
 */
export const QUERY_KEYS = {
    // Story related queries
    COMMENTS: 'comments',
    INFINITE_STORIES: 'infinite-stories',
    ITEM: 'item',
    STORIES: 'stories',
    STORY_WITH_COMMENTS: 'story-with-comments',

    // Potential future keys
    PROFILE: 'profile',
    USER: 'user',
} as const;

/**
 * Cache times in milliseconds
 */
export const CACHE_TIMES = {
    // Short cache for frequently updated data
    SHORT: 5 * 60 * 1000, // 5 minutes

    // Medium cache for semi-static data  
    MEDIUM: 10 * 60 * 1000, // 10 minutes

    // Long cache for static data
    LONG: 30 * 60 * 1000, // 30 minutes

    // Extended cache for rarely changed data
    EXTENDED: 60 * 60 * 1000, // 1 hour
} as const;

/**
 * Stale times in milliseconds
 */
export const STALE_TIMES = {
    // Data becomes stale quickly
    SHORT: 2 * 60 * 1000, // 2 minutes

    // Normal stale time
    MEDIUM: 5 * 60 * 1000, // 5 minutes

    // Data stays fresh longer
    LONG: 10 * 60 * 1000, // 10 minutes
} as const; 