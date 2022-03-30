import mysql from 'mysql'
import configLite from 'config-lite'

/**
 * @description mysal工具类
 * @author Jinx
 * @date 2022-03-29 15:44:47
 * @export
 * @class MysqlConnection
 */
export default class MysqlConnection {
  constructor() {
    this.config = configLite(__dirname)
    this.connection = mysql.createConnection({ ...this.config.mysql })
  }
}
