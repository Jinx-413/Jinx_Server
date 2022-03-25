import express from 'express'
import configLite from 'config-lite'
import router from './router'
import connectHistoryApiFallback from 'connect-history-api-fallback'
import session from 'cookie-session'
import readisUtils from './utils/redis'

const app = express()
const config = configLite(__dirname)
const history = connectHistoryApiFallback()

// express中是把session信息存储在内存中
// 配置session
app.use(session(config.session))

app.all('*', (request, response, next) => {
  const { origin, Origin, referer, Referer } = request.headers
  const allowOrigin = origin || Origin || referer || Referer || '*'
  response.header('Access-Control-Allow-Origin', allowOrigin)
  response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  response.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
  response.header('Access-Control-Allow-Credentials', true) // 可以带cookies
  response.header('X-Powered-By', 'Express')
  if (request.method === 'OPTIONS') {
    response.sendStatus(200)
  } else {
    next()
  }
})

router(app)

readisUtils.init()

app.use(history)
app.use(express.static('./public'))

app.listen(config.port, () => {
  console.log(`成功监听端口：${config.port}`)
})
