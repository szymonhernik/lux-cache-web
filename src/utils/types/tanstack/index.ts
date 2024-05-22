import { InfiniteData } from '@tanstack/react-query'
import { SinglePostType } from '../sanity'

export type TQueryFnData = SinglePostType[]
export type TError = Error
export type TData = InfiniteData<SinglePostType[], unknown>
export type TQueryKey = string[]
export type TPageParam = {}
