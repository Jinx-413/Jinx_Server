import admin from './modules/admin'
import common from './modules/common'

export default app => {
  app.use('/admin', admin)
  app.use('/common', common)
}
