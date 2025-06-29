/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable testing-library/no-render-in-lifecycle */
import { StoryType } from '@/services/storyService';
import { act, renderHook } from '@testing-library/react-native';

import { useHomeViewModel } from '@/screens/Home/Home.viewModel';

// Mock dependencies
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: jest.fn((key) => key),
    }),
}));

// Mock i18next initialization
jest.mock('@/translations', () => ({
    i18n: {
        init: jest.fn(),
        use: jest.fn().mockReturnThis(),
    },
}));

jest.mock('@/hooks', () => ({
    useI18n: jest.fn(),
    useStory: jest.fn(),
}));

jest.mock('@/theme', () => ({
    useTheme: () => ({
        colors: { primary: '#000' },
        fonts: { size: { large: 16 } },
    }),
}));

const mockInfiniteQuery = {
    data: { pages: [[{ by: 'user', descendants: 5, id: 1, score: 100, title: 'Test Story' }]] },
    dataUpdatedAt: Date.now(),
    error: undefined,
    fetchNextPage: jest.fn(),
    hasNextPage: true,
    isError: false,
    isFetching: false,
    isFetchingNextPage: false,
    isLoading: false,
    isRefetching: false,
    refetch: jest.fn(),
};

const mockStoriesQuery = {
    data: [{ by: 'user', descendants: 5, id: 1, score: 100, title: 'Test Story' }],
    dataUpdatedAt: Date.now(),
    error: undefined,
    isError: false,
    isFetching: false,
    isLoading: false,
    isRefetching: false,
    refetch: jest.fn(),
};

