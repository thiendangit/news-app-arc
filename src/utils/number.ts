export const formatNumber = (number_: number): string => {
    return number_.toLocaleString();
};

export const formatCompactNumber = (number_: number): string => {
    if (number_ >= 1_000_000_000) {
        return `${(number_ / 1_000_000_000).toFixed(1)}B`;
    }
    if (number_ >= 1_000_000) {
        return `${(number_ / 1_000_000).toFixed(1)}M`;
    }
    if (number_ >= 1000) {
        return `${(number_ / 1000).toFixed(1)}K`;
    }
    return number_.toString();
};

export const formatScore = (score: number): string => {
    return `${score} ${score === 1 ? 'point' : 'points'}`;
};

export const formatCommentCount = (count: number): string => {
    if (count === 0) return 'no comments';
    return `${count} ${count === 1 ? 'comment' : 'comments'}`;
}; 