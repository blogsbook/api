import { Type } from '@sinclair/typebox';

export const Blog = Type.Object(
  {
    id: Type.String(),
    title: Type.String(),
    content: Type.String(),
    authorId: Type.String(),
  },
  { additionalProperties: false }
);

export const NewBlog = Type.Omit(Blog, ['id']);

export const PartialBlog = Type.Partial(NewBlog);

export const UpdateBlogByIdParams = Type.Object({
  id: Type.String(),
});

export const DeleteBlogByIdParams = Type.Object({
  id: Type.String(),
});
