import 'dotenv/config'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import {APP_NAME} from '@second-piece/shared/sharedConstants'

const app = new Koa()
const router = new Router()

router.get('/api/health', (ctx) => {
  ctx.body = {status: 'ok', name: APP_NAME}
})

app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
