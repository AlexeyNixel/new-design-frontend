import type { Post } from '~~/services/types/post.type';

/** Служебные теги новостей, по которым делится выдача на главной */
export const POST_TAG = {
  announcement: '677ab3f1-0adf-4e4b-a111-ed44115d32e6', // «Анонсы»
  event: '5437f6b5-5037-4353-bb4a-f3d711628ef6', // «События»
  actual: 'bbf93abb-3d51-4bdf-8cca-93ac5262d87c', // «Актуальное»
  partner: 'b7ffa631-8d88-4f10-8e79-cacac4cda04d', // «Партнёр»
} as const;

export const postHasTag = (post: Post, tagId: string) =>
  (post.tags ?? []).some(t => t.tag?.id === tagId);

export type PostKind = 'announcement' | 'event';

/**
 * Куда попадает новость на главной: «Актуальное» и «События» — в события,
 * остальные с тегом «Анонсы» — в анонсы. Партнёрские и прочие — никуда (null).
 */
export const getPostKind = (post: Post): PostKind | null => {
  if (postHasTag(post, POST_TAG.partner)) return null;
  if (postHasTag(post, POST_TAG.actual) || postHasTag(post, POST_TAG.event))
    return 'event';
  if (postHasTag(post, POST_TAG.announcement)) return 'announcement';
  return null;
};
