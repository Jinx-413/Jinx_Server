const adminVerify = {
  userNamePattern: {
    value: /^[a-zA-Z0-9_-]{4,16}$/,
    msg: '4到16字符，可以是字母，数字，下划线，减号'
  }, // 用户名正则
  passwordPattern: {
    value: /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/,
    msg: '最少6位，包括至少1个大写字母，1个小写字母，1个数字'
  } // 密码正则
}

export default adminVerify
