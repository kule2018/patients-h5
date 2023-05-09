<template>
  <div class="login-page">
    <!-- TODO 使用了 unplugin-vue-components 默认 src/components 自动导入注册  -->
    <cp-nav-bar
      title="登录"
      @click-right="$router.push('/register')"
    ></cp-nav-bar>
    <!-- 头部 -->
    <div class="login-head">
      <h3>{{ isPass ? '密码登录' : '短信验证码登录' }}</h3>
      <a @click="isPass = !isPass" href="javascript:;">
        <span>{{ !isPass ? '密码登录' : '短信验证码登录' }}</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- 表单 -->
    <VanForm autocapitalize="false" @submit="login">
      <VanField
        v-model="mobile"
        name="mobile"
        :rules="mobileRules"
        placeholder="请输入手机号"
        type="tel"
      ></VanField>
      <VanField
        v-if="isPass"
        v-model="password"
        :rules="passwordRules"
        placeholder="请输入密码"
        :type="show ? 'text' : 'password'"
      >
        <template #button>
          <!-- TODO 通过 svg 标签 #icon-文件夹名称-图片名称 指定图片，理解 精灵图定位坐标 -->
          <cp-icon
            @click="show = !show"
            :name="`login-eye-${show ? 'on' : 'off'}`"
          ></cp-icon>
        </template>
      </VanField>
      <van-field
        v-else
        :rules="codeRules"
        v-model="code"
        placeholder="短信验证码"
      >
        <template #button>
          <span class="btn-send" :class="{ active: time > 0 }" @click="send">
            {{ time > 0 ? `${time}s后再次发送` : '发送验证码' }}
          </span>
        </template>
      </van-field>
      <div class="cp-cell">
        <VanCheckbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </VanCheckbox>
      </div>

      <div class="cp-cell">
        <van-button native-type="submit" block round type="primary"
          >登 录</van-button
        >
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </VanForm>
    <!-- 底部 -->
    <div class="login-other">
      <van-divider>第三方登录</van-divider>
      <div class="icon">
        <img src="@/assets/qq.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { loginByPassword, sendMobileCode } from '@/services/user'
import { useUserStore } from '@/stores'
import { codeRules, mobileRules, passwordRules } from '@/utils/rules'
import { showSuccessToast, showToast, type FormInstance } from 'vant'
import { onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const store = useUserStore()
const router = useRouter()
const route = useRoute()
const form = ref<FormInstance>()

const agree = ref()
const password = ref('abc12345')
const mobile = ref('13211112222')
const code = ref('')
const time = ref()
let timeId: number
const isPass = ref(true) // 切换数据
const show = ref(false)

//组件卸载关闭定时器
//定时器相关函数是 window 去调用，因为 node 也有定时器返回类型不一样
onUnmounted(() => window.clearInterval(timeId))

const login = async () => {
  if (!agree.value) return showToast('请勾选我已同意')
  // 登录
  const res = await loginByPassword(mobile.value, password.value)
  store.setUser(res.data)
  router.push((route.query.returnUrl as string) || '/user')
  showSuccessToast('登录成功')
}

async function send() {
  if (time.value > 0) return
  // 验证不通过报错，阻止程序继续执行
  await form.value?.validate('mobile')
  await sendMobileCode(mobile.value, 'login')
  showSuccessToast('发送成功')
  time.value = 60
  // 倒计时
  clearInterval(timeId)
  timeId = window.setInterval(() => {
    time.value--
    if (time.value <= 0) window.clearInterval(timeId)
  }, 1000)
}
</script>

<style lang="scss" scoped>
.login {
  &-page {
    padding-top: 40px;
  }
  &-head {
    display: flex;
    padding: 30px 30px 50px;
    justify-content: space-between;
    align-items: flex-end;
    //TODO 行高的值为1，表示行框盒子的高度等于字体大小
    line-height: 1;
    h3 {
      font-weight: normal;
      font-size: 24px;
    }
    a {
      font-size: 15px;
    }
  }
  &-other {
    margin-top: 60px;
    padding: 0 30px;
    .icon {
      display: flex;
      justify-content: center;
      img {
        width: 36px;
        height: 36px;
        padding: 4px;
      }
    }
  }
}
.van-form {
  padding: 0px 14px;
  .cp-cell {
    height: 52px;
    line-height: 24px;
    padding: 14px 16px;
    align-items: center;
    .van-checkbox {
      a {
        color: var(--cp-primary);
        padding: 0 5px;
      }
    }
  }
  .btn-send {
    color: var(--cp-primary);
    &.active {
      color: rgba(22, 194, 163, 0.5);
    }
  }
}
</style>
