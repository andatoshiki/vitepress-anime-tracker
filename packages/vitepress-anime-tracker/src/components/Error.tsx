import { h } from '@stencil/core'

interface ErrorProps {
  error: Error
}

export function Error({ error }: ErrorProps) {
  return (
    <div class="vitepress-anime-tracker-error">
      <img
        src="https://r2.toshiki.dev/image/toshiki-home-nuxt/4b0c3b2fb3fdb9c49b1f7487919fb925.png"
        alt="parse failed"
        // @ts-expect-error
        referrerpolicy="no-referrer"
      />
      <p class="inter-text">Σ(oﾟдﾟoﾉ) We have encountered some errors!</p>
      <p>{`message: ${error.message}`}</p>
    </div>
  )
}
