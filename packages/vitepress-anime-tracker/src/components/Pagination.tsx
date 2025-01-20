import { h } from '@stencil/core'

export type ChangeType = 'head' | 'prev' | 'next' | 'tail'

interface PaginationProps {
  pageNumber: number
  totalPages: number
  onChange: (changeType: ChangeType) => void
  onInputChange: (event: Event) => void
}

export function Pagination({ pageNumber, totalPages, onChange, onInputChange }: PaginationProps) {
  return (
    <div class="vitepress-anime-tracker-pagination">
      <a class="vitepress-anime-tracker-pagination-button" onClick={() => onChange('head')}>Home</a>
      <a class="vitepress-anime-tracker-pagination-button" onClick={() => onChange('prev')}>Previous</a>
      <span class="vitepress-anime-tracker-pagination-pagenum">{`${pageNumber} / ${totalPages}`}</span>
      <a class="vitepress-anime-tracker-pagination-button" onClick={() => onChange('next')}>Next</a>
      <a class="vitepress-anime-tracker-pagination-button" onClick={() => onChange('tail')}>Last</a>
      <div class="vitepress-anime-tracker-pagination-input">
        <span>Jump to page</span>
        <input type="text" maxLength={4} onChange={onInputChange} />
        {/* <span>页</span> */}
      </div>
    </div>
  )
}
