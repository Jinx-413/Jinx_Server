/**
 * @description 返回状态
 * @author Jinx
 * @date 2022-01-29 15:12:19
 * @export
 * @class ResponseStatus
 */
export default class ResponseStatus {
  constructor(response, { message, type, data }, prop) {
    this.response = response
    this.message = message
    this.type = type
    this.data = data
    this.prop = prop || {}
  }
  /**
   * @description 成功状态
   * @author Jinx
   * @date 2022-03-29 15:43:26
   * @memberof ResponseStatus
   */
  success() {
    this.response.status(200).send({
      code: 200,
      message: this.message,
      type: this.type,
      data: this.data,
      ...this.prop
    })
  }
  /**
   * @description 错误状态
   * @author Jinx
   * @date 2022-03-29 15:43:30
   * @memberof ResponseStatus
   */
  error() {
    this.response.status(200).send({
      code: 500,
      message: this.message
    })
  }
  /**
   * @description 用户信息失效
   * @author Jinx
   * @date 2022-03-29 15:43:39
   * @memberof ResponseStatus
   */
  unpermission() {
    this.response.status(401).send({
      code: 401,
      message: this.message
    })
  }
}
