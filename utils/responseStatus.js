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
    this.response.send({
      code: 200,
      message: this.message,
      type: this.type,
      data: this.data
    })
  }
  error() {
    this.response.send({
      code: 500,
      message: this.message
    })
  }
}
