const path = require('path')
const fs = require('fs')
const Koa = require('koa')
const Router = require('koa-router')
const body = require('koa-body')
const serve = require('koa-static')
const app = new Koa()
const router = new Router()
const CONST = import('../shared/const.mjs')
const { exec } = require('child_process')

const clientDir = path.resolve(__dirname, '../client/dist/')
const [isDev] = process.argv.slice(2)


;(async () => {
  const { IP, PORT, DIR_ROOT } = await CONST
  const url = `http://${IP}:${PORT}`
  let isNeedRePack = false

  const dist = path.resolve(clientDir, 'assets')
  if (!fs.existsSync(dist)) {
    isNeedRePack = true
  } else {
    const fileNames = fs.readdirSync(dist)

    console.log('pre-checking')
    if (fileNames.length > 0) {
      for (const fileName of fileNames) {
        if (fileName.endsWith('.js')) {
          const content = fs.readFileSync(
            path.resolve(clientDir, 'assets', fileName),
            'utf-8'
          )

          isNeedRePack = !content.includes(url)
        }
      }
    } else {
      isNeedRePack = true
    }
  }

  if (isDev || isNeedRePack) {
    try {
      await new Promise((resolve, reject) => {
        console.log('\n> building source\n')
        exec(
          `${DIR_ROOT}: && cd ${path.resolve(
            __dirname,
            '../../'
          )} && pnpm run client:build`,
          (err,p) => {
            if (err) {
              console.log(err)
              reject(err)
            } else {
              resolve()
            }
          }
        )
      })
    } catch {
      console.log('请手动更新客户端')
      return
    }
  }

  const apiRouter = new Router({ prefix: '/api' })

  const whiteList = [
    `${IP}:${PORT}`,
    `http://localhost:${PORT}`,
    `http://127.0.0.1:${PORT}`,
    `http://127.0.0.1:5173`
  ]
  app.use(async (ctx, next) => {
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
  app.use(serve(clientDir))

  // app.use(async (ctx, next) => {
  //   const prefix = ctx.url.split('/')
  // })

  app.on('error', e => {
    console.log(e)
  })

  app.listen(PORT, () => {
    console.log('ok ', url)
  })
})()
