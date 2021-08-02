import { Static } from '@sinclair/typebox';
import { Blog, DeleteBlogByIdParams, NewBlog, PartialBlog, UpdateBlogByIdParams } from '../schemas/blog';

export type BlogType = Static<typeof Blog>;

export type NewBlogType = Static<typeof NewBlog>;

export type PartialBlogType = Static<typeof PartialBlog>;

export type UpdateBlogByIdParamsType = Static<typeof UpdateBlogByIdParams>;

export type DeleteBlogByIdParamsType = Static<typeof DeleteBlogByIdParams>;
