import { StoryItemModel } from '@/models';
import { StoryType } from '@/services/storyService';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useI18n, useStory } from '@/hooks';
import { useTheme } from '@/theme';

// Story categories mapping to Story API
const STORY_CATEGORIES = [
  { id: 'new', label: 'New', type: StoryType.NEW },
  { id: 'best', label: 'Best', type: StoryType.BEST },
  { id: 'top', label: 'Top', type: StoryType.TOP },
];

export const useExampleViewModel = () => {
  const { t } = useTranslation();
  const { useInfiniteStoriesQuery, useStoriesQuery } = useStory();
  const { toggleLanguage } = useI18n();
  const theme = useTheme();
  const queryClient = useQueryClient();

  const [selectedCategory, setSelectedCategory] = useState<StoryType>(
    StoryType.NEW,
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [useInfiniteScroll, setUseInfiniteScroll] = useState(true);

  // Get stories using infinite query for better UX - reduced page size for faster loading
  const infiniteStoriesQuery = useInfiniteStoriesQuery(selectedCategory, 10);

  // Fallback to regular pagination if needed - reduced page size for faster loading
  const storiesQuery = useStoriesQuery(selectedCategory, currentPage, 10);

  // Choose between infinite scroll or pagination
  const activeQuery = useInfiniteScroll ? infiniteStoriesQuery : storiesQuery;

  // Get flattened data for infinite scroll
  const stories: StoryItemModel[] = useInfiniteScroll
    ? (infiniteStoriesQuery.data?.pages.flat() ?? [])
    : (storiesQuery.data ?? []);

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    const category = STORY_CATEGORIES.find((cat) => cat.id === categoryId);
    if (category) {
      setSelectedCategory(category.type);
      setCurrentPage(0);

      // Reset infinite query when changing category
      if (useInfiniteScroll) {
        queryClient.removeQueries({
          queryKey: ['infinite-stories', category.type],
        });
      }
    }
  };

  // Load more stories (for infinite scroll)
  const loadMore = async () => {
    if (
      useInfiniteScroll &&
      infiniteStoriesQuery.hasNextPage &&
      !infiniteStoriesQuery.isFetchingNextPage
    ) {
      await infiniteStoriesQuery.fetchNextPage();
    }
  };

  // Load next page (for pagination)
  const loadNextPage = () => {
    if (!useInfiniteScroll && !storiesQuery.isLoading) {
      setCurrentPage((previous) => previous + 1);
    }
  };

  // Load previous page (for pagination)
  const loadPreviousPage = () => {
    if (!useInfiniteScroll && currentPage > 0 && !storiesQuery.isLoading) {
      setCurrentPage((previous) => previous - 1);
    }
  };

  const onChangeTheme = () => {
    theme.changeTheme(theme.variant === 'default' ? 'dark' : 'default');
  };

  const handleResetError = () => {
    if (useInfiniteScroll) {
      infiniteStoriesQuery.refetch();
    } else {
      storiesQuery.refetch();
    }
  };

  // Convert stories to display format using model methods
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

  return {
    // State
    currentPage,
    error: activeQuery.error,
    isError: activeQuery.isError,
    isLoadingNews: activeQuery.isLoading,
    newsCategories: STORY_CATEGORIES,
    newsData,
    selectedCategory,
    useInfiniteScroll,

    // Infinite scroll specific
    hasNextPage: infiniteStoriesQuery.hasNextPage,
    isFetchingNextPage: infiniteStoriesQuery.isFetchingNextPage,

    // Actions
    handleCategorySelect,
    handleResetError,
    loadMore,
    loadNextPage,
    loadPrevPage: loadPreviousPage,
    onChangeTheme,
    setUseInfiniteScroll,
    toggleLanguage,

    // Theme & Translations
    t,
    theme,
  };
};
