import axios from "axios"
import Formidable from "formidable"
import configLite from 'config-lite'
import readisUtils from "../../utils/redis"
import ResponseStatus from "../../utils/responseStatus"


const config = configLite(__dirname)

class Template {
  constructor() {
    this.getAccessToken = this.getAccessToken.bind(this)
    this.getUserList = this.getUserList.bind(this)
  }
  async getAccessToken(req, res) {
    // 获取Access token
    const form = new Formidable.IncomingForm()
    form.parse(req, async(error, fields) => {
      if (!error) {
        const params = {
          grant_type: 'client_credential',
          ...config.wxCode
        }
        try {
          const { data } = await axios({
            url: 'https://api.weixin.qq.com/cgi-bin/token',
            params
          })
          const { access_token, expires_in } = data
          // token 获取成功 存到Redis
          await readisUtils.client.set('wx_access_token', access_token, err => {
            if(!err) {
              new ResponseStatus(res, {
                message: '获取成功'
              }).success()
            }
          })
          readisUtils.client.expire('wx_access_token', expires_in) // expires_in 秒后 清除token
        } catch (error) {
          new ResponseStatus(res, error).error()
          return
        }
      }
    })
  }

  async getUserList() {
    readisUtils.client.get('wx_access_token', async(err, access_token)=> {
      if(!err) {
        try {
          const { data } = await axios({
            url: 'https://api.weixin.qq.com/cgi-bin/user/get',
            params: { access_token }
          })
          console.log(data)
        } catch (error) {
          new ResponseStatus(res, error).error()
          return
        }
      }
    })
  }
}

export default new Template()
