import { StoryItemModel } from '@/models';

export const hasExternalUrl = (story: StoryItemModel): boolean => {
    return Boolean(story.url);
};

export const isAskHN = (story: StoryItemModel): boolean => {
    return story.type === 'story' && !story.url && Boolean(story.title.startsWith('Ask HN:'));
};

export const isShowHN = (story: StoryItemModel): boolean => {
    return story.type === 'story' && Boolean(story.title.startsWith('Show HN:'));
};

export const isJobStory = (story: StoryItemModel): boolean => {
    return story.type === 'job';
};

export const stripHtmlTags = (htmlText: string): string => {
    return htmlText.replaceAll(/<[^>]*>/g, '');
};

export const getStoryTypeLabel = (story: StoryItemModel): string => {
    if (isJobStory(story)) return 'job';
    if (isAskHN(story)) return 'ask';
    if (isShowHN(story)) return 'show';
    return 'story';
};

export const calculateReadingTime = (text: string): number => {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
}; 