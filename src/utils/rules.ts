// TODO 手机号验证正则
// 以数字1开头，后面跟着3-9之间的任意一个数字，再后面跟着9个数字，总共11位数字。如果符合这个格式，就会返回true，否则返回false
const mobileRules = [
  {
    required: true,
    message: '请输入手机号'
  },
  {
    pattern: /^1[3-9]\d{9}$/,
    message: '手机号格式不正确'
  }
]

const passwordRules = [
  { required: true, message: '请输入密码' },
  { pattern: /^\w{8,24}$/, message: '密码需8-24个字符' }
]

const codeRules = [
  {
    required: true,
    message: '请输入验证码'
  },
  {
    pattern: /^\d{6}$/,
    message: '验证码6个数字'
  }
]

export { mobileRules, passwordRules, codeRules }

