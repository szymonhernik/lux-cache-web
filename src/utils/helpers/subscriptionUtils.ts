export const canAccessPost = (
  userTier: number | null | undefined,
  postMinimumTier: string | null | undefined
): boolean | null => {
  if (
    userTier === null ||
    userTier === undefined ||
    postMinimumTier === null ||
    postMinimumTier === undefined
  ) {
    return null
  }

  return userTier >= Number(postMinimumTier)
}
