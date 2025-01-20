import { Component, Prop, State, h } from '@stencil/core'
import type { Collection, CollectionLabel, ContainerState, Platform, ResponseData, Subject } from '../shared/types'
import type { UnionToTuple } from '../shared/typeUtils'
import type { BilibiliParams } from '../shared/api'
import { getBangumi, getBilibili, getCustom } from '../shared/api'
import { thorttle } from '../shared/utils'
import { collectionLabelMap } from '../shared/dataMap'
import { Tabs } from './Tabs'
import { List } from './List'
import { type ChangeType, Pagination } from './Pagination'
import { Skeleton } from './Skeleton'
import { Empty } from './Empty'
import { Error } from './Error'

@Component({
  tag: 'vitepress-anime-tracker',
  styleUrl: 'index.css',
  shadow: true,
})
export class vitepressAnimeTracker {
  @Prop() api: string
  @Prop() bilibiliUid?: string
  @Prop() bgmUid?: string
  @Prop() bilibiliEnabled = true
  @Prop() bgmEnabled = true
  @Prop() pageSize = 15
  @Prop() customEnabled = false
  @Prop() customLabel = 'Custom'

  @State() loading = false
  @State() error?: Error

  @State() pageNumber = 1
  @State() responseData: ResponseData

  platformLabels: Platform[] = ['Bilibili', 'Bangumi']
  @State() activePlatform: Platform = 'Bilibili'

  subjectLabels: UnionToTuple<Subject> = ['Anime', 'Game', 'Book']
  @State() activeSubject: Subject = 'Anime'

  @State() collectionLabels: CollectionLabel = ['All', 'Planned', 'Watching', 'Completed']
  @State() activeCollection: Collection = 'All'

  @State() containerRef: HTMLDivElement = null
  @State() containerState: ContainerState = 'large'

  componentWillLoad() {
    const platformLabels = [...this.platformLabels]
    if (this.customEnabled)
      platformLabels.push(this.customLabel)
    const filterArr = [this.bilibiliEnabled, this.bgmEnabled, this.customEnabled]
    this.platformLabels = platformLabels.filter((_, index) => filterArr[index])
    this.activePlatform = this.platformLabels[0]
    this.fetchData()
  }

  componentDidLoad() {
    // 监听容器尺寸变化
    const update = thorttle((width: number) => {
      let containerState: ContainerState = 'large'
      if (width <= 640)
        containerState = 'middle'
      if (width <= 465)
        containerState = 'small'

      this.containerState = containerState
    }, 100).bind(this)

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries)
        update(entry.contentRect.width)
    })
    resizeObserver.observe(this.containerRef)
  }

  private fetchData = async () => {
    try {
      this.loading = true
      this.error = null
      let response
      const bilibiliParams: BilibiliParams = {
        uid: this.bilibiliUid,
        collectionType: this.activeCollection,
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
      }
      if (this.activePlatform === 'Bilibili') {
        response = await getBilibili(this.api, bilibiliParams)
      }
      else if (this.activePlatform === 'Bangumi') {
        response = await getBangumi(this.api, {
          ...bilibiliParams,
          uid: this.bgmUid,
          subjectType: this.activeSubject,
        })
      }
      else {
        response = await getCustom(this.api, {
          ...bilibiliParams,
          subjectType: this.activeSubject,
        })
      }
      if (response.code === 200) {
        this.responseData = response.data
      }
      else {
        this.error = response
        this.responseData = null
      }
    }
    catch (error) {
      this.error = error
      this.responseData = null
    }
    this.loading = false
  }

  private handlePlatformChange = (label: Platform) => {
    this.collectionLabels = collectionLabelMap.Anime
    this.activePlatform = label
    this.pageNumber = 1
    this.activeSubject = 'Anime'
    this.activeCollection = 'All'
    this.fetchData()
  }

  private handleSubjectChange = (label: Subject) => {
    this.collectionLabels = collectionLabelMap[label]
    this.activeSubject = label
    this.pageNumber = 1
    this.activeCollection = 'All'
    this.fetchData()
  }

  private handleCollectionChange = (label: Collection) => {
    this.activeCollection = label
    this.pageNumber = 1
    this.fetchData()
  }

  private scrollToTop = () => {
    document.documentElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  private handlePageChange = (changeType: ChangeType) => {
    const { totalPages } = this.responseData!
    switch (changeType) {
      case 'head':
        this.pageNumber = 1
        break
      case 'prev':
        if (this.pageNumber === 1)
          return
        this.pageNumber--
        break
      case 'next':
        if (this.pageNumber === totalPages)
          return
        this.pageNumber++
        break
      case 'tail':
        this.pageNumber = totalPages
        break
    }
    this.scrollToTop()
    this.fetchData()
  }

  private handleInputChange = (event: Event) => {
    const inputValue = Number.parseInt((event.target as HTMLInputElement).value)
    if (Object.is(inputValue, Number.NaN))
      return
    const { totalPages } = this.responseData!
    if (inputValue < 1)
      this.pageNumber = 1
    else if (inputValue > totalPages)
      this.pageNumber = totalPages
    else
      this.pageNumber = inputValue
    this.scrollToTop()
    this.fetchData()
  }

  render() {
    return (
      <div ref={ele => this.containerRef = ele}>
        <div class="vitepress-anime-tracker-header-platform inter-text">
          <Tabs containerState={this.containerState} activeLabel={this.activePlatform} labels={this.platformLabels} onChange={this.handlePlatformChange} />
          { this.activePlatform !== 'Bilibili' && <div class="divider" />}
          {
            this.activePlatform !== 'Bilibili'
            && <Tabs containerState={this.containerState} activeLabel={this.activeSubject} labels={this.subjectLabels} onChange={this.handleSubjectChange} />
          }
        </div>
        <div>
          <Tabs containerState={this.containerState} activeLabel={this.activeCollection} labels={this.collectionLabels} onChange={this.handleCollectionChange} />
        </div>
        {this.loading && !this.responseData && <Skeleton />}
        {this.error && <Error error={this.error} />}
        {this.responseData && <List containerState={this.containerState} loading={this.loading} list={this.responseData.list} />}
        {this.responseData && this.responseData.total === 0 && <Empty />}
        {this.responseData && (
          <Pagination
            pageNumber={this.pageNumber}
            totalPages={this.responseData.totalPages}
            onChange={this.handlePageChange}
            onInputChange={this.handleInputChange}
          />
        )}
      </div>
    )
  }
}
