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
  }
}
