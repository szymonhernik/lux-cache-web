export const canAccessPost = (
  userTier: number,
  postMinimumTier: string
): boolean => {
  // if (postMinimumTier === null || userTier === undefined) {
  //   return false // If minimum tier is null, allow access
  // }

  return userTier >= Number(postMinimumTier)
}
