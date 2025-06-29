/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable jest/no-conditional-expect */

import { act, renderHook } from '@testing-library/react-native';

import { Paths } from '@/navigation/paths';

import { useStartupViewModel } from '@/screens/Startup/Startup.viewModel';

// Mock dependencies
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: jest.fn((key) => key),
    }),
}));

jest.mock('@/theme', () => ({
    useTheme: () => ({
        colors: { primary: '#000' },
        fonts: { size: { large: 16 } },
    }),
}));

jest.mock('@tanstack/react-query', () => ({
    useQuery: jest.fn(),
}));

const mockNavigation = {
    goBack: jest.fn(),
    navigate: jest.fn(),
    reset: jest.fn(),
};

const mockNavigationProps = {
    navigation: mockNavigation,
    route: {
        key: 'startup-key',
        name: Paths.Startup as const,
        params: undefined,
    },
} as any;

describe('useStartupViewModel', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Initialization', () => {
        it('should initialize with theme and translation available', () => {
            // Given: useQuery returns loading state
            const { useQuery } = require('@tanstack/react-query');
            useQuery.mockReturnValue({
                isError: false,
                isFetching: true,
                isSuccess: false,
            });

            // When: Hook is rendered
            const { result } = renderHook(() => useStartupViewModel(mockNavigationProps));

            // Then: Should have correct initial values
            expect(result.current.selectors.theme).toBeDefined();
            expect(result.current.selectors.t).toBeDefined();
            expect(result.current.selectors.isFetching).toBe(true);
            expect(result.current.selectors.isError).toBe(false);
            expect(result.current.selectors.isSuccess).toBe(false);
        });
    });

    describe('Query States', () => {
        it('should reflect loading state when query is fetching', () => {
            // Given: useQuery returns fetching state
            const { useQuery } = require('@tanstack/react-query');
            useQuery.mockReturnValue({
                isError: false,
                isFetching: true,
                isSuccess: false,
            });

            // When: Hook is rendered
            const { result } = renderHook(() => useStartupViewModel(mockNavigationProps));

            // Then: Should show loading state
            expect(result.current.selectors.isFetching).toBe(true);
            expect(result.current.selectors.isError).toBe(false);
            expect(result.current.selectors.isSuccess).toBe(false);
        });

        it('should reflect error state when query fails', () => {
            // Given: useQuery returns error state
            const { useQuery } = require('@tanstack/react-query');
            useQuery.mockReturnValue({
                isError: true,
                isFetching: false,
                isSuccess: false,
            });

            // When: Hook is rendered
            const { result } = renderHook(() => useStartupViewModel(mockNavigationProps));

            // Then: Should show error state
            expect(result.current.selectors.isError).toBe(true);
            expect(result.current.selectors.isFetching).toBe(false);
            expect(result.current.selectors.isSuccess).toBe(false);
        });

        it('should reflect success state when query completes', () => {
            // Given: useQuery returns success state
            const { useQuery } = require('@tanstack/react-query');
            useQuery.mockReturnValue({
                isError: false,
                isFetching: false,
                isSuccess: true,
            });

            // When: Hook is rendered
            const { result } = renderHook(() => useStartupViewModel(mockNavigationProps));

            // Then: Should show success state
            expect(result.current.selectors.isSuccess).toBe(true);
            expect(result.current.selectors.isFetching).toBe(false);
            expect(result.current.selectors.isError).toBe(false);
        });
    });

    describe('Navigation on Success', () => {
        it('should navigate to Home when query succeeds', () => {
            // Given: useQuery initially returns loading state
            const { useQuery } = require('@tanstack/react-query');
            const mockQueryResponse = {
                isError: false,
                isFetching: false,
                isSuccess: false,
            };
            useQuery.mockReturnValue(mockQueryResponse);

            const { rerender } = renderHook(() => useStartupViewModel(mockNavigationProps));

            // When: Query succeeds
            mockQueryResponse.isSuccess = true;
            useQuery.mockReturnValue(mockQueryResponse);

            act(() => {
                rerender({});
            });

            // Then: Navigation should be called to reset and go to Home
            expect(mockNavigation.reset).toHaveBeenCalledWith({
                index: 0,
                routes: [{ name: Paths.Home }],
            });
        });

        it('should not navigate when query is still loading', () => {
            // Given: useQuery returns loading state
            const { useQuery } = require('@tanstack/react-query');
            useQuery.mockReturnValue({
                isError: false,
                isFetching: true,
                isSuccess: false,
            });

            // When: Hook is rendered
            renderHook(() => useStartupViewModel(mockNavigationProps));

            // Then: Navigation should not be called
            expect(mockNavigation.reset).not.toHaveBeenCalled();
        });

        it('should not navigate when query has error', () => {
            // Given: useQuery returns error state
            const { useQuery } = require('@tanstack/react-query');
            useQuery.mockReturnValue({
                isError: true,
                isFetching: false,
                isSuccess: false,
            });

            // When: Hook is rendered
            renderHook(() => useStartupViewModel(mockNavigationProps));

            // Then: Navigation should not be called
            expect(mockNavigation.reset).not.toHaveBeenCalled();
        });
    });

    describe('Query Configuration', () => {
        it('should configure query with correct key and function', () => {
            // Given: Clean state
            const { useQuery } = require('@tanstack/react-query');
            useQuery.mockReturnValue({
                isError: false,
                isFetching: false,
                isSuccess: false,
            });

            // When: Hook is rendered
            renderHook(() => useStartupViewModel(mockNavigationProps));

            // Then: useQuery should be called with correct configuration
            expect(useQuery).toHaveBeenCalledWith({
                queryFn: expect.any(Function),
                queryKey: ['startup'],
            });
        });

        it('should have queryFn that resolves to true', async () => {
            // Given: Clean state
            const { useQuery } = require('@tanstack/react-query');
            let capturedQueryFunction: (() => Promise<boolean>) | undefined;

            useQuery.mockImplementation(({ queryFn }: { queryFn: () => Promise<boolean> }) => {
                capturedQueryFunction = queryFn;
                return {
                    isError: false,
                    isFetching: false,
                    isSuccess: false,
                };
            });

            // When: Hook is rendered
            renderHook(() => useStartupViewModel(mockNavigationProps));

            // Then: queryFn should resolve to true
            expect(capturedQueryFunction).toBeDefined();
            if (capturedQueryFunction) {
                const result = await capturedQueryFunction();
                expect(result).toBe(true);
            }
        });
    });

    describe('Dependencies Integration', () => {
        it('should use translation function correctly', () => {
            // Given: useQuery returns any state
            const { useQuery } = require('@tanstack/react-query');
            useQuery.mockReturnValue({
                isError: false,
                isFetching: false,
                isSuccess: false,
            });

            // When: Hook is rendered
            const { result } = renderHook(() => useStartupViewModel(mockNavigationProps));

            // Then: Translation function should be available and callable
            expect(result.current.selectors.t).toBeDefined();
            expect(typeof result.current.selectors.t).toBe('function');

            const translatedText = result.current.selectors.t('test.key');
            expect(translatedText).toBe('test.key');
        });

        it('should use theme correctly', () => {
            // Given: useQuery returns any state
            const { useQuery } = require('@tanstack/react-query');
            useQuery.mockReturnValue({
                isError: false,
                isFetching: false,
                isSuccess: false,
            });

            // When: Hook is rendered
            const { result } = renderHook(() => useStartupViewModel(mockNavigationProps));

            // Then: Theme should be available with expected structure
            expect(result.current.selectors.theme).toBeDefined();
            expect(result.current.selectors.theme.colors).toBeDefined();
            expect(result.current.selectors.theme.fonts).toBeDefined();
        });
    });

    describe('Effect Dependencies', () => {
        it('should react to isSuccess changes', () => {
            // Given: useQuery initially returns loading state
            const { useQuery } = require('@tanstack/react-query');
            const mockQueryResponse = {
                isError: false,
                isFetching: false,
                isSuccess: false,
            };
            useQuery.mockReturnValue(mockQueryResponse);

            const { rerender } = renderHook(() => useStartupViewModel(mockNavigationProps));

            // When: isSuccess changes to true
            mockQueryResponse.isSuccess = true;
            useQuery.mockReturnValue(mockQueryResponse);

            act(() => {
                rerender({});
            });

            // Then: Navigation should be triggered
            expect(mockNavigation.reset).toHaveBeenCalledTimes(1);
        });

        it('should not navigate multiple times for same success state', () => {
            // Given: useQuery returns success state from start
            const { useQuery } = require('@tanstack/react-query');
            useQuery.mockReturnValue({
                isError: false,
                isFetching: false,
                isSuccess: true,
            });

            const { rerender } = renderHook(() => useStartupViewModel(mockNavigationProps));

            // When: Component rerenders with same success state
            act(() => {
                rerender({});
            });

            // Then: Navigation should only be called once
            expect(mockNavigation.reset).toHaveBeenCalledTimes(1);
        });
    });
}); 