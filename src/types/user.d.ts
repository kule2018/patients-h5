// 用户信息
export type User = {
  /** token令牌 */
  token: string
  /** 用户ID */
  id: string
  /** 用户名称 */
  account: string
  /** 手机号 */
  mobile: string
  /** 头像 */
  avatar: string
}

// 短信验证码类型，登录|注册|修改手机号|忘记密码|绑定手机号
export type CodeType =
  | 'login'
  | 'register'
  | 'changeMobile'
  | 'forgetPassword'
  | 'bindMobile'

type Person = {
  name: string
  age: number
}
// TODO Pick 可以从一个对象类型中 取出某些属性
type PickPerson = Pick<Person, 'age'>
// TODO Omit 可以从一个对象类型中 排出某些属性
type OmitPerson = Omit<Person, 'age'>

// 个人信息
type OmitUser = Omit<User, 'token'>
export type UserInfo = OmitUser & {
  likeNumber: number // 关注
  collectionNumber: number // 收藏
  score: number //积分
  couponNumber: number // 优惠券
  orderInfo: {
    paidNumber: number // 待付款
    receivedNumber: number // 代发货
    shippedNumber: number //待收货
    finishedNumber: number
  }
}

// 家庭档案-患者信息
export type Patient = {
  /** 患者ID */
  id?: string
  /** 患者名称 */
  name: string
  /** 身份证号 */
  idCard: string
  /** 0不默认  1默认 */
  defaultFlag: 0 | 1
  /** 0 女  1 男 */
  gender: 0 | 1
  /** 性别文字 */
  genderValue?: string
  /** 年龄 */
  age?: number
}

// 家庭档案-患者信息列表
export type PatientList = Patient[]
