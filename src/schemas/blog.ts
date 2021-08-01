import { Type } from '@sinclair/typebox';

export const Blog = Type.Object({
  id: Type.String(),
  title: Type.String(),
  content: Type.String(),
  authorId: Type.String(),
});

export const NewBlog = Type.Omit(Blog, ['id']);

export const PartialBlog = Type.Partial(NewBlog);

export const updateBlogByIdParams = Type.Object({
  id: Type.String(),
});
