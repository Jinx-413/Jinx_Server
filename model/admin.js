import readisUtils from '../utils/redis'
/**
 * @description 管理模块
 * @author Jinx
 * @date 2022-03-28 13:58:47
 * @class AdminModel
 */
class AdminModel {
  constructor(id, token) {
    this.id = id
    this.token = token
  }
  /**
   * @description 根据id判断该用户token
   * @author Jinx
   * @date 2022-03-28 13:59:04
   * @returns {*}
   * @memberof AdminModel
   */
  async findUserTokenById() {
    return new Promise((resolve, reject) => {
      readisUtils.client.get(`jwt_${this.id}`, (err, res) => {
        if (!err) {
          resolve(res === this.token)
        } else {
          reject(err)
        }
      })
    })
  }
}

export default AdminModel
