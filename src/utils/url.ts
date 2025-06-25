export const extractDomain = (url: string): string => {
    try {
        return new URL(url).hostname.replace('www.', '');
    } catch {
        return '';
    }
};
export const isValidUrl = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};
export const getUrlProtocol = (url: string): string => {
    try {
        return new URL(url).protocol;
    } catch {
        return '';
    }
};
export const isExternalUrl = (url: string): boolean => {
    return /^https?:\/\
}; 