import type { Config } from '@stencil/core'

export const config: Config = {
  namespace: 'vitepress-anime-tracker',
  extras: {
    enableImportInjection: true,
  },
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  sourceMap: false,
}
