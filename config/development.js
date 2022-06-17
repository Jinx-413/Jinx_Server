'use strict'

module.exports = {
  mysql: {
    host: 'localhost',
    user: 'Jinx',
    password: 'Jinx520.',
    port: 3306,
    database: 'test'
  },
  session: {
    name: 'jinx',
    keys: ['jj', 'ii', 'nn', 'xx'],
    maxAge: 1000 * 60 * 60 * 24 // 保留cookie的时间
  },
  redis: {
    host: '127.0.0.1',
    prot: '6379',
    password: ''
  },
  wxCode: {
    appid: 'wx1bced38180e25487',
    secret: '963b78f948f254f832a6b19a681f0946'
  }
}
