import AdminModel from '../model/admin'
import JsonWebTokenUtils from '../utils/jwt'
import ResponseStatus from '../utils/responseStatus'

/**
 * @description token验证中间件
 * @author Jinx
 * @date 2022-03-25 14:41:57
 * @export
 * @param {*} req
 * @param {*} res
 * @param {function} next
 * @returns {*}
 */
export default async(req, res, next) => {
  // 1.从请求头里获取token
  const token = req.headers['authorization'] || ''
  if (!token) {
    return new ResponseStatus(res, { message: '错误！token不存在' }).unpermission()
  }

  try {
    const jwt = new JsonWebTokenUtils(token)
    const { _id } = await jwt.verifyToken()
    const isUser = await new AdminModel(_id, token).findUserTokenById()

    if (!isUser) {
      throw new Error('错误！token验证失败')
    }
    // 验证token
    next()
  } catch (error) {
    return new ResponseStatus(res, { message: '错误！token验证失败' }).unpermission()
  }
}

