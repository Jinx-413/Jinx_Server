/**
 * @description 查询用户名
 * @author Jinx
 * @date 2022-03-25 14:41:57
 * @export
 * @param {*} userName
 * @returns {*}
 */
export function userExistMapper(userName) {
  return `SELECT password FROM sys_user WHERE user_name='${userName}';`
}

/**
 * @description 插入用户
 * @author Jinx
 * @date 2022-03-25 14:42:14
 * @export
 * @param {*} obj
 * @returns {*}
 */
export function registerMapper(obj) {
  const insetArr = []
  for (const i in obj) {
    insetArr.push(i.replace(/([A-Z])/g, '_$1'))
  }

  const values = Array.from({ length: insetArr.length }).map(item => '?').join(',')

  return {
    addSql: `INSERT INTO sys_user (id,${insetArr.join(',')}) VALUES (0,${values})`,
    addSqlParams: Object.values(obj)
  }
}
