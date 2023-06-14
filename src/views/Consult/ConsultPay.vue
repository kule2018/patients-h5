<template>
  <div class="consult-pay-page">
    <cp-nav-bar title="支付" />
    <div class="pay-info">
      <p class="tit">图文问诊 49元</p>
      <img class="img" src="@/assets/avatar-doctor.svg" alt="" />
      <p class="desc">
        <span>极速问诊</span>
        <span>自动分配医生</span>
      </p>
    </div>
    <!--  -->
    <van-cell-group>
      <van-cell title="优惠券" value="-￥10.00" />
      <van-cell title="积分抵扣" value="-¥10.00" />
      <van-cell title="实付款" value="¥29.00" class="pay-price" />
    </van-cell-group>
    <!--  -->
    <div class="pay-space"></div>
    <van-cell-group>
      <van-cell title="患者信息" value="李富贵 | 男 | 30岁"></van-cell>
      <van-cell title="病情描述" label="头痛，头晕，恶心"></van-cell>
    </van-cell-group>
    <div class="pay-schema">
      <van-checkbox v-model="agree"
        >我已同意 <span class="text">支付协议</span></van-checkbox
      >
    </div>
    <van-submit-bar
      button-type="primary"
      :price="payInfo?.actualPayment"
      button-text="立即支付"
      text-align="left"
      :loading="loading"
      @click="submit"
    />
  </div>
  <!-- 抽屉 -->
  <van-action-sheet
    :close-on-popstate="false"
    v-model:show="show"
    title="选择支付方式"
  >
    <div class="pay-type">
      <p class="amount">￥{{ payInfo?.actualPayment.toFixed(2) }}</p>
      <van-cell-group>
        <van-cell title="微信支付" @click="paymentMethod = 0">
          <template #icon>
            <cp-icon name="consult-wechat" />
          </template>
          <template #extra>
            <van-checkbox :checked="paymentMethod == 0" />
          </template>
        </van-cell>
        <van-cell title="支付宝支付" @click="paymentMethod = 1">
          <template #icon>
            <cp-icon name="consult-alipay" />
          </template>
          <template #extra>
            <van-checkbox :checked="paymentMethod == 1" />
          </template>
        </van-cell>
      </van-cell-group>
      <div class="btn">
        <van-button @click="pay" type="primary" round block
          >立即支付</van-button
        >
      </div>
    </div>
  </van-action-sheet>
</template>

<script setup lang="ts">
import {
createConsultOrder,
getConsultOrderPayUrl,
getConsultOrderPre
} from '@/services/consult'
import { getPatientDetail } from '@/services/user'
import { useConsultStore } from '@/stores'
import type { ConsultOrderPreData, PartialConsult } from '@/types/consult'
import type { Patient } from '@/types/user'
import {
showConfirmDialog,
showDialog,
showLoadingToast,
showToast
} from 'vant'
import { onMounted, ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'

const router = useRouter()
const store = useConsultStore()
const payInfo = ref<ConsultOrderPreData>()
const loadData = async () => {
  const res = await getConsultOrderPre({
    type: store.consult.type,
    illnessType: store.consult.illnessType
  })
  payInfo.value = res.data

  // 设置默认优惠券
  store.setCoupon(payInfo.value.couponId)
}
const patient = ref<Patient>()
const loadPatient = async () => {
  if (!store.consult.patientId) return
  const res = await getPatientDetail(store.consult.patientId)
  patient.value = res.data
}
type Key = keyof PartialConsult

onMounted(() => {
  const validKeys: Key[] = [
    'type',
    'illnessType',
    'depId',
    'illnessDesc',
    'illnessTime',
    'consultFlag',
    'patientId'
  ]
  // 每个都要是正确的
  const valid = validKeys.every((key) => store.consult[key] !== undefined)
  if (!valid) {
    return showDialog({
      title: '温馨提示',
      message:
        '问诊信息不完整请重新填写，如有未支付的问诊订单可在问诊记录中继续支付！',
      closeOnPopstate: false
    }).then(() => {
      router.push('/')
    })
  }

  loadData()
  loadPatient()
})
onBeforeRouteLeave(() => {
  if (orderId.value) return false
})

const loading = ref(false)
const orderId = ref('')
const agree = ref(false)
const show = ref(false)
const paymentMethod = ref<0 | 1>()
const submit = async () => {
  if (!agree.value) return showToast('请勾选我已同意支付协议')
  loading.value = true
  console.log(store.consult)
  const res = await createConsultOrder(store.consult)
  // console.log(res)"6908841376153600"

  orderId.value = res.data.id
  loading.value = false
  store.clear()
  show.value = true
}
const onClose = () => {
  return showConfirmDialog({
    title: '关闭支付',
    message: '取消支付将无法获得医生回复，医生接诊名额有限，是否确认关闭？',
    cancelButtonText: '仍要关闭',
    confirmButtonText: '继续支付'
  })
    .then(() => {
      return false
    })
    .catch(() => {
      orderId.value = ''
      router.push('/user/consult')
      return true
    })
}
// 跳转支付
const pay = async () => {
  if (paymentMethod.value === undefined) return showToast('请选择支付方式')
  showLoadingToast({ message: '跳转支付', duration: 0 })
  const res = await getConsultOrderPayUrl({
    orderId: orderId.value,
    paymentMethod: paymentMethod.value,
    payCallback: 'http://localhost:5173/room'
  })
  console.log(res)

  window.location.href = res.data.payUrl
}
</script>

<style lang="scss" scoped>
.consult-pay-page {
  padding: 46px 0 50px 0;
}
.pay-info {
  display: flex;
  padding: 15px;
  flex-wrap: wrap;
  align-items: center;
  .tit {
    width: 100%;
    font-size: 16px;
    margin-bottom: 10px;
  }
  .img {
    margin-right: 10px;
    width: 38px;
    height: 38px;
    border-radius: 4px;
    overflow: hidden;
  }
  .desc {
    flex: 1;
    > span {
      display: block;
      color: var(--cp-tag);
      &:first-child {
        font-size: 16px;
        color: var(--cp-text2);
      }
    }
  }
}
.pay-price {
  ::v-deep() {
    .vam-cell__title {
      font-size: 16px;
    }
    .van-cell__value {
      font-size: 16px;
      color: var(--cp-price);
    }
  }
}
.pay-space {
  height: 12px;
  background-color: var(--cp-bg);
}
.pay-schema {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  .text {
    color: var(--cp-primary);
  }
}
::v-deep() {
  .van-submit-bar__button {
    font-weight: normal;
    width: 160px;
  }
}
.pay-type {
  .amount {
    padding: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }
  .btn {
    padding: 15px;
  }
  .van-cell {
    align-items: center;
    .cp-icon {
      margin-right: 10px;
      font-size: 18px;
    }
    .van-checkbox :deep(.van-checkbox__icon) {
      font-size: 16px;
    }
  }
}
</style>
