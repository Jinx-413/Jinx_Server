import express from 'express'

import Admin from '../../controller/admin'
const router = express.Router()

router.post('/login', Admin.login) // 用户登录
router.post('/register', Admin.register) // 用户注册
router.post('/userExist', Admin.userExist) // 用户名是否存在

export default router

