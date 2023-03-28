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
const multer = require('@koa/multer')

const upload = multer()

const clientDir = path.resolve(__dirname, '../client/dist/')
const isDev = process.argv.includes('-re')
const rootDir = path.resolve(process.cwd())
let config = {}

if (fs.existsSync(path.join(rootDir, 'my-share.config.js'))) {
  config = require(path.join(rootDir, 'my-share.config.js'))
}

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
          (err, p) => {
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
    `http://127.0.0.1:${PORT}`
  ]

  if (Array.isArray(config.whiteList)) {
    whiteList.push(...config.whiteList)
  }

  app.use(async (ctx, next) => {
    if (whiteList.includes(ctx.header.origin)) {
      ctx.set('Access-Control-Allow-Origin', '*')
      ctx.set('Access-Control-Allow-Headers', '*')
    }
    await next()
  })

  let message = ''
  let cache = {}
  const getFileList = () => {
    return Object.keys(cache)
      .map(id => cache[id].info)
      .sort((a, b) => a.createAt - b.createAt)
  }

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
    .post('/upload-chunk', upload.single('buffer'), async (ctx, next) => {
      // console.log('ctx.request.files', ctx.request.files)
      // console.log('ctx.files', ctx.files)
      // console.log('ctx.file', ctx.file)
      // console.log('ctx.request.body', ctx.request.body)
      const { name, index, size } = ctx.request.body
      cache[name].file[index] = {
        buffer: ctx.file.buffer,
        name,
        index,
        size
      }

      ctx.body = 'ok'
    })
    .post('/upload-placeholder', async ctx => {
      const data = ctx.request.body

      if (cache[data.id]) {
        ctx.status = 404
        ctx.body = ''
        return
      }

      cache[data.id] = {
        info: data,
        file: {}
      }

      ctx.body = 'ok'
    })
    .post('/delete-file', async ctx => {
      const { id } = ctx.request.body
      delete cache[encodeURIComponent(id)]
      ctx.body = getFileList()
    })
    .post('/delete-all', async ctx => {
      cache = {}
      ctx.body = 'ok'
    })
    .get('/download', async ctx => {
      const { id: _id } = ctx.query
      const id = encodeURIComponent(_id)

      if (!cache[id]) {
        ctx.status = 404
        ctx.body = ''
        return
      }

      ctx.set('content-disposition', `attachment`)
      ctx.type = cache[id].info.type
      ctx.body = cache[id].mergedBuffer
    })
    .get('/download-lsit', async ctx => {
      ctx.body = getFileList()
    })
    .get('/success', async ctx => {
      const { id: _id } = ctx.query
      const id = encodeURIComponent(_id)

      if (!cache[id]) {
        ctx.status = 404
        ctx.body = ''
        return
      }

      const fileItem = cache[id]

      fileItem.info.status = 'success'
      fileItem.info.src = `/api/download?id=${id}`
      fileItem.mergedBuffer = Buffer.concat(
        Object.keys(fileItem.file)
          .sort((a, b) => Number(a) - Number(b))
          .map(i => fileItem.file[i].buffer)
      )

      ctx.body = fileItem.info
    })

  app.use(body())

  router.use(apiRouter.routes(), apiRouter.allowedMethods())
  app.use(router.routes()).use(router.allowedMethods())
  app.use(serve(clientDir))

  app.on('error', e => {
    console.log(e)
  })

  app.listen(PORT, () => {
    console.log('ok ', url)
  })
})()
