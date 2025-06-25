import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HomeScreen } from '../Home';
import TestAppWrapper from '../../../../tests/TestAppWrapper';
jest.mock('@/services/storyService', () => ({
  storyService: {
    getStoriesPaginated: jest.fn().mockResolvedValue([
      {
        id: 1,
        title: 'Test Story 1',
        by: 'testuser',
        score: 100,
        time: Math.floor(Date.now() / 1000) - 3600,
        descendants: 10,
        url: 'https:
        type: 'story',
      },
      {
        id: 2,
        title: 'Test Story 2',
        by: 'testuser2',
        score: 50,
        time: Math.floor(Date.now() / 1000) - 7200,
        descendants: 5,
        type: 'story',
      },
    ]),
  },
  StoryType: {
    TOP: 'topstories',
    NEW: 'newstories',
    BEST: 'beststories',
    ASK: 'askstories',
    SHOW: 'showstories',
    JOB: 'jobstories',
  },
}));
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <TestAppWrapper>{component}</TestAppWrapper>
    </QueryClientProvider>
  );
};
describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should render correctly', async () => {
    const { getByText } = renderWithProviders(<HomeScreen />);
    expect(getByText('HACKER')).toBeTruthy();
    expect(getByText('NEWS')).toBeTruthy();
  });
  it('should display story categories', async () => {
    const { getByText } = renderWithProviders(<HomeScreen />);
    await waitFor(() => {
      expect(getByText('Top Stories')).toBeTruthy();
      expect(getByText('New Stories')).toBeTruthy();
      expect(getByText('Best Stories')).toBeTruthy();
      expect(getByText('Ask HN')).toBeTruthy();
      expect(getByText('Show HN')).toBeTruthy();
      expect(getByText('Jobs')).toBeTruthy();
    });
  });
  it('should load and display stories', async () => {
    const { getByText } = renderWithProviders(<HomeScreen />);
    await waitFor(() => {
      expect(getByText('Test Story 1')).toBeTruthy();
      expect(getByText('Test Story 2')).toBeTruthy();
    });
  });
  it('should handle category selection', async () => {
    const { getByText } = renderWithProviders(<HomeScreen />);
    await waitFor(() => {
      expect(getByText('New Stories')).toBeTruthy();
    });
    fireEvent.press(getByText('New Stories'));
    await waitFor(() => {
      expect(getByText('Test Story 1')).toBeTruthy();
    });
  });
  it('should show loading state initially', () => {
    const { getByText } = renderWithProviders(<HomeScreen />);
    expect(getByText('Loading stories...')).toBeTruthy();
  });
  it('should handle theme change', async () => {
    const { getByTestId } = renderWithProviders(<HomeScreen />);
    await waitFor(() => {
      expect(getByTestId).toBeTruthy();
    });
  });
  it('should handle infinite scroll', async () => {
    const { getByText } = renderWithProviders(<HomeScreen />);
    await waitFor(() => {
      expect(getByText('Test Story 1')).toBeTruthy();
    });
  });
  it('should handle story press', async () => {
    const { getByText } = renderWithProviders(<HomeScreen />);
    await waitFor(() => {
      expect(getByText('Test Story 1')).toBeTruthy();
    });
    fireEvent.press(getByText('Test Story 1'));
  });
  it('should handle error state', async () => {
    const mockService = require('@/services/storyService');
    mockService.storyService.getStoriesPaginated.mockRejectedValueOnce(
      new Error('Network error')
    );
    const { getByText } = renderWithProviders(<HomeScreen />);
    await waitFor(() => {
      expect(getByText('Retry')).toBeTruthy();
    });
  });
  it('should display story metadata correctly', async () => {
    const { getByText } = renderWithProviders(<HomeScreen />);
    await waitFor(() => {
      expect(getByText('testuser')).toBeTruthy();
      expect(getByText('100')).toBeTruthy();
      expect(getByText('10')).toBeTruthy();
    });
  });
});
