/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable unicorn/no-null */
/* eslint-disable testing-library/no-unnecessary-act */

import { storyService } from '@/services';
import { act, renderHook } from '@testing-library/react-native';

import { useStoryDetailViewModel } from '@/screens/StoryDetail/StoryDetail.viewModel';

// Mock dependencies
jest.mock('@/hooks', () => ({
    useStory: jest.fn(),
}));

jest.mock('@/services', () => ({
    storyService: {
        getComments: jest.fn(),
    },
}));

const mockStoryQuery = {
    data: undefined,
    error: null,
    isError: false,
    isFetching: false,
    isLoading: false,
    isRefetching: false,
    refetch: jest.fn(),
};

const mockStory = {
    by: 'testuser',
    comments: [
        {
            by: 'commenter1',
            id: 101,
            kids: [201, 202],
            parent: 1,
            text: 'First comment',
            time: 1_234_567_891,
        } as any,
        {
            by: 'commenter2',
            id: 102,
            kids: [],
            parent: 1,
            text: 'Second comment',
            time: 1_234_567_892,
        } as any,
    ],
    descendants: 5,
    id: 1,
    kids: [101, 102, 103, 104, 105],
    score: 100,
    text: 'This is a test story',
    time: 1_234_567_890,
    title: 'Test Story',
    url: 'https://example.com',
} as any;

const mockComments = [
    {
        by: 'replier1',
        id: 201,
        kids: [],
        parent: 101,
        text: 'Reply to first comment',
        time: 1_234_567_893,
    } as any,
    {
        by: 'replier2',
        id: 202,
        kids: [],
        parent: 101,
        text: 'Another reply',
        time: 1_234_567_894,
    } as any,
] as any;

