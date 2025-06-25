import { formatStoryType, formatTime } from '@/utils/time';
import { z } from 'zod';

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
    static version = 1;
    by: string;
    dead: boolean;
    deleted: boolean;
    descendants: number;
    domain: string;
    hasExternalUrl: boolean;
    id: number;
    kids: number[];
    parent?: number;
    parts: number[];
    poll?: number;
    score: number;
    text: string;
    time: number;
    timeFormatted: string;
    title: string;
    type: 'comment' | 'job' | 'poll' | 'pollopt' | 'story';
    typeLabel: string;
    url: string;
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
        this.timeFormatted = time ? this.calculateTimeFormatted(time) : '';
        this.domain = url ? this.calculateDomain(url) : '';
        this.typeLabel = this.calculateTypeLabel();
        this.hasExternalUrl = Boolean(url && url.trim());
    }
    static instantiate(json: unknown): StoryItemModel {
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
    static instantiateList(json: unknown[]): StoryItemModel[] {
        return json
            .filter(item => item !== null)
            .map(object => StoryItemModel.instantiate(object));
    }
    static safeInstantiate(json: unknown): null | StoryItemModel {
        try {
            return StoryItemModel.instantiate(json);
        } catch (error) {
            console.warn('Failed to parse StoryItem:', error);
            return null;
        }
    }
    static safeInstantiateList(json: unknown[]): StoryItemModel[] {
        return json
            .map(object => StoryItemModel.safeInstantiate(object))
            .filter((item): item is StoryItemModel => item !== null);
    }
    getCleanText(): string {
        return this.text.replaceAll(/<[^>]*>/g, '');
    }
    getReadingTime(): number {
        const wordsPerMinute = 200;
        const wordCount = this.getCleanText().split(/\s+/).length;
        return Math.ceil(wordCount / wordsPerMinute);
    }
    isComment(): boolean {
        return this.type === 'comment';
    }
    isJob(): boolean {
        return this.type === 'job';
    }
    isStory(): boolean {
        return this.type === 'story';
    }
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
    private calculateDomain(url: string): string {
        try {
            return new URL(url).hostname.replace('www.', '');
        } catch {
            return '';
        }
    }
    private calculateTimeFormatted(unixTime: number): string {
        return formatTime(unixTime);
    }
    private calculateTypeLabel(): string {
        return formatStoryType(this.type, this.title, this.url);
    }
} 