/**
 * Extract domain from URL
 * @param url Full URL string
 * @returns Domain name without 'www.' prefix, or empty string if invalid URL
 */
export const extractDomain = (url: string): string => {
    try {
        return new URL(url).hostname.replace('www.', '');
    } catch {
        return '';
    }
};

/**
 * Check if URL is valid
 * @param url URL string to validate
 * @returns true if URL is valid, false otherwise
 */
export const isValidUrl = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

/**
 * Get URL protocol (http, https, etc.)
 * @param url URL string
 * @returns Protocol string or empty string if invalid
 */
export const getUrlProtocol = (url: string): string => {
    try {
        return new URL(url).protocol;
    } catch {
        return '';
    }
};

/**
 * Check if URL is external (not relative)
 * @param url URL string
 * @returns true if URL is external (has protocol), false otherwise
 */
export const isExternalUrl = (url: string): boolean => {
    return /^https?:\/\//.test(url);
}; 