describe('useStoryDetailViewModel', () => {
    let cleanup: any;

    beforeEach(() => {
        jest.clearAllMocks();
        cleanup = null;
        const { useStory } = require('@/hooks');
        useStory.mockReturnValue({
            useStoryWithCommentsQuery: jest.fn(() => mockStoryQuery),
        });
    });

    afterEach(() => {
        if (cleanup) {
            cleanup();
        }
    });

    describe('Initialization', () => {
        it('should initialize with default values when no initial story provided', () => {
            // Given: No initial story provided
            // When: Hook is rendered
            const { result } = renderHook(() => useStoryDetailViewModel(1));

            // Then: Should have correct initial values
            expect(result.current.selectors.story).toBeUndefined();
            expect(result.current.selectors.comments).toEqual([]);
            expect(result.current.selectors.commentsToShow).toBe(10);
            expect(result.current.selectors.isLoading).toBe(false);
            expect(result.current.selectors.isError).toBe(false);
            expect(result.current.selectors.hasMoreComments).toBe(false);
        });

        it('should initialize with initial story when provided', () => {
            // Given: Initial story is provided
            // When: Hook is rendered with initial story
            const { result } = renderHook(() => useStoryDetailViewModel(1, mockStory));

            // Then: Should use initial story
            expect(result.current.selectors.story).toEqual(mockStory);
        });

        it('should use story from query when available', () => {
            // Given: Query returns story data
            const { useStory } = require('@/hooks');
            useStory.mockReturnValue({
                useStoryWithCommentsQuery: jest.fn(() => ({
                    ...mockStoryQuery,
                    data: mockStory,
                })),
            });

            // When: Hook is rendered
            const { result } = renderHook(() => useStoryDetailViewModel(1));

            // Then: Should use story from query
            expect(result.current.selectors.story).toEqual(mockStory);
        });

        it('should prefer query data over initial story', () => {
            // Given: Both initial story and query data exist
            const initialStory = { ...mockStory, title: 'Initial Story' };
            const queryStory = { ...mockStory, title: 'Query Story' };

            const { useStory } = require('@/hooks');
            useStory.mockReturnValue({
                useStoryWithCommentsQuery: jest.fn(() => ({
                    ...mockStoryQuery,
                    data: queryStory,
                })),
            });

            // When: Hook is rendered with initial story
            const { result } = renderHook(() => useStoryDetailViewModel(1, initialStory));

            // Then: Should prefer query data
            expect(result.current.selectors.story?.title).toBe('Query Story');
        });
    });

    describe('Comments Management', () => {
        it('should update displayed comments when query data changes', () => {
            // Given: Query initially has no comments
            const { useStory } = require('@/hooks');
            const mockQueryWithComments = {
                ...mockStoryQuery,
                data: mockStory,
            };
            useStory.mockReturnValue({
                useStoryWithCommentsQuery: jest.fn(() => mockQueryWithComments),
            });

            // When: Hook is rendered
            const { result } = renderHook(() => useStoryDetailViewModel(1));

            // Then: Should display comments from query
            expect(result.current.selectors.comments).toEqual(mockStory.comments);
        });

        it('should calculate hasMoreComments correctly when story has more kids than commentsToShow', () => {
            // Given: Story has 5 kids but only showing 3 comments
            const storyWithManyKids = {
                ...mockStory,
                kids: [101, 102, 103, 104, 105],
            };
            const { useStory } = require('@/hooks');
            useStory.mockReturnValue({
                useStoryWithCommentsQuery: jest.fn(() => ({
                    ...mockStoryQuery,
                    data: storyWithManyKids,
                })),
            });

            const { result } = renderHook(() => useStoryDetailViewModel(1));

            // When: commentsToShow is less than kids length
            act(() => {
                result.current.tests.setCommentsToShow(3);
            });

            // Then: Should have more comments
            expect(result.current.selectors.hasMoreComments).toBe(true);
        });

        it('should calculate hasMoreComments correctly when all comments are shown', () => {
            // Given: Story has 5 kids and showing all 5 comments
            const { useStory } = require('@/hooks');
            useStory.mockReturnValue({
                useStoryWithCommentsQuery: jest.fn(() => ({
                    ...mockStoryQuery,
                    data: mockStory,
                })),
            });

            const { result } = renderHook(() => useStoryDetailViewModel(1));

            // When: commentsToShow equals kids length
            act(() => {
                result.current.tests.setCommentsToShow(5);
            });

            // Then: Should not have more comments
            expect(result.current.selectors.hasMoreComments).toBe(false);
        });
    });

    describe('Load More Comments', () => {
        it('should load more comments when loadMoreComments is called', () => {
            // Given: Story has more comments than currently shown
            const storyWithManyKids = {
                ...mockStory,
                kids: Array.from({ length: 25 }, (_, index) => 101 + index), // 25 kids
            };

            const { useStory } = require('@/hooks');
            useStory.mockReturnValue({
                useStoryWithCommentsQuery: jest.fn(() => ({
                    ...mockStoryQuery,
                    data: storyWithManyKids,
                    isFetching: false,
                })),
            });

            const { result, unmount } = renderHook(() => useStoryDetailViewModel(1));
            cleanup = unmount;

            // When: loadMoreComments is called
            act(() => {
                result.current.handlers.loadMoreComments();
            });

            // Then: Should increase commentsToShow and set loading state
            expect(result.current.selectors.commentsToShow).toBe(20); // Min(10 + 10, 25) = 20
            expect(result.current.selectors.isLoadingMore).toBe(true);
        });

        it('should not load more when already at maximum comments', () => {
            // Given: All comments are already shown
            const { useStory } = require('@/hooks');
            useStory.mockReturnValue({
                useStoryWithCommentsQuery: jest.fn(() => ({
                    ...mockStoryQuery,
                    data: { ...mockStory, kids: [101, 102] }, // Only 2 kids
                    isFetching: false,
                })),
            });

            const { result } = renderHook(() => useStoryDetailViewModel(1));

            // When: loadMoreComments is called
            act(() => {
                result.current.handlers.loadMoreComments();
            });

            // Then: Should not change commentsToShow or loading state
            expect(result.current.selectors.commentsToShow).toBe(10);
            expect(result.current.selectors.isLoadingMore).toBe(false);
        });

        it('should not load more when already loading', () => {
            // Given: Query is currently fetching
            const { useStory } = require('@/hooks');
            useStory.mockReturnValue({
                useStoryWithCommentsQuery: jest.fn(() => ({
                    ...mockStoryQuery,
                    data: mockStory,
                    isFetching: true,
                })),
            });

            const { result } = renderHook(() => useStoryDetailViewModel(1));

            // When: loadMoreComments is called while fetching
            act(() => {
                result.current.handlers.loadMoreComments();
            });

            // Then: Should not change commentsToShow
            expect(result.current.selectors.commentsToShow).toBe(10);
        });

        it('should not load more when isLoadingMoreComments is true', () => {
            // Given: Already loading more comments
            const { useStory } = require('@/hooks');
            useStory.mockReturnValue({
                useStoryWithCommentsQuery: jest.fn(() => ({
                    ...mockStoryQuery,
                    data: mockStory,
                    isFetching: false,
                })),
            });

            const { result } = renderHook(() => useStoryDetailViewModel(1));

            // Set loading state
            act(() => {
                result.current.tests.setIsLoadingMoreComments(true);
            });

            // When: loadMoreComments is called while already loading
            act(() => {
                result.current.handlers.loadMoreComments();
            });

            // Then: Should not change commentsToShow
            expect(result.current.selectors.commentsToShow).toBe(10);
        });

        it('should reset loading state when query finishes loading', () => {
            // Given: Initially loading
            const { useStory } = require('@/hooks');
            const mockQueryLoading = {
                ...mockStoryQuery,
                isFetching: true,
                isLoading: true,
            };
            useStory.mockReturnValue({
                useStoryWithCommentsQuery: jest.fn(() => mockQueryLoading),
            });

            const { rerender, result } = renderHook(() => useStoryDetailViewModel(1));

            // Set loading more state
            act(() => {
                result.current.tests.setIsLoadingMoreComments(true);
            });

            // When: Query finishes loading
            mockQueryLoading.isLoading = false;
            mockQueryLoading.isFetching = false;

            act(() => {
                rerender({});
            });

            // Then: Should reset loading more state
            expect(result.current.selectors.isLoadingMore).toBe(false);
        });
    });

    describe('Fetch Replies', () => {
        it('should fetch replies for a comment successfully', async () => {
            // Given: storyService.getComments resolves with replies
            (storyService.getComments as jest.Mock).mockResolvedValue(mockComments);

            const { result } = renderHook(() => useStoryDetailViewModel(1));

            // When: fetchReplies is called
            await act(async () => {
                await result.current.handlers.fetchReplies(101, [201, 202]);
            });

            // Then: Should call storyService.getComments and update comments
            expect(storyService.getComments).toHaveBeenCalledWith([201, 202]);
            expect(result.current.selectors.comments).toEqual(mockComments);
            expect(result.current.selectors.loadingRepliesIds.has(101)).toBe(false);
        });

        it('should handle fetchReplies with empty reply IDs', async () => {
            // Given: Empty reply IDs array
            const { result } = renderHook(() => useStoryDetailViewModel(1));

            // When: fetchReplies is called with empty array
            await act(async () => {
                await result.current.handlers.fetchReplies(101, []);
            });

            // Then: Should not call storyService.getComments
            expect(storyService.getComments).not.toHaveBeenCalled();
        });

        it('should handle fetchReplies error gracefully', async () => {
            // Given: storyService.getComments rejects
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
            (storyService.getComments as jest.Mock).mockRejectedValue(new Error('Network error'));

            const { result } = renderHook(() => useStoryDetailViewModel(1));

            // When: fetchReplies is called and fails
            await act(async () => {
                await result.current.handlers.fetchReplies(101, [201, 202]);
            });

            // Then: Should log error and clear loading state
            expect(console.error).toHaveBeenCalledWith('Failed to fetch replies:', expect.any(Error));
            expect(result.current.selectors.loadingRepliesIds.has(101)).toBe(false);

            consoleErrorSpy.mockRestore();
        });

        it('should set and clear loading state for replies', async () => {
            // Given: storyService.getComments resolves immediately
            (storyService.getComments as jest.Mock).mockResolvedValue(mockComments);

            const { result, unmount } = renderHook(() => useStoryDetailViewModel(1));
            cleanup = unmount;

            // When: fetchReplies is called
            await act(async () => {
                await result.current.handlers.fetchReplies(101, [201, 202]);
            });

            // Then: Should clear loading state after completion
            expect(result.current.selectors.loadingRepliesIds.has(101)).toBe(false);
        });

        it('should not add duplicate comments when fetching replies', async () => {
            // Given: Some comments already exist and storyService returns overlapping data
            (storyService.getComments as jest.Mock).mockResolvedValue([
                mockComments[0], // Duplicate
                { ...mockComments[1], id: 203 }, // New comment
            ]);

            const { result, unmount } = renderHook(() => useStoryDetailViewModel(1));
            cleanup = unmount;

            // Set initial comments
            act(() => {
                result.current.tests.setDisplayedComments([mockComments[0]]);
            });

            // When: fetchReplies is called with overlapping data
            await act(async () => {
                await result.current.handlers.fetchReplies(101, [201, 203]);
            });

            // Then: Should only add new comments, not duplicates
            expect(result.current.selectors.comments).toHaveLength(2);
            expect(result.current.selectors.comments.find(c => c.id === 203)).toBeDefined();
        });
    });

    describe('Refresh Functionality', () => {
        it('should call refetch when handleRefresh is called', async () => {
            // Given: Hook is initialized
            const { result, unmount } = renderHook(() => useStoryDetailViewModel(1));
            cleanup = unmount;

            // When: handleRefresh is called
            await act(async () => {
                await result.current.handlers.handleRefresh();
            });

            // Then: Should call refetch
            expect(mockStoryQuery.refetch).toHaveBeenCalled();
        });
    });

    describe('Error Handling', () => {
        it('should call refetch when handleResetError is called', () => {
            // Given: Hook is initialized
            const { result, unmount } = renderHook(() => useStoryDetailViewModel(1));
            cleanup = unmount;

            // When: handleResetError is called
            act(() => {
                result.current.handlers.handleResetError();
            });

            // Then: Should call refetch
            expect(mockStoryQuery.refetch).toHaveBeenCalled();
        });

        it('should reflect error state from query', () => {
            // Given: Query has error
            const { useStory } = require('@/hooks');
            useStory.mockReturnValue({
                useStoryWithCommentsQuery: jest.fn(() => ({
                    ...mockStoryQuery,
                    error: new Error('Something went wrong'),
                    isError: true,
                })),
            });

            // When: Hook is rendered
            const { result, unmount } = renderHook(() => useStoryDetailViewModel(1));
            cleanup = unmount;

            // Then: Should reflect error state
            expect(result.current.selectors.isError).toBe(true);
            expect(result.current.selectors.error).toEqual(new Error('Something went wrong'));
        });
    });

    describe('Query Integration', () => {
        it('should call useStoryWithCommentsQuery with correct parameters', () => {
            // Given: Hook needs to be rendered
            const { useStory } = require('@/hooks');
            const mockUseStoryWithCommentsQuery = jest.fn(() => mockStoryQuery);
            useStory.mockReturnValue({
                useStoryWithCommentsQuery: mockUseStoryWithCommentsQuery,
            });

            // When: Hook is rendered
            const { unmount } = renderHook(() => useStoryDetailViewModel(123));
            cleanup = unmount;

            // Then: Should call useStoryWithCommentsQuery with correct parameters
            expect(mockUseStoryWithCommentsQuery).toHaveBeenCalledWith(123, 10);
        });

        it('should reflect loading state from query', () => {
            // Given: Query is loading
            const { useStory } = require('@/hooks');
            useStory.mockReturnValue({
                useStoryWithCommentsQuery: jest.fn(() => ({
                    ...mockStoryQuery,
                    isLoading: true,
                })),
            });

            // When: Hook is rendered
            const { result, unmount } = renderHook(() => useStoryDetailViewModel(1));
            cleanup = unmount;

            // Then: Should reflect loading state
            expect(result.current.selectors.isLoading).toBe(true);
        });

        it('should reflect refreshing state from query', () => {
            // Given: Query is refreshing
            const { useStory } = require('@/hooks');
            useStory.mockReturnValue({
                useStoryWithCommentsQuery: jest.fn(() => ({
                    ...mockStoryQuery,
                    isRefetching: true,
                })),
            });

            // When: Hook is rendered
            const { result, unmount } = renderHook(() => useStoryDetailViewModel(1));
            cleanup = unmount;

            // Then: Should reflect refreshing state
            expect(result.current.selectors.isRefreshing).toBe(true);
        });
    });
}); 