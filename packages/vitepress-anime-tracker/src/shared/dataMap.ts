import type { AnimeCollection, BookCollection, CollectionLabel, CollectionType, GameCollection, Subject, SubjectType } from './types'

export const animeCollectionMap: Record<AnimeCollection, CollectionType> = {
  All: '0',
  Planned: '1',
  Watching: '2',
  Completed: '3',
}

export const gameCollectionMap: Record<GameCollection, CollectionType> = {
  All: '0',
  Planned: '1',
  Playing: '2',
  Played: '3',
}

export const bookCollectionMap: Record<BookCollection, CollectionType> = {
  All: '0',
  Planned: '1',
  Reading: '2',
  Read: '3',
}

export const collectionMap = {
  Anime: animeCollectionMap,
  Game: gameCollectionMap,
  Book: bookCollectionMap,
}

export const subjectMap: Record<Subject, SubjectType> = {
  Anime: '1',
  Game: '2',
  Book: '3',
}

export const collectionLabelMap: Record<Subject, CollectionLabel> = {
  Anime: ['All', 'Planned', 'Watching', 'Completed'],
  Game: ['All', 'Planned', 'Playing', 'Played'],
  Book: ['All', 'Planned', 'Reading', 'Read'],
}
