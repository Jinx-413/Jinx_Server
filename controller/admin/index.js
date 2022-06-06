import Formidable from 'formidable'
import md5 from 'md5'
import MysqlConnection from '../../utils/mysql'
import ResponseStatus from '../../utils/responseStatus'
import adminVerify from '../../verify/admin'
import readisUtils from '../../utils/redis'
import * as adminMapper from '../../mapper/admin'
import JsonWebTokenUtils from '../../utils/jwt'
import ToolUtils from '../../utils/tool'

/**
 * @description 系统基础模块
 * @author Jinx
 * @date 2022-02-07 08:44:33
 * @class Admin
 */
class Admin {
  constructor() {
    this.login = this.login.bind(this)
    this.register = this.register.bind(this)
    this.userExistMethods = this.userExistMethods.bind(this)
    this.userExist = this.userExist.bind(this)
  }

  /**
   * @description 登录
   * @author Jinx
   * @date 2022-02-07 08:44:16
   * @param {*} req
   * @param {*} res
   * @param {function} next
   * @memberof Admin
   */
  async login(req, res, next) {
    const form = new Formidable.IncomingForm()
    form.parse(req, async(err, fields) => {
      if (!err) {
        const { userName, password, captcha, uuid } = fields

        if (!uuid) {
          new ResponseStatus(res, { message: 'uuid不能为空' }).error()
          return
        }

        readisUtils.client.get(`captcha-code-${uuid}`, async(err, captcha_code) => {
          if (!err) {
            // 是否输入用户名密码
            try {
              if (!userName) {
                throw new Error('请输入用户名')
              } else if (!password) {
                throw new Error('请输入密码')
              } else if (!captcha) {
                throw new Error('请输入验证码')
              } else if (String(captcha_code).toLocaleLowerCase() !== String(captcha).toLocaleLowerCase()) {
                throw new Error('您输入的验证码不正确')
              }
            } catch (error) {
              new ResponseStatus(res, { message: error.message }).error()
              return
            }

            const mysql = new MysqlConnection()
            mysql.connection.connect()

            // 判断用户名是否存在
            const sql_user = adminMapper.userExistMapper(userName)
            mysql.connection.query(sql_user, async(err, result) => {
              if (!err) {
                if (result.length) {
                  // 判断用户名密码是否正确
                  if (md5(password) === result[0].password) {
                    // 登录成功 返回token
                    const _id = result[0].id.toString()
                    const jwt = new JsonWebTokenUtils({ _id })
                    const token = jwt.generateToken()

                    // 存到redis
                    await readisUtils.client.set(`jwt_${_id}`, token, err => {
                      if (!err) {
                        new ResponseStatus(res, {
                          message: '登录成功',
                          data: {
                            token
                          }
                        }).success()
                      }
                    })
                    readisUtils.client.expire(`jwt_${_id}`, 604800) // 7天后清除token
                  } else {
                    new ResponseStatus(res, { message: '用户名或密码错误' }).error()
                    return
                  }
                } else {
                  new ResponseStatus(res, { message: '该用户不存在' }).error()
                  return
                }
                mysql.connection.end()
              }
            })
          }
        })
      }
    })
  }

  async getUserInfo(req, res, next) {

  }

  /**
   * @description 用户名是否存在
   * @author Jinx
   * @date 2022-03-25 15:06:05
   * @param {*} req
   * @param {*} res
   * @memberof Admin
   */
  async userExist(req, res) {
    const form = new Formidable.IncomingForm()
    form.parse(req, async(err, fields) => {
      if (!err) {
        const isUser = await this.userExistMethods(fields.userName)
        if (isUser) {
          new ResponseStatus(res, { message: '用户名已存在' }).error()
        } else {
          new ResponseStatus(res, { message: '' }).success()
        }
      }
    })
  }

  /**
   * @description 判断用户名是否存在
   * @author Jinx
   * @date 2022-03-25 15:05:44
   * @param {*} userName
   * @returns {*} Boolean
   * @memberof Admin
   */
  async userExistMethods(userName) {
    return new Promise((resolve, reject) => {
      const mysql = new MysqlConnection()
      mysql.connection.connect()

      const sql_user = adminMapper.userExistMapper(userName)
      mysql.connection.query(sql_user, (err, result) => {
        if (!err) {
          resolve(result.length)
        } else {
          resolve(false)
        }
      })
    })
  }

  /**
   * @description 注册
   * @author Jinx
   * @date 2022-03-25 15:05:35
   * @param {*} req
   * @param {*} res
   * @param {function} next
   * @memberof Admin
   */
  async register(req, res, next) {
    const form = new Formidable.IncomingForm()
    form.parse(req, async(err, fields) => {
      if (!err) {
        const { userName, password, confirmPassword, captcha, uuid } = fields

        const { userNamePattern, passwordPattern } = adminVerify
        if (!uuid) {
          new ResponseStatus(res, { message: 'uuid不能为空' }).error()
          return
        }

        readisUtils.client.get(`captcha-code-${uuid}`, async(err, captcha_code) => {
          if (!err) {
            try {
              if (!userName) {
                throw new Error('请输入用户名')
              } else if (!userNamePattern.value.test(userName)) {
                throw new Error(`用户名${userNamePattern.msg}`)
              } else if (!password) {
                throw new Error('请输入密码')
              } else if (!confirmPassword) {
                throw new Error('请再次输入密码')
              } else if (password !== confirmPassword) {
                throw new Error('两次密码不一致')
              } else if (!passwordPattern.value.test(password) || !passwordPattern.value.test(confirmPassword)) {
                throw new Error(`密码${passwordPattern.msg}`)
              } else if (!captcha) {
                throw new Error('请输入验证码')
              } else if (String(captcha_code).toLocaleLowerCase() !== String(captcha).toLocaleLowerCase()) {
                throw new Error('您输入的验证码不正确')
              }
            } catch (error) {
              new ResponseStatus(res, { message: error.message }).error()
              return
            }

            // 判断用户名是否存在
            const isUser = await this.userExistMethods(userName)
            if (isUser) {
              new ResponseStatus(res, { message: '用户名已存在' }).error()
              return
            }

            // 存数据库

            const mysql = new MysqlConnection()
            mysql.connection.connect()

            const sql_register = adminMapper.registerMapper({
              userName,
              password: md5(password),
              createTime: ToolUtils.parseTime(new Date()),
              createBy: 'register'
            })

            mysql.connection.query(sql_register.addSql, sql_register.addSqlParams, (err, result) => {
              if (!err) {
                new ResponseStatus(res, {
                  message: '注册成功',
                  data: {
                    userName
                  }
                }).success()
                mysql.connection.end()
              } else {
                new ResponseStatus(res, { message: err }).error()
              }
            })
          } else {
            console.error('error! 获取验证码失败')
            new ResponseStatus(res, { message: '服务端错误-获取验证码失败' }).error()
            return
          }
        })
      }
    })
  }
}

export default new Admin()
