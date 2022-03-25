import * as Redis from 'redis'

import configLite from 'config-lite'
const redisDbconfig = configLite(__dirname).redis

class ReadisUtils {
  constructor() {
    this.Redis = Redis
    this.RDS_PROT = redisDbconfig.prot
    this.RDS_HOST = redisDbconfig.host
    this.RDS_PWD = redisDbconfig.password
    this.RDS_OPTS = { auth_pass: this.RDS_PWD }

    this.client = Redis.createClient(this.RDS_PROT, this.RDS_HOST)
  }

  init() {
    this.client.on('ready', res => {
      console.log('redis ready!')
    })

    this.client.on('end', err => {
      console.log('redis end!')
      throw new Error(err)
    })

    this.client.on('error', err => {
      console.error('redis error!')
      throw new Error(err)
    })

    this.client.on('connect', () => {
      console.log('redis connect success!')
    })
  }
}

export default new ReadisUtils()

