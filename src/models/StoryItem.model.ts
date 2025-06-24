import { z } from 'zod';

// Zod schema for validation
export const StoryItemSchema = z.object({
    by: z.string().optional(),
    dead: z.boolean().optional(),
    deleted: z.boolean().optional(),
    descendants: z.number().optional(),
    id: z.number(),
    kids: z.array(z.number()).optional(),
    parent: z.number().optional(),
    parts: z.array(z.number()).optional(),
    poll: z.number().optional(),
    score: z.number().optional(),
    text: z.string().optional(),
    time: z.number().optional(),
    title: z.string().optional(),
    type: z.enum(['comment', 'job', 'poll', 'pollopt', 'story']).optional(),
    url: z.string().optional(),
});

export type StoryItemType = z.infer<typeof StoryItemSchema>;

export class StoryItemModel {
    static version = 1.0;

    id: number;
    by: string;
    dead: boolean;
    deleted: boolean;
    descendants: number;
    kids: number[];
    parent?: number;
    parts: number[];
    poll?: number;
    score: number;
    text: string;
    time: number;
    title: string;
    type: 'comment' | 'job' | 'poll' | 'pollopt' | 'story';
    url: string;

    // Computed properties
    timeFormatted: string;
    domain: string;
    typeLabel: string;
    hasExternalUrl: boolean;

    constructor(
        id: number,
        by: string,
        dead: boolean,
        deleted: boolean,
        descendants: number,
        kids: number[],
        parent: number | undefined,
        parts: number[],
        poll: number | undefined,
        score: number,
        text: string,
        time: number,
        title: string,
        type: 'comment' | 'job' | 'poll' | 'pollopt' | 'story',
        url: string
    ) {
        this.id = id;
        this.by = by;
        this.dead = dead;
        this.deleted = deleted;
        this.descendants = descendants;
        this.kids = kids;
        this.parent = parent;
        this.parts = parts;
        this.poll = poll;
        this.score = score;
        this.text = text;
        this.time = time;
        this.title = title;
        this.type = type;
        this.url = url;

        // Computed properties - calculated inline to avoid circular dependency
        this.timeFormatted = time ? this.calculateTimeFormatted(time) : '';
        this.domain = url ? this.calculateDomain(url) : '';
        this.typeLabel = this.calculateTypeLabel();
        this.hasExternalUrl = Boolean(url && url.trim());
    }

    /**
     * Create StoryItemModel from API response
     */
    static instantiate(json: unknown): StoryItemModel {
        // Validate with Zod
        const validatedData = StoryItemSchema.parse(json);

        const id = validatedData.id;
        const by = validatedData.by ?? 'Anonymous';
        const dead = validatedData.dead ?? false;
        const deleted = validatedData.deleted ?? false;
        const descendants = validatedData.descendants ?? 0;
        const kids = validatedData.kids ?? [];
        const parent = validatedData.parent;
        const parts = validatedData.parts ?? [];
        const poll = validatedData.poll;
        const score = validatedData.score ?? 0;
        const text = validatedData.text ?? '';
        const time = validatedData.time ?? 0;
        const title = validatedData.title ?? 'No title';
        const type = validatedData.type ?? 'story';
        const url = validatedData.url ?? '';

        return new StoryItemModel(
            id,
            by,
            dead,
            deleted,
            descendants,
            kids,
            parent,
            parts,
            poll,
            score,
            text,
            time,
            title,
            type,
            url
        );
    }

    /**
     * Create list of StoryItemModel from array
     */
    static instantiateList(json: unknown[]): StoryItemModel[] {
        return json
            .filter(item => item !== null)
            .map(obj => StoryItemModel.instantiate(obj));
    }

    /**
     * Safe instantiate - returns null if validation fails
     */
    static safeInstantiate(json: unknown): StoryItemModel | null {
        try {
            return StoryItemModel.instantiate(json);
        } catch (error) {
            console.warn('Failed to parse StoryItem:', error);
            return null;
        }
    }

    /**
     * Safe instantiate list - filters out invalid items
     */
    static safeInstantiateList(json: unknown[]): StoryItemModel[] {
        return json
            .map(obj => StoryItemModel.safeInstantiate(obj))
            .filter((item): item is StoryItemModel => item !== null);
    }

    /**
     * Convert model back to plain object
     */
    toJSON(): StoryItemType {
        return {
            by: this.by === 'Anonymous' ? undefined : this.by,
            dead: this.dead || undefined,
            deleted: this.deleted || undefined,
            descendants: this.descendants || undefined,
            id: this.id,
            kids: this.kids.length > 0 ? this.kids : undefined,
            parent: this.parent,
            parts: this.parts.length > 0 ? this.parts : undefined,
            poll: this.poll,
            score: this.score || undefined,
            text: this.text || undefined,
            time: this.time || undefined,
            title: this.title || undefined,
            type: this.type,
            url: this.url || undefined,
        };
    }

    /**
     * Get clean text without HTML tags
     */
    getCleanText(): string {
        return this.text.replace(/<[^>]*>/g, '');
    }

    /**
     * Check if item is a story
     */
    isStory(): boolean {
        return this.type === 'story';
    }

    /**
     * Check if item is a comment
     */
    isComment(): boolean {
        return this.type === 'comment';
    }

    /**
     * Check if item is a job
     */
    isJob(): boolean {
        return this.type === 'job';
    }

    /**
 * Get reading time estimate
 */
    getReadingTime(): number {
        const wordsPerMinute = 200;
        const wordCount = this.getCleanText().split(/\s+/).length;
        return Math.ceil(wordCount / wordsPerMinute);
    }

    /**
     * Calculate formatted time string
     */
    private calculateTimeFormatted(unixTime: number): string {
        const now = Date.now() / 1000;
        const diffSeconds = now - unixTime;

        if (diffSeconds < 3600) {
            return `${Math.floor(diffSeconds / 60)}m ago`;
        } else if (diffSeconds < 86_400) {
            return `${Math.floor(diffSeconds / 3600)}h ago`;
        } else {
            return `${Math.floor(diffSeconds / 86_400)}d ago`;
        }
    }

    /**
     * Extract domain from URL
     */
    private calculateDomain(url: string): string {
        try {
            return new URL(url).hostname.replace('www.', '');
        } catch {
            return '';
        }
    }

    /**
     * Calculate story type label
     */
    private calculateTypeLabel(): string {
        if (this.type === 'job') return 'job';
        if (this.type === 'story' && !this.url && this.title?.startsWith('Ask HN:')) return 'ask';
        if (this.type === 'story' && this.title?.startsWith('Show HN:')) return 'show';
        return 'story';
    }
} 