import { Static } from '@sinclair/typebox';
import {
  Blog,
  DeleteBlogByIdParams,
  NewBlog,
  PartialBlog,
  PatchBlogByIdParams,
  PatchBlogByIdQuery,
} from '../schemas/blog';

export type BlogType = Static<typeof Blog>;

export type NewBlogType = Static<typeof NewBlog>;

export type PartialBlogType = Static<typeof PartialBlog>;

export type PatchBlogByIdParamsType = Static<typeof PatchBlogByIdParams>;

export type PatchBlogByIdQueryType = Static<typeof PatchBlogByIdQuery>;

export type DeleteBlogByIdParamsType = Static<typeof DeleteBlogByIdParams>;
