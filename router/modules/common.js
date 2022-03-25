import express from 'express'

import Common from '../../controller/common'
const router = express.Router()

router.get('/captcha', Common.captcha) // 获取验证码

export default router

