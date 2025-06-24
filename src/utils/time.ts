/**
 * Format Unix timestamp to relative time string
 * @param unixTime Unix timestamp in seconds
 * @returns Formatted relative time string (e.g., "5m ago", "2h ago", "3d ago")
 */
/* eslint-disable no-magic-numbers */
export const formatTime = (unixTime: number): string => {
    const now = Date.now() / 1000;
    const diffSeconds = now - unixTime;

    if (diffSeconds < 3600) {
        return `${Math.floor(diffSeconds / 60)}m ago`;
    } else if (diffSeconds < 86_400) {
        return `${Math.floor(diffSeconds / 3600)}h ago`;
    } else {
        return `${Math.floor(diffSeconds / 86_400)}d ago`;
    }
};

/**
 * Format Unix timestamp to readable date string
 * @param unixTime Unix timestamp in seconds
 * @returns Formatted date string
 */
export const formatDate = (unixTime: number): string => {
    return new Date(unixTime * 1000).toLocaleDateString();
};

/**
 * Format Unix timestamp to readable date and time string
 * @param unixTime Unix timestamp in seconds
 * @returns Formatted date and time string
 */
export const formatDateTime = (unixTime: number): string => {
    return new Date(unixTime * 1000).toLocaleString();
}; 