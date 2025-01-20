import type { FunctionalComponent } from '@stencil/core'
import { h } from '@stencil/core'
import type { ContainerState, LabelItem, ListItem } from '../shared/types'
import { Skeleton } from './Skeleton'

interface LabelProps {
  containerState: ContainerState
  labels: LabelItem[]
}

const Label: FunctionalComponent<LabelProps> = ({ containerState, labels }) => {
  let renderLabels = [...labels]

  if (containerState === 'middle')
    renderLabels = renderLabels.slice(0, 4)

  if (containerState === 'small')
    renderLabels = renderLabels.slice(0, 3)

  return (
    <div class="vitepress-anime-tracker-bangumi-labels">
      {renderLabels.map(label => (
        <div class={{
          'vitepress-anime-tracker-bangumi-label': true,
          'vitepress-anime-tracker-md-label-text': containerState !== 'large',
        }}
        >
          <p class="vitepress-anime-tracker-bangumi-label-title">{label.label}</p>
          {label.value && <p>{label.value}</p>}
        </div>
      ))}
    </div>
  )
}

interface ListProps {
  loading: boolean
  list: ListItem[]
  containerState: ContainerState
}

export const List: FunctionalComponent<ListProps> = ({ list, loading, containerState }) => {
  return (
    <div class="vitepress-anime-tracker-bangumi">
      {list.map(item => (
        <div>
          {loading
            ? <Skeleton />
            : (
              <div class="vitepress-anime-tracker-bangumi-item">
                <a href={item.url} target="_blank" rel="noreferrer">
                  {/* @ts-expect-error */}
                  <img src={item.cover} alt="cover" loading="lazy" referrerpolicy="no-referrer" />
                </a>
                <div class="vitepress-anime-tracker-bangumi-content">
                  <h3 class="vitepress-anime-tracker-bangumi-title">
                    <a href={item.url} target="_blank" rel="noreferrer" innerHTML={item.name ? item.name : item.nameEN} />
                    {item.name && <small innerHTML={item.nameEN} />}
                  </h3>
                  <Label containerState={containerState} labels={item.labels} />
                  <p class="vitepress-anime-tracker-bangumi-summary" innerHTML={item.summary} />
                </div>
              </div>
              )}
        </div>
      ))}
    </div>
  )
}
