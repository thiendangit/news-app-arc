import { StoryItemModel } from '@/models';
import { PreviewData } from '@flyerhq/react-native-link-preview/lib/types';

export type CommentsListProps = {
    readonly comments: StoryItemModel[];
    readonly expandedComments: Set<number>;
    readonly hasMoreComments: boolean;
    readonly isLoading: boolean;
    readonly isLoadingMore: boolean;
    readonly loadingRepliesIds: Set<number>;
    readonly onLoadMore: () => void;
    readonly onToggleReplies: (comment: StoryItemModel) => void;
    readonly story?: StoryItemModel;
};

export type MetaInfoProps = {
    readonly story?: StoryItemModel;
    readonly isFloating?: boolean;
};

export type StoryContentProps = {
    readonly getEnhancedDescription: () => string | undefined;
    readonly onCopyLink: () => void;
    readonly onOpenURL: (url: string) => void;
    readonly onShare: () => void;
    readonly previewData?: PreviewData;
    readonly story?: StoryItemModel;
};

export type StoryDetailProps = {
    readonly navigation: any;
    readonly route: {
        readonly params: {
            readonly storyId: number;
        };
    };
};

export type StoryHeaderProps = {
    readonly getEnhancedTitle: () => string;
    readonly isLike: boolean;
    readonly onBack: () => void;
    readonly onLike: () => void;
    readonly showHeader: boolean;
};

export type StoryHeaderContentProps = {
    readonly story?: StoryItemModel;
    readonly previewData?: PreviewData;
    readonly getEnhancedTitle: () => string;
    readonly getStoryTypeText: (type?: string) => string;
    readonly onPreviewDataFetched: (data: PreviewData) => void;
}; 