describe('useHomeViewModel', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        const { useI18n, useStory } = require('@/hooks');

        useI18n.mockReturnValue({
            toggleLanguage: jest.fn(),
        });

        useStory.mockReturnValue({
            useInfiniteStoriesQuery: jest.fn(() => mockInfiniteQuery),
            useStoriesQuery: jest.fn(() => mockStoriesQuery),
        });
    });

    describe('Initialization', () => {
        it('should initialize with default values', () => {
            // Given: Clean state
            // When: Hook is rendered
            const { result } = renderHook(() => useHomeViewModel());

            // Then: Should have correct initial values
            expect(result.current.selectors.selectedCategory).toBe(StoryType.NEW);
            expect(result.current.selectors.currentPage).toBe(0);
            expect(result.current.selectors.useInfiniteScroll).toBe(true);
            expect(result.current.selectors.newsCategories).toHaveLength(3);
        });

        it('should return correct news data structure', () => {
            // Given: Mock story data exists
            // When: Hook is rendered
            const { result } = renderHook(() => useHomeViewModel());

            // Then: Should transform data correctly
            expect(result.current.selectors.newsData).toEqual([
                {
                    commentsCount: 5,
                    domain: undefined,
                    id: 1,
                    score: 100,
                    source: 'user',
                    timeAgo: undefined,
                    title: 'Test Story',
                    type: undefined,
                    url: undefined,
                },
            ]);
        });
    });

    describe('Category Selection', () => {
        it('should change category when valid category is selected', () => {
            // Given: Hook is initialized
            const { result } = renderHook(() => useHomeViewModel());

            // When: Category is changed to 'best'
            act(() => {
                result.current.handlers.handleCategorySelect('best');
            });

            // Then: Selected category should be updated and page reset
            expect(result.current.selectors.selectedCategory).toBe(StoryType.BEST);
            expect(result.current.selectors.currentPage).toBe(0);
        });

        it('should not change category when invalid category is selected', () => {
            // Given: Hook is initialized
            const { result } = renderHook(() => useHomeViewModel());
            const initialCategory = result.current.selectors.selectedCategory;

            // When: Invalid category is selected
            act(() => {
                result.current.handlers.handleCategorySelect('invalid');
            });

            // Then: Category should remain unchanged
            expect(result.current.selectors.selectedCategory).toBe(initialCategory);
        });

        it('should not change category when same category is selected', () => {
            // Given: Hook is initialized with NEW category
            const { result } = renderHook(() => useHomeViewModel());

            // When: Same category 'new' is selected again
            act(() => {
                result.current.handlers.handleCategorySelect('new');
            });

            // Then: Category should remain unchanged
            expect(result.current.selectors.selectedCategory).toBe(StoryType.NEW);
        });
    });

    describe('Infinite Scroll Mode', () => {
        it('should load more data when loadMore is called', async () => {
            // Given: Infinite scroll mode is enabled and has next page
            const { result } = renderHook(() => useHomeViewModel());

            // When: loadMore is called
            await act(async () => {
                await result.current.handlers.loadMore();
            });

            // Then: fetchNextPage should be called
            expect(mockInfiniteQuery.fetchNextPage).toHaveBeenCalled();
        });

        it('should not load more when already fetching next page', async () => {
            // Given: Already fetching next page
            const mockInfiniteQueryFetching = {
                ...mockInfiniteQuery,
                isFetchingNextPage: true,
            };

            const { useStory } = require('@/hooks');

            useStory.mockReturnValue({
                useInfiniteStoriesQuery: jest.fn(() => mockInfiniteQueryFetching),
                useStoriesQuery: jest.fn(() => mockStoriesQuery),
            });

            const { result } = renderHook(() => useHomeViewModel());

            // When: loadMore is called
            await act(async () => {
                await result.current.handlers.loadMore();
            });

            // Then: fetchNextPage should not be called
            expect(mockInfiniteQueryFetching.fetchNextPage).not.toHaveBeenCalled();
        });

        it('should not load more when no next page available', async () => {
            // Given: No next page available
            const mockInfiniteQueryNoNext = {
                ...mockInfiniteQuery,
                hasNextPage: false,
            };
            const { useStory } = require('@/hooks');
            useStory.mockReturnValue({
                useInfiniteStoriesQuery: jest.fn(() => mockInfiniteQueryNoNext),
                useStoriesQuery: jest.fn(() => mockStoriesQuery),
            });

            const { result } = renderHook(() => useHomeViewModel());

            // When: loadMore is called
            await act(async () => {
                await result.current.handlers.loadMore();
            });

            // Then: fetchNextPage should not be called
            expect(mockInfiniteQueryNoNext.fetchNextPage).not.toHaveBeenCalled();
        });
    });

    describe('Pagination Mode', () => {
        beforeEach(() => {
            // Switch to pagination mode for these tests
            const { result } = renderHook(() => useHomeViewModel());
            act(() => {
                result.current.handlers.setUseInfiniteScroll(false);
            });
        });

        it('should load next page when loadNextPage is called', () => {
            // Given: Pagination mode is enabled and not loading
            const { result } = renderHook(() => useHomeViewModel());
            act(() => {
                result.current.handlers.setUseInfiniteScroll(false);
            });

            // When: loadNextPage is called
            act(() => {
                result.current.handlers.loadNextPage();
            });

            // Then: Current page should be incremented
            expect(result.current.selectors.currentPage).toBe(1);
        });

        it('should load previous page when loadPrevPage is called', () => {
            // Given: Current page is greater than 0
            const { result } = renderHook(() => useHomeViewModel());
            act(() => {
                result.current.handlers.setUseInfiniteScroll(false);
                result.current.handlers.loadNextPage();
            });

            // When: loadPrevPage is called
            act(() => {
                result.current.handlers.loadPrevPage();
            });

            // Then: Current page should be decremented
            expect(result.current.selectors.currentPage).toBe(0);
        });

        it('should not load previous page when current page is 0', () => {
            // Given: Current page is 0
            const { result } = renderHook(() => useHomeViewModel());
            act(() => {
                result.current.handlers.setUseInfiniteScroll(false);
            });

            // When: loadPrevPage is called
            act(() => {
                result.current.handlers.loadPrevPage();
            });

            // Then: Current page should remain 0
            expect(result.current.selectors.currentPage).toBe(0);
        });

        it('should not load next page when loading', () => {
            // Given: Stories query is loading
            const mockStoriesQueryLoading = {
                ...mockStoriesQuery,
                isLoading: true,
            };
            const { useStory } = require('@/hooks');
            useStory.mockReturnValue({
                useInfiniteStoriesQuery: jest.fn(() => mockInfiniteQuery),
                useStoriesQuery: jest.fn(() => mockStoriesQueryLoading),
            });

            const { result } = renderHook(() => useHomeViewModel());
            act(() => {
                result.current.handlers.setUseInfiniteScroll(false);
            });

            // When: loadNextPage is called while loading
            act(() => {
                result.current.handlers.loadNextPage();
            });

            // Then: Current page should remain 0
            expect(result.current.selectors.currentPage).toBe(0);
        });
    });

    describe('Refresh Functionality', () => {
        it('should call refetch when handleRefresh is called in infinite scroll mode', async () => {
            // Given: Infinite scroll mode is enabled
            const { result } = renderHook(() => useHomeViewModel());

            // When: handleRefresh is called
            await act(async () => {
                await result.current.handlers.handleRefresh();
            });

            // Then: Infinite query refetch should be called
            expect(mockInfiniteQuery.refetch).toHaveBeenCalled();
        });

        it('should call refetch when handleRefresh is called in pagination mode', async () => {
            // Given: Pagination mode is enabled
            const { result } = renderHook(() => useHomeViewModel());
            act(() => {
                result.current.handlers.setUseInfiniteScroll(false);
            });

            // When: handleRefresh is called
            await act(async () => {
                await result.current.handlers.handleRefresh();
            });

            // Then: Stories query refetch should be called
            expect(mockStoriesQuery.refetch).toHaveBeenCalled();
        });
    });

    describe('Error Handling', () => {
        it('should handle error reset in infinite scroll mode', () => {
            // Given: Infinite scroll mode is enabled
            const { result } = renderHook(() => useHomeViewModel());

            // When: handleResetError is called
            act(() => {
                result.current.handlers.handleResetError();
            });

            // Then: Infinite query refetch should be called
            expect(mockInfiniteQuery.refetch).toHaveBeenCalled();
        });

        it('should handle error reset in pagination mode', () => {
            // Given: Pagination mode is enabled
            const { result } = renderHook(() => useHomeViewModel());
            act(() => {
                result.current.handlers.setUseInfiniteScroll(false);
            });

            // When: handleResetError is called
            act(() => {
                result.current.handlers.handleResetError();
            });

            // Then: Stories query refetch should be called
            expect(mockStoriesQuery.refetch).toHaveBeenCalled();
        });
    });

    describe('Language Toggle', () => {
        it('should call toggleLanguage when toggleLanguage handler is called', () => {
            // Given: Hook is initialized
            const mockToggleLanguage = jest.fn();
            const { useI18n } = require('@/hooks');
            useI18n.mockReturnValue({
                toggleLanguage: mockToggleLanguage,
            });

            const { result } = renderHook(() => useHomeViewModel());

            // When: toggleLanguage is called
            act(() => {
                result.current.handlers.toggleLanguage();
            });

            // Then: toggleLanguage should be called
            expect(mockToggleLanguage).toHaveBeenCalled();
        });
    });
});
