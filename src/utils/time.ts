import i18n from '@/translations';

export const formatTime = (unixTime: number): string => {
    const now = Date.now() / 1000;
    const diffSeconds = now - unixTime;

    if (diffSeconds < 60) {
        return i18n.t('time.just_now');
    } else if (diffSeconds < 3600) {
        const minutes = Math.floor(diffSeconds / 60);
        return i18n.t('time.minutes_ago', { count: minutes });
    } else if (diffSeconds < 86_400) {
        const hours = Math.floor(diffSeconds / 3600);
        return i18n.t('time.hours_ago', { count: hours });
    } else {
        const days = Math.floor(diffSeconds / 86_400);
        return i18n.t('time.days_ago', { count: days });
    }
};

export const formatStoryType = (type: string, title?: string, url?: string): string => {
    if (type === 'job') {
        return i18n.t('story.type.job');
    }
    if (type === 'story' && !url && title?.startsWith('Ask HN:')) {
        return i18n.t('story.type.ask');
    }
    if (type === 'story' && title?.startsWith('Show HN:')) {
        return i18n.t('story.type.show');
    }
    return i18n.t('story.type.story');
};

export const formatDate = (unixTime: number): string => {
    return new Date(unixTime * 1000).toLocaleDateString();
};

export const formatDateTime = (unixTime: number): string => {
    return new Date(unixTime * 1000).toLocaleString();
}; 