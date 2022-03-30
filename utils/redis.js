import * as Redis from 'redis'

import configLite from 'config-lite'
const redisDbconfig = configLite(__dirname).redis

/**
 * @description redeis工具类
 * @author Jinx
 * @date 2022-03-29 15:43:53
 * @class ReadisUtils
 */
class ReadisUtils {
  constructor() {
    this.Redis = Redis
    this.RDS_PROT = redisDbconfig.prot
    this.RDS_HOST = redisDbconfig.host
    this.RDS_PWD = redisDbconfig.password
    this.RDS_OPTS = { auth_pass: this.RDS_PWD }

    this.client = Redis.createClient(this.RDS_PROT, this.RDS_HOST)
  }

  /**
   * @description redis初始化
   * @author Jinx
   * @date 2022-03-29 15:44:06
   * @memberof ReadisUtils
   */
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

