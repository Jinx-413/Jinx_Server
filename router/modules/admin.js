import express from 'express'

import Admin from '../../controller/admin'
import AdminRole from '../../controller/admin/role'
import authorization from '../../middleware/authorization'
const router = express.Router()

router.post('/login', Admin.login) // 用户登录
router.post('/register', Admin.register) // 用户注册
router.post('/userExist', Admin.userExist) // 用户名是否存在

router.get('/role', authorization, AdminRole.getRole) // 查询角色列表

export default router

