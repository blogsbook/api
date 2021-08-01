import { Static } from '@sinclair/typebox';
import { Blog, NewBlog, PartialBlog, UpdateBlogByIdParams } from '../schemas/blog';

export type BlogType = Static<typeof Blog>;

export type NewBlogType = Static<typeof NewBlog>;

export type PartialBlogType = Static<typeof PartialBlog>;

export type UpdateBlogByIdParamsType = Static<typeof UpdateBlogByIdParams>;
