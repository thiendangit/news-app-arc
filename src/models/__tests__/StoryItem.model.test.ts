import { StoryItemModel } from '../StoryItem.model';

describe('StoryItemModel', () => {
    const mockStoryData = {
        id: 123,
        by: 'testuser',
        title: 'Test Story',
        url: 'https://example.com',
        score: 150,
        time: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
        descendants: 25,
        type: 'story' as const,
        kids: [124, 125, 126],
    };

    describe('instantiate', () => {
        it('should create model from valid data', () => {
            const model = StoryItemModel.instantiate(mockStoryData);

            expect(model).toBeInstanceOf(StoryItemModel);
            expect(model.id).toBe(123);
            expect(model.by).toBe('testuser');
            expect(model.title).toBe('Test Story');
            expect(model.url).toBe('https://example.com');
            expect(model.score).toBe(150);
        });

        it('should handle missing optional fields', () => {
            const minimalData = { id: 456 };
            const model = StoryItemModel.instantiate(minimalData);

            expect(model.id).toBe(456);
            expect(model.by).toBe('Anonymous');
            expect(model.title).toBe('No title');
            expect(model.score).toBe(0);
        });

        it('should throw error for invalid data', () => {
            expect(() => {
                StoryItemModel.instantiate({ invalid: 'data' });
            }).toThrow();
        });
    });

    describe('safeInstantiate', () => {
        it('should return null for invalid data', () => {
            const result = StoryItemModel.safeInstantiate({ invalid: 'data' });
            expect(result).toBeNull();
        });

        it('should return model for valid data', () => {
            const result = StoryItemModel.safeInstantiate(mockStoryData);
            expect(result).toBeInstanceOf(StoryItemModel);
        });
    });

    describe('computed properties', () => {
        let model: StoryItemModel;

        beforeEach(() => {
            model = StoryItemModel.instantiate(mockStoryData);
        });

        it('should calculate timeFormatted correctly', () => {
            expect(model.timeFormatted).toContain('h ago');
        });

        it('should calculate domain correctly', () => {
            expect(model.domain).toBe('example.com');
        });

        it('should calculate typeLabel correctly', () => {
            expect(model.typeLabel).toBe('story');
        });

        it('should detect external URL', () => {
            expect(model.hasExternalUrl).toBe(true);
        });
    });

    describe('utility methods', () => {
        let model: StoryItemModel;

        beforeEach(() => {
            model = StoryItemModel.instantiate({
                ...mockStoryData,
                text: '<p>This is a <b>test</b> story</p>',
            });
        });

        it('should clean HTML tags', () => {
            const cleanText = model.getCleanText();
            expect(cleanText).toBe('This is a test story');
        });

        it('should identify story type correctly', () => {
            expect(model.isStory()).toBe(true);
            expect(model.isComment()).toBe(false);
            expect(model.isJob()).toBe(false);
        });

        it('should calculate reading time', () => {
            const readingTime = model.getReadingTime();
            expect(readingTime).toBeGreaterThan(0);
        });
    });

    describe('Ask HN detection', () => {
        it('should detect Ask HN posts', () => {
            const askHNData = {
                id: 789,
                title: 'Ask HN: How do you learn new technologies?',
                type: 'story' as const,
                // No URL for Ask HN posts
            };

            const model = StoryItemModel.instantiate(askHNData);
            expect(model.typeLabel).toBe('ask');
        });
    });

    describe('Show HN detection', () => {
        it('should detect Show HN posts', () => {
            const showHNData = {
                id: 999,
                title: 'Show HN: My awesome project',
                type: 'story' as const,
                url: 'https://myproject.com',
            };

            const model = StoryItemModel.instantiate(showHNData);
            expect(model.typeLabel).toBe('show');
        });
    });

    describe('Job posts', () => {
        it('should detect job posts', () => {
            const jobData = {
                id: 111,
                title: 'Software Engineer at ACME Corp',
                type: 'job' as const,
            };

            const model = StoryItemModel.instantiate(jobData);
            expect(model.typeLabel).toBe('job');
            expect(model.isJob()).toBe(true);
        });
    });

    describe('list operations', () => {
        it('should instantiate list correctly', () => {
            const dataList = [mockStoryData, { id: 456, title: 'Story 2' }];
            const models = StoryItemModel.instantiateList(dataList);

            expect(models).toHaveLength(2);
            expect(models[0]).toBeInstanceOf(StoryItemModel);
            expect(models[1]).toBeInstanceOf(StoryItemModel);
        });

        it('should safely instantiate list with invalid items', () => {
            const dataList = [mockStoryData, { invalid: 'data' }, { id: 456 }];
            const models = StoryItemModel.safeInstantiateList(dataList);

            expect(models).toHaveLength(2); // Invalid item filtered out
            expect(models[0].id).toBe(123);
            expect(models[1].id).toBe(456);
        });
    });

    describe('toJSON', () => {
        it('should convert back to plain object', () => {
            const model = StoryItemModel.instantiate(mockStoryData);
            const json = model.toJSON();

            expect(json.id).toBe(123);
            expect(json.by).toBe('testuser');
            expect(json.title).toBe('Test Story');
        });

        it('should omit undefined values', () => {
            const model = StoryItemModel.instantiate({ id: 123 });
            const json = model.toJSON();

            expect(json.text).toBeUndefined();
            expect(json.url).toBeUndefined();
        });
    });
}); 