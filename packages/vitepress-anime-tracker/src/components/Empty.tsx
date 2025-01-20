import { h } from '@stencil/core'

export function Empty() {
  return (
    <div class="vitepress-anime-tracker-empty">
      {/* @ts-expect-error */}
      <img src="https://r2.toshiki.dev/image/toshiki-home-nuxt/4462730df16ce3c01e07230b68d8e822.png" alt="empty" referrerpolicy="no-referrer" />
    </div>
  )
}
