import type { BilibiliQuery, LabelItem, ListItem, ResponseData } from '../../vitepress-anime-tracker/src/shared/types'
import { numberToZh, serializeSearchParams } from '../../vitepress-anime-tracker/src/shared/utils'
import { generateRes } from './shared'

export async function handler(query: BilibiliQuery, env?: NodeJS.ProcessEnv) {
  const { collectionType = '0', uid: paramsUid, pageNumber = '1', pageSize = '10' } = query
  const vmid = paramsUid ?? env?.BILIBILI

  if (!vmid) {
    return generateRes({
      code: 400,
      message: 'uid is required',
      data: {},
    })
  }
  const searchParams = serializeSearchParams({
    type: 1,
    follow_status: collectionType,
    pn: pageNumber,
    ps: pageSize,
    vmid,
  })

  const res = await fetch(`https://api.bilibili.com/x/space/bangumi/follow/list?${searchParams}`)
  const data = await res.json()

  if (!res.ok) {
    return generateRes({
      code: 502,
      message: data.message,
      data: {},
    })
  }

  return generateRes({
    code: 200,
    message: 'ok',
    data: handleFetchData(data.data),
  })
}

function handleFetchData(data: any): ResponseData {
  const list = (data?.list as any[])?.map<ListItem>((item) => {
    const labels: LabelItem[] = [
      {
        label: item?.new_ep?.index_show,
      },
      {
        label: 'Score',
        value: item?.rating?.score,
      },
      {
        label: 'Views',
        value: item?.stat?.view && numberToZh(item.stat.view),
      },
      {
        label: 'Watched',
        value: item?.stat?.follow && numberToZh(item.stat.follow),
      },
      {
        label: 'Coined',
        value: item?.stat?.coin && numberToZh(item.stat.coin),
      },
      {
        label: 'Damaku',
        value: item?.stat?.danmaku && numberToZh(item.stat.danmaku),
      },
    ]
    return {
      nameEN: item.title,
      summary: item.summary,
      cover: item.cover,
      url: item.url,
      labels: labels.filter(item => item.label),
    }
  })

  return {
    list: list ?? [],
    pageNumber: data.pn,
    pageSize: data.ps,
    total: data.total,
    totalPages: Math.ceil(data.total / data.ps),
  }
}
