import { h } from '@stencil/core'

export function Skeleton() {
  return (
    <div class="vitepress-anime-tracker-skeleton-container vitepress-anime-tracker-bangumi-item">
      <div class="vitepress-anime-tracker-skeleton-avatar"></div>
      <div class="vitepress-anime-tracker-skeleton-content vitepress-anime-tracker-bangumi-content">
        <div class="vitepress-anime-tracker-skeleton-row" style={{ width: '30%' }}></div>
        <div class="vitepress-anime-tracker-skeleton-row" style={{ width: '60%', height: '40px' }}></div>
        <div class="vitepress-anime-tracker-skeleton-row" style={{ width: '90%', height: '32px' }}></div>
      </div>
    </div>
  )
}
