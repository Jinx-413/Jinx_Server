import mysql from 'mysql'
import configLite from 'config-lite'

export default class MysqlConnection {
  constructor() {
    this.config = configLite(__dirname)
    this.connection = mysql.createConnection({ ...this.config.mysql })
  }
}
