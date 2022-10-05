const path = require('path')
const Koa = require('koa')
const Router = require('koa-router')
const body = require('koa-body')
const serve = require('koa-static')
const app = new Koa()
const router = new Router()
const CONST = import('../shared/const.mjs')

;(async () => {
  const { IP, PORT } = await CONST

  const apiRouter = new Router({ prefix: '/api' })

  const whiteList = [
    `${IP}:${PORT}`,
    `http://localhost:${PORT}`,
    `http://127.0.0.1:5173`
  ]
  app.use(async (ctx, next) => {
    console.log(ctx.header.origin)
    if (whiteList.includes(ctx.header.origin)) {
      ctx.set('Access-Control-Allow-Origin', '*')
      ctx.set('Access-Control-Allow-Headers', '*')
    }
    await next()
  })

  let message = ''
  apiRouter
    .get('/message', async (ctx, next) => {
      ctx.body = message
    })
    .post('/message', async (ctx, next) => {
      if (typeof ctx.request.body?.message === 'string') {
        message = ctx.request.body.message
      }
      ctx.body = 'ok'
    })

  app.use(body())

  router.use(apiRouter.routes(), apiRouter.allowedMethods())
  app.use(router.routes()).use(router.allowedMethods())
  app.use(serve(path.resolve(__dirname, '../client/dist/')))

  // app.use(async (ctx, next) => {
  //   const prefix = ctx.url.split('/')
  // })

  app.on('error', e => {
    console.log(e)
  })

  app.listen(PORT, () => {
    console.log('ok ', PORT)
  })
})()
