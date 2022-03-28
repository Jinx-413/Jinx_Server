import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'

/**
 * @description token 工具类
 * @author Jinx
 * @date 2022-03-28 09:24:33
 * @class JsonWebTokenUtils
 */
class JsonWebTokenUtils {
  constructor(data) {
    this.data = data
  }

  /**
   * @description 生产token
   * @author Jinx
   * @date 2022-03-28 09:24:23
   * @returns {*}
   * @memberof JsonWebTokenUtils
   */
  generateToken() {
    const data = this.data
    const created = Math.floor(Date.now() / 1000) // 当前时间
    const cert = fs.readFileSync(path.join(__dirname, '../bin/private_key.pem')) // 私钥 可以自己生成

    const token = jwt.sign(data, cert, {
      expiresIn: created + 60 * 30
    })
    return token
  }

  /**
   * @description 校验token
   * @author Jinx
   * @date 2022-03-28 09:37:38
   * @returns {*}
   * @memberof JsonWebTokenUtils
   */
  verifyToken() {
    const data = this.data
    const cert = fs.readFileSync(path.join(__dirname, '../bin/public_key.pem')) // 公钥 可以自己生成
    let res
    try {
      const result = jwt.verify(data, cert, { algorithm: ['RS256'] }) || {}
      const { expiresIn = 0 } = result
      const current = Math.floor(Date.now() / 1000)
      if (current <= expiresIn) {
        res = result.data || {}
      }
    } catch (error) {
      res = 'err'
    }

    return res
  }
}

export default JsonWebTokenUtils
