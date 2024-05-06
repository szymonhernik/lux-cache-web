export const posts = Array.from({ length: 9 }, (_, index) => ({
  id: index + 1,
  content: `Item ${index + 1}`
}))
