const Koa = require('koa')
const Router = require('koa-router')
const body = require('koa-body')
const app = new Koa()
const router = new Router()

const whiteList = ['localhost:5500', 'http://127.0.0.1:5173']
app.use(async (ctx, next) => {
  if (whiteList.includes(ctx.header.origin)) {
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set('Access-Control-Allow-Headers', '*')
  }
  await next()
})

let message = ''
router
  .get('/message', async (ctx, next) => {
    console.log('2')
    ctx.body = message
  })
  .post('/message', async (ctx, next) => {
    console.log(ctx.request.body)
    if (typeof ctx.request.body?.message === 'string') {
      message = ctx.request.body.message
    }
    ctx.body = 'ok'
  })

app.use(body())
app.use(router.routes()).use(router.allowedMethods())

app.on('error', e => {
  console.log(e)
})

app.listen(5500, () => {
  console.log('ok 5500')
})
