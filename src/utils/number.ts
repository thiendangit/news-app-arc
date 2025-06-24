/**
 * Format number with thousand separators
 * @param num Number to format
 * @returns Formatted number string (e.g., 1,234)
 */
export const formatNumber = (num: number): string => {
    return num.toLocaleString();
};

/**
 * Format number to compact notation (K, M, B)
 * @param num Number to format
 * @returns Compact number string (e.g., 1.2K, 3.4M)
 */
export const formatCompactNumber = (num: number): string => {
    if (num >= 1_000_000_000) {
        return `${(num / 1_000_000_000).toFixed(1)}B`;
    }
    if (num >= 1_000_000) {
        return `${(num / 1_000_000).toFixed(1)}M`;
    }
    if (num >= 1_000) {
        return `${(num / 1_000).toFixed(1)}K`;
    }
    return num.toString();
};

/**
 * Format score with proper pluralization
 * @param score Story score
 * @returns Formatted score string (e.g., "1 point", "5 points")
 */
export const formatScore = (score: number): string => {
    return `${score} ${score === 1 ? 'point' : 'points'}`;
};

/**
 * Format comment count with proper pluralization
 * @param count Comment count
 * @returns Formatted comment string (e.g., "1 comment", "5 comments")
 */
export const formatCommentCount = (count: number): string => {
    if (count === 0) return 'no comments';
    return `${count} ${count === 1 ? 'comment' : 'comments'}`;
}; 