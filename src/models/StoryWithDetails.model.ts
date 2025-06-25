import { z } from 'zod';

import { StoryItemModel, StoryItemSchema } from './StoryItem.model';
export const StoryWithDetailsSchema = StoryItemSchema.extend({
    comments: z.array(StoryItemSchema).optional(),
    commentsCount: z.number().optional(),
});
export type StoryWithDetailsType = z.infer<typeof StoryWithDetailsSchema>;
export class StoryWithDetailsModel extends StoryItemModel {
    static version = 1;
    comments: StoryItemModel[];
    commentsCount: number;
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
        url: string,
        comments: StoryItemModel[],
        commentsCount: number
    ) {
        super(id, by, dead, deleted, descendants, kids, parent, parts, poll, score, text, time, title, type, url);
        this.comments = comments;
        this.commentsCount = commentsCount;
    }
    static instantiate(json: unknown, comments: unknown[] = []): StoryWithDetailsModel {
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
        const commentModels = StoryItemModel.safeInstantiateList(comments);
        const commentsCount = descendants;
        return new StoryWithDetailsModel(
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
            url,
            commentModels,
            commentsCount
        );
    }
    static safeInstantiate(json: unknown, comments: unknown[] = []): null | StoryWithDetailsModel {
        try {
            return StoryWithDetailsModel.instantiate(json, comments);
        } catch (error) {
            console.warn('Failed to parse StoryWithDetails:', error);
            return null;
        }
    }
    addComments(newComments: StoryItemModel[]): void {
        const existingIds = new Set(this.comments.map(c => c.id));
        const uniqueNewComments = newComments.filter(c => !existingIds.has(c.id));
        this.comments.push(...uniqueNewComments);
    }
    getCommentById(commentId: number): StoryItemModel | undefined {
        return this.comments.find(comment => comment.id === commentId);
    }
    getLoadedCommentsCount(): number {
        return this.comments.length;
    }
    getRepliesForComment(commentId: number): StoryItemModel[] {
        return this.comments.filter(comment => comment.parent === commentId);
    }
    getTopLevelComments(): StoryItemModel[] {
        return this.comments.filter(comment => !comment.parent || comment.parent === this.id);
    }
    hasComments(): boolean {
        return this.comments.length > 0;
    }
    hasMoreComments(): boolean {
        return this.getLoadedCommentsCount() < this.commentsCount;
    }
    sortCommentsByScore(): void {
        this.comments.sort((a, b) => (b.score || 0) - (a.score || 0));
    }
    sortCommentsByTime(): void {
        this.comments.sort((a, b) => (b.time || 0) - (a.time || 0));
    }
    toJSON(): StoryWithDetailsType {
        const baseData = super.toJSON();
        return {
            ...baseData,
            comments: this.comments.map(comment => comment.toJSON()),
            commentsCount: this.commentsCount,
        };
    }
} 