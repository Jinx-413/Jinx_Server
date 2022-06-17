import express from 'express'
import Template from '../../controller/template'

const router = express.Router()

router.get('/getAccessToken', Template.getAccessToken) // 获取验证码
router.get('/getUserList', Template.getUserList) // 获取用户列表

export default router

