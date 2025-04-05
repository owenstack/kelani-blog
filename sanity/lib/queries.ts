import { defineQuery } from "next-sanity";

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`);

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
  "author": author->{"name": coalesce(name, "Anonymous"), picture},
`;

export const heroQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) [0] {
    content,
    ${postFields}
  }
`);

export const moreStoriesQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`);

export const moreStoriesWithoutSkip = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`);

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content,
    ${postFields}
  }
`);

export const postCommentsQuery = defineQuery(`
  *[_type == "comment" && post._ref == $postId && !defined(parentComment)] | order(timestamp desc) [$start...$end] {
    _id,
    username,
    comment,
    timestamp,
    likes,
    dislikes,
    likedBy,
    dislikedBy
  }
`);

export const commentRepliesQuery = defineQuery(`
  *[_type == "comment" && parentComment._ref == $commentId] | order(timestamp desc) [$start...$end] {
    _id,
    userId,
    username,
    email,
    comment,
    timestamp,
    likes,
    dislikes,
    likedBy,
    dislikedBy
  }
`);

export const createCommentMutation = /* groq */ `
  *[_type == "comment"] {
    _type,
    userId,
    username,
    email,
    comment,
    post: {
      "_ref": $postId,
      "_type": "reference"
    }
  }
`;

export const createCommentReplyMutation = /* groq */ `
  *[_type == "comment"] {
    _type,
    userId,
    username,
    email,
    comment,
    post: {
      "_ref": $postId,
      "_type": "reference"
    },
    parentComment: {
      "_ref": $commentId,
      "_type": "reference"
    }
  }
`;

export const likeCommentMutation = /* groq */ `
  *[_type == "comment" && _id == $commentId] {
    "likes": likes + 1,
    "likedBy": array::unique(array::union(coalesce(likedBy, []), [$userEmail]))
  }
`;

export const unlikeCommentMutation = /* groq */ `
  *[_type == "comment" && _id == $commentId] {
    "likes": likes - 1,
    "likedBy": array::filter(coalesce(likedBy, []), @item != $userEmail)
  }
`;

export const dislikeCommentMutation = /* groq */ `
  *[_type == "comment" && _id == $commentId] {
    "dislikes": dislikes + 1,
    "dislikedBy": array::unique(array::union(coalesce(dislikedBy, []), [$userEmail]))
  }
`;

export const undislikeCommentMutation = /* groq */ `
  *[_type == "comment" && _id == $commentId] {
    "dislikes": dislikes - 1,
    "dislikedBy": array::filter(coalesce(dislikedBy, []), @item != $userEmail)
  }
`;
