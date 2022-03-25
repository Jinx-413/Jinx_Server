import ToolUtils from '../../utils/tool'
import svgCaptcha from 'svg-captcha'
import readisUtils from '../../utils/redis'
import ResponseStatus from '../../utils/responseStatus'

/**
 * @description tool公共类
 * @author Jinx
 * @date 2022-03-25 15:34:22
 * @class Common
 */
class Common {
  constructor() {
    this.captcha = this.captcha.bind(this)
  }
  /**
   * @description 获取验证码
   * @author Jinx
   * @date 2022-03-25 15:34:39
   * @param {*} req
   * @param {*} res
   * @memberof Common
   */
  async captcha(req, res) {
    const codeConfig = {
      size: 6, // 验证码长度
      ignoreChars: '0oO1ilI', // 验证码字符中排除 0oO1ilI
      noise: 3, // 干扰线条数量
      width: 160,
      height: 50,
      fontSize: 50,
      color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
      background: 'rgba(255, 255, 255, 0)' // 背景色
    }

    const captcha = svgCaptcha.create(codeConfig)
    // 获取随机uuid
    const uuid = ToolUtils.getUUID()

    await readisUtils.client.set(`captcha-code-${uuid}`, captcha.text.toLocaleLowerCase(), err => {
      // 把验证码 存储到redis
      if (!err) {
        console.log(captcha.text)
        res.type('svg')
        new ResponseStatus(res, {
          message: '获取成功',
          data: {
            captcha: captcha.data,
            uuid
          }
        }).success()
      } else {
        new ResponseStatus(res, { message: '获取验证码出现一些小问题' }).error()
      }
    })

    readisUtils.client.expire(`captcha-code-${uuid}`, 3600) // 一分钟后清除二维码
  }
}

export default new Common()
