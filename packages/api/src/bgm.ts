import type { BgmQuery, LabelItem, ListItem, ResponseData, SubjectType } from '../../vitepress-anime-tracker/src/shared/types'
import { serializeSearchParams } from '../../vitepress-anime-tracker/src/shared/utils'
import { generateRes } from './shared'

const subjectTypeMap: Record<SubjectType, string> = {
  1: '2', // Anime
  2: '4', // Game
  3: '1', // Book
}

const collectionTypeMap = {
  0: null, // All
  1: '1', // Planned
  2: '3', // Watching
  3: '2', // Completed
}

export async function handler(params: BgmQuery, env?: NodeJS.ProcessEnv) {
  const { subjectType = '1', uid: paramsUid, collectionType = '0', pageNumber = 1, pageSize = 10 } = params
  const uid = paramsUid ?? env?.BGM

  if (!uid) {
    return generateRes({
      code: 400,
      message: `uid is required`,
      data: {},
    })
  }
  const searchParams = serializeSearchParams({
    subject_type: subjectTypeMap[subjectType],
    type: collectionTypeMap[collectionType],
    limit: pageSize,
    offset: (Number(pageNumber) - 1) * Number(pageSize),
  })

  const res = await fetch(`https://api.bgm.tv/v0/users/${uid}/collections?${searchParams}`, {
    headers: {
      'User-Agent': `andatoshiki/vitepress-anime-tracker (https://github.com/andatoshiki/vitepress-anime-tracker)`,
    },
  })
  const data = await res.json()

  if (!res.ok) {
    return generateRes({
      code: 502,
      message: data.description,
      data: {},
    })
  }

  return generateRes({
    code: 200,
    message: 'ok',
    data: handleFetchData(data, { pageNumber: Number(pageNumber), pageSize: Number(pageSize) }),
  })
}

function handleFetchData(data: any, init: { pageNumber: number, pageSize: number }): ResponseData {
  const list = (data?.data as any[])?.map<ListItem>((item) => {
    const subject = item?.subject
    const labels: LabelItem[] = [
      {
        label: subject?.eps && `${subject.eps}话`,
      },
      {
        label: '评分',
        value: subject?.score,
      },
      {
        label: '排名',
        value: subject?.rank,
      },
      {
        label: '时间',
        value: subject?.date,
      },
    ]
    return {
      name: subject?.name,
      nameEN: subject?.name_cn,
      summary: subject?.short_summary,
      cover: subject?.images?.large,
      url: subject?.id ? `https://bgm.tv/subject/${subject?.id}` : 'https://bgm.tv/',
      labels: labels.filter((item) => {
        if ('value' in item)
          return item.value
        else
          return item.label
      }),
    }
  })
  return {
    list: list ?? [],
    ...init,
    total: data.total,
    totalPages: Math.ceil(data.total / init.pageSize),
  }
}
