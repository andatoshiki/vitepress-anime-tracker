import type { UnionToTuple } from './typeUtils'

export type Platform = 'Bilibili' | 'Bangumi' | string

export type Subject = 'Anime' | 'Game' | 'Book'

export type AnimeCollection = 'All' | 'Planned' | 'Watching' | 'Completed'

export type GameCollection = 'All' | 'Planned' | 'Playing' | 'Played'

export type BookCollection = 'All' | 'Planned' | 'Reading' | 'Read'

export type Collection = AnimeCollection | GameCollection | BookCollection

export type CollectionType = '0' | '1' | '2' | '3'

export type CollectionLabel = UnionToTuple<AnimeCollection> | UnionToTuple<GameCollection> | UnionToTuple<BookCollection>

/**
 * 1 Anime 2 Game 3 Book
 */
export type SubjectType = '1' | '2' | '3'

export interface BilibiliQuery {
  /**
   * 筛选状态
   * 0 All
   * 1 Planned
   * 2 Watching
   * 3 Completed
   */
  collectionType?: CollectionType

  uid?: string

  /**
   * 第几页
   */
  pageNumber?: number

  /**
   * 一页多少个
   */
  pageSize?: number
}

export interface BgmQuery extends BilibiliQuery {
  /**
   * 1 为Anime 2 为Game 3 为Book
   */
  subjectType?: SubjectType
}

export type CustomQuery = Omit<BgmQuery, 'uid'>

interface EmptyData {}

export interface ResponseType {
  code: number
  message: string
  data: ResponseData | EmptyData
}

export interface ResponseData {
  list: ListItem[]
  pageNumber: number
  pageSize: number
  total: number
  totalPages: number
}

export interface ListItem {
  // 原名  b站没有
  name?: string
  // 中文名
  nameEN?: string
  // 简介
  summary: string
  // 封面
  cover?: string
  // 资源链接
  url: string
  // 标签
  labels: LabelItem[]
}

export interface LabelItem {
  label: string
  value?: string | number
}

export type ContainerState = 'large' | 'middle' | 'small'
