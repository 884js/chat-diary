export const BucketKeys = {
  users: 'users',
  chats: 'chats',
} as const;

export const FileBucketKeys = {
  userIdWelcomeImages: (id: string) => `${id}/welcome_images/` as const,
  userIdOgpImages: (id: string) => `${id}/ogp_images/` as const,
} as const;

type FileBucketKeysType = typeof FileBucketKeys;

export type FileBucketPath = ReturnType<
  FileBucketKeysType[keyof FileBucketKeysType]
>;
