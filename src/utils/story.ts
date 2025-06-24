import { StoryItemModel } from '@/models';

/**
 * Check if story has external URL
 * @param story Story item
 * @returns true if story has external URL, false if it's Ask HN/Show HN
 */
export const hasExternalUrl = (story: StoryItemModel): boolean => {
    return Boolean(story.url);
};

/**
 * Check if story is Ask HN type
 * @param story Story item
 * @returns true if story is Ask HN
 */
export const isAskHN = (story: StoryItemModel): boolean => {
    return story.type === 'story' && !story.url && Boolean(story.title?.startsWith('Ask HN:'));
};

/**
 * Check if story is Show HN type
 * @param story Story item
 * @returns true if story is Show HN
 */
export const isShowHN = (story: StoryItemModel): boolean => {
    return story.type === 'story' && Boolean(story.title?.startsWith('Show HN:'));
};

/**
 * Check if story is Job posting
 * @param story Story item
 * @returns true if story is job posting
 */
export const isJobStory = (story: StoryItemModel): boolean => {
    return story.type === 'job';
};

/**
 * Remove HTML tags from text
 * @param htmlText Text with HTML tags
 * @returns Clean text without HTML tags
 */
export const stripHtmlTags = (htmlText: string): string => {
    return htmlText.replace(/<[^>]*>/g, '');
};

/**
 * Get story type label for display
 * @param story Story item
 * @returns Human-readable story type
 */
export const getStoryTypeLabel = (story: StoryItemModel): string => {
    if (isJobStory(story)) return 'job';
    if (isAskHN(story)) return 'ask';
    if (isShowHN(story)) return 'show';
    return 'story';
};

/**
 * Calculate reading time estimate based on text length
 * @param text Story text content
 * @returns Estimated reading time in minutes
 */
export const calculateReadingTime = (text: string): number => {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
}; 