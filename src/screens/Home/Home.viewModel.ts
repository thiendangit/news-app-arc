import { StoryItemModel } from '@/models';
import { StoryType } from '@/services/storyService';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useI18n, useStory } from '@/hooks';
import { useTheme } from '@/theme';

const STORY_CATEGORIES = [
  { id: 'new', label: 'New', type: StoryType.NEW },
  { id: 'best', label: 'Best', type: StoryType.BEST },
  { id: 'top', label: 'Top', type: StoryType.TOP },
];

export const useHomeViewModel = () => {
  const { t } = useTranslation();

  const { useInfiniteStoriesQuery, useStoriesQuery } = useStory();

  const { toggleLanguage } = useI18n();

  const theme = useTheme();

  const [selectedCategory, setSelectedCategory] = useState<StoryType>(
    StoryType.NEW,
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [useInfiniteScroll, setUseInfiniteScroll] = useState(true);

  const infiniteStoriesQuery = useInfiniteStoriesQuery(selectedCategory, 10);
  const storiesQuery = useStoriesQuery(selectedCategory, currentPage, 10);

  const activeQuery = useInfiniteScroll ? infiniteStoriesQuery : storiesQuery;

  const stories: StoryItemModel[] = useInfiniteScroll
    ? (infiniteStoriesQuery.data?.pages.flat() ?? [])
    : (storiesQuery.data ?? []);

  const newsData = stories.map((story) => ({
    commentsCount: story.descendants,
    domain: story.domain,
    id: story.id,
    score: story.score,
    source: story.by,
    timeAgo: story.timeFormatted,
    title: story.title,
    type: story.typeLabel,
    url: story.url,
  }));

  const handleCategorySelect = (categoryId: string) => {
    const category = STORY_CATEGORIES.find((cat) => cat.id === categoryId);
    if (category && category.type !== selectedCategory) {
      setSelectedCategory(category.type);
      setCurrentPage(0);
    }
  };

  const handleRefresh = async () => {
    await (useInfiniteScroll ? infiniteStoriesQuery.refetch() : storiesQuery.refetch());
  };

  const handleResetError = () => {
    if (useInfiniteScroll) {
      infiniteStoriesQuery.refetch();
    } else {
      storiesQuery.refetch();
    }
  };

  const loadMore = async () => {
    if (
      useInfiniteScroll &&
      infiniteStoriesQuery.hasNextPage &&
      !infiniteStoriesQuery.isFetchingNextPage
    ) {
      await infiniteStoriesQuery.fetchNextPage();
    }
  };

  const loadNextPage = () => {
    if (!useInfiniteScroll && !storiesQuery.isLoading) {
      setCurrentPage((previous) => previous + 1);
    }
  };

  const loadPreviousPage = () => {
    if (!useInfiniteScroll && currentPage > 0 && !storiesQuery.isLoading) {
      setCurrentPage((previous) => previous - 1);
    }
  };

  return {
    handlers: {
      handleCategorySelect,
      handleRefresh,
      handleResetError,
      loadMore,
      loadNextPage,
      loadPrevPage: loadPreviousPage,
      setUseInfiniteScroll,
      toggleLanguage,
    },
    selectors: {
      currentPage,
      dataUpdatedAt: activeQuery.dataUpdatedAt,
      error: activeQuery.error,
      hasNextPage: infiniteStoriesQuery.hasNextPage,
      isError: activeQuery.isError,
      isFetching: activeQuery.isFetching,
      isFetchingNextPage: infiniteStoriesQuery.isFetchingNextPage,
      isLoadingNews: activeQuery.isLoading,
      isRefreshing: activeQuery.isRefetching,
      newsCategories: STORY_CATEGORIES,
      newsData,
      selectedCategory,
      t,
      theme,
      useInfiniteScroll,
    },
    tests: {
      activeQuery,
      infiniteStoriesQuery,
      stories,
      storiesQuery,
      STORY_CATEGORIES,
    },
  };
};
