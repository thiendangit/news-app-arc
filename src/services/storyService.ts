import { StoryItemModel, StoryWithDetailsModel } from '@/models';

// Hacker News API Service
const BASE_URL = 'https://hacker-news.firebaseio.com/v0';

export enum StoryType {
    BEST = 'beststories',
    NEW = 'newstories',
    TOP = 'topstories',
}

class StoryService {
    // Get story IDs by type
    async getStoryIds(type: StoryType): Promise<number[]> {
        const response = await fetch(`${BASE_URL}/${type}.json`);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${type}: ${response.statusText}`);
        }
        return response.json();
    }

    // Get individual item by ID
    async getItem(id: number): Promise<null | StoryItemModel> {
        const response = await fetch(`${BASE_URL}/item/${id}.json`);
        if (!response.ok) {
            throw new Error(`Failed to fetch item ${id}: ${response.statusText}`);
        }
        const json = await response.json();
        return json ? StoryItemModel.safeInstantiate(json) : null;
    }

    // Get multiple items (for stories list)
    async getItems(ids: number[]): Promise<StoryItemModel[]> {
        const promises = ids.map(id => this.getItem(id));
        const items = await Promise.all(promises);
        return items.filter((item): item is StoryItemModel => item !== null);
    }

    // Get paginated stories
    async getStoriesPaginated(
        type: StoryType,
        page = 0,
        limit = 20
    ): Promise<StoryItemModel[]> {
        const allIds = await this.getStoryIds(type);
        const startIndex = page * limit;
        const endIndex = startIndex + limit;
        const pageIds = allIds.slice(startIndex, endIndex);

        return this.getItems(pageIds);
    }

    // Get story with comments
    async getStoryWithComments(id: number, maxComments = 10): Promise<StoryWithDetailsModel> {
        const response = await fetch(`${BASE_URL}/item/${id}.json`);
        if (!response.ok) {
            throw new Error(`Failed to fetch story ${id}: ${response.statusText}`);
        }

        const storyJson = await response.json();
        if (!storyJson) {
            throw new Error(`Story ${id} not found`);
        }

        let comments: unknown[] = [];
        if (storyJson.kids && storyJson.kids.length > 0) {
            // Get first level comments only (for performance)
            const commentIds = storyJson.kids.slice(0, maxComments);
            const commentPromises = commentIds.map(async (commentId: number) => {
                const commentResponse = await fetch(`${BASE_URL}/item/${commentId}.json`);
                return commentResponse.ok ? commentResponse.json() : null;
            });
            const commentResults = await Promise.all(commentPromises);
            comments = commentResults.filter(comment => comment !== null);
        }

        return StoryWithDetailsModel.instantiate(storyJson, comments);
    }

    // Get comments for a story (with nested loading)
    async getComments(commentIds: number[]): Promise<StoryItemModel[]> {
        return this.getItems(commentIds);
    }

    // Get user profile
    async getUser(username: string): Promise<null | StoryItemModel> {
        const response = await fetch(`${BASE_URL}/user/${username}.json`);
        if (!response.ok) {
            throw new Error(`Failed to fetch user ${username}: ${response.statusText}`);
        }
        const json = await response.json();
        return json ? StoryItemModel.safeInstantiate(json) : null;
    }

    // Get max item ID (latest item)
    async getMaxItem(): Promise<number> {
        const response = await fetch(`${BASE_URL}/maxitem.json`);
        if (!response.ok) {
            throw new Error(`Failed to fetch max item: ${response.statusText}`);
        }
        return response.json();
    }
}

export const storyService = new StoryService();

// Legacy service export for backward compatibility
export const hackerNewsService = storyService; 