import { createApp } from './app.js'

export default ctx => {
  const { app, router } = createApp()
  router.push(ctx.url)
  router.onReady(() => {
    const matchedComponetns = router.getMathchedComponents()
    if (!matchedComponetns.length) {
      return reject({code: 404})
    }
  })
  return app
}