import admin from './modules/admin'
import common from './modules/common'
import template from './modules/template'

export default app => {
  app.use('/admin', admin)
  app.use('/common', common)
  app.use('/template', template)
}
