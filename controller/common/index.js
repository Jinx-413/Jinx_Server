import ToolUtils from '../../utils/tool'
import svgCaptcha from 'svg-captcha'
import readisUtils from '../../utils/redis'
import ResponseStatus from '../../utils/responseStatus'
import Formidable from 'formidable'
import path from 'path'
import fs from 'fs'

/**
 * @description tool公共类
 * @author Jinx
 * @date 2022-03-25 15:34:22
 * @class Common
 */
class Common {
  constructor() {
    this.basePath = '../../public'
    this.baseExists = 'file'

    this.captcha = this.captcha.bind(this)
    this.uploadFile = this.uploadFile.bind(this)
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

    readisUtils.client.expire(`captcha-code-${uuid}`, 60) // 一分钟后清除二维码
  }

  /**
   * @description 文件上传
   * @author Jinx
   * @date 2022-03-29 15:20:05
   * @param {*} req
   * @param {*} res
   * @param {function} next
   * @memberof Common
   */
  async uploadFile(req, res, next) {
    const form = new Formidable.IncomingForm()
    form.parse(req, (err, fields, { file }) => {
      if (!err) {
        if (!file) {
          new ResponseStatus(res, { message: '错误！没有检索到上传文件，请查看是否已经上传' }).error()
        }
        const yearNow = ToolUtils.parseTime(new Date().getTime(), '{y}') // 获取当前年份
        const dateNow = ToolUtils.parseTime(new Date().getTime(), '{m}-{d}') // 当前日期
        try {
          const isDirectory = fs.existsSync(path.join(__dirname, `${this.basePath}/${this.baseExists}`))
          // 判断系统有无file文件夹，没有就生成
          if (!isDirectory) {
            fs.mkdirSync(path.join(__dirname, `${this.basePath}/${this.baseExists}`))
          }

          const isDirectoryYear = fs.existsSync(path.join(__dirname, `${this.basePath}/${this.baseExists}/${yearNow}`))
          // 判断系统有无当前年份文件夹，没有就生成
          if (!isDirectoryYear) {
            fs.mkdirSync(path.join(__dirname, `${this.basePath}/${this.baseExists}/${yearNow}`))
          }

          const isDirectoryDate = fs.existsSync(path.join(__dirname, `${this.basePath}/${this.baseExists}/${yearNow}/${dateNow}`))
          // 判断系统有无当前日期文件夹，没有就生成
          if (!isDirectoryDate) {
            fs.mkdirSync(path.join(__dirname, `${this.basePath}/${this.baseExists}/${yearNow}/${dateNow}`))
          }
        } catch (error) {
          console.error(error)
        }

        // 获取文件后缀 生成自定义名称
        const suffix = file.originalFilename.slice(file.originalFilename.indexOf('.'))

        const fileName = `${ToolUtils.getUUID()}${suffix}`

        const originalFilename = path.join(__dirname, `${this.basePath}/${this.baseExists}/${yearNow}/${dateNow}/${fileName}`)
        fs.readFile(file.filepath, (fsErr, fsData) => {
          if (!fsErr) {
            fs.writeFile(originalFilename, fsData, writeErr => {
              if (!writeErr) {
                new ResponseStatus(res, { message: '上传成功', data: {
                  path: `/${this.baseExists}/${yearNow}/${dateNow}/${fileName}`
                }}).success()
              } else {
                new ResponseStatus(res, { message: '上传失败' }).error()
              }
            })
          } else {
            new ResponseStatus(res, { message: '上传失败' }).error()
          }
        })
      }
    })
  }
}

export default new Common()
