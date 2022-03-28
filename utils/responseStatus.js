/**
 * @description 返回状态
 * @author Jinx
 * @date 2022-01-29 15:12:19
 * @export
 * @class ResponseStatus
 */
export default class ResponseStatus {
  constructor(response, { message, type, data }) {
    this.response = response
    this.message = message
    this.type = type
    this.data = data
  }
  success() {
    this.response.status(200).send({
      code: 200,
      message: this.message,
      type: this.type,
      data: this.data
    })
  }
  error() {
    this.response.status(200).send({
      code: 500,
      message: this.message
    })
  }
  unpermission() {
    this.response.status(401).send({
      code: 401,
      message: this.message
    })
  }
}
