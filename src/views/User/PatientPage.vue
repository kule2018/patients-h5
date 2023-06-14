<template>
  <div class="patient-page">
    <cp-nav-bar :title="isChange ? '选择患者' : '家庭档案'"></cp-nav-bar>
    <!-- 提示 -->
    <div class="patient-change" v-if="isChange">
      <h3>请选择患者信息</h3>
      <p>以便医生给出更准确的治疗，信息仅医生可见</p>
    </div>

    <van-popup
      closeable
      v-model:show="show"
      autocomplete="off"
      position="right"
    >
      <cp-nav-bar
        :back="() => (show = false)"
        :title="patient.id ? '编辑患者' : '添加患者'"
        right-text="保存"
      ></cp-nav-bar>
      <van-form autocomplete ref="form" @submit="onSubmit">
        <van-field
          v-model="patient.name"
          label="真实姓名"
          :rules="nameRules"
          placeholder="请输入真实姓名"
        />
        <van-field
          v-model="patient.idCard"
          label="身份证号"
          :rules="idCardRules"
          placeholder="请输入身份证号"
        />
        <van-field label="性别" class="pb4">
          <template #input>
            <cp-radio-btn
              v-model="patient.gender"
              :options="options"
            ></cp-radio-btn>
          </template>
        </van-field>
        <van-field label="默认就诊人">
          <template #input>
            <van-checkbox
              v-model="defaultFlag"
              :icon-size="18"
              round
            ></van-checkbox>
          </template>
        </van-field>
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </van-form>
      <!-- d底部操作栏 -->
      <van-action-bar v-if="patient.id">
        <van-action-bar-button @click="remove">删除</van-action-bar-button>
      </van-action-bar>
    </van-popup>
    <!-- <div class="patient-add" v-if="list?.length < 6" @click="showPopup"></div> -->
    <!-- <cp-radio-btn :options="options" v-model="gender"></cp-radio-btn> -->
    <div class="patient-list">
      <div
        class="patient-item"
        @click="selectedPatient(item)"
        :class="{ selected: patientId === item.id }"
        v-for="item in list"
        :key="item.id"
      >
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <span class="id">{{
            item.idCard.replace(/^(.{6}).+(.{4})$/, '\$1********\$2')
          }}</span>
          <span>{{ item.genderValue }}</span>
          <span>{{ item.age }}岁</span>
        </div>
        <div class="icon" @click="showPopup(item)">
          <cp-icon name="user-edit"></cp-icon>
        </div>
        <div class="tag" v-if="item.defaultFlag == 1">默认</div>
      </div>
      <!-- 添加患者及弹框 -->
      <div class="patient-add" v-if="list?.length < 6" @click="showPopup()">
        <cp-icon name="user-add" />
        <p>添加患者</p>
      </div>
      <div class="patient-tip">最多可添加 6 人</div>
      <div class="patient-next" v-if="isChange">
        <van-button @click="next" type="primary" round block>下一步</van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
addPatient,
delPatient,
editPatient,
getPatientList
} from '@/services/user'
import { useConsultStore } from '@/stores'
import type { Image } from '@/types/consult'
import type { Patient, PatientList } from '@/types/user'
import { idCardRules, nameRules } from '@/utils/rules'
import { showConfirmDialog, showSuccessToast, showToast } from 'vant'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const store = useConsultStore()
const route = useRoute()
const router = useRouter()
const patientId = ref<string>()
const isChange = computed(() => route.query.isChange === '1')
onMounted(() => {
  loadList()
  if (store.consult.illnessDesc) {
    showConfirmDialog({
      title: '温馨提示',
      message: '是否恢复您之前填写的病情信息呢'
    }).then(() => {
      const { illnessDesc, illnessTime, consultFlag, pictures } = store.consult
      form.value = { illnessDesc, illnessTime, consultFlag, pictures }
      fileList.value = pictures || []
    })
  }
})
const fileList = ref<Image[]>([])
const list = ref<PatientList>()
const loadList = async () => {
  const res = await getPatientList()
  list.value = res.data
  // 设置默认选中的ID
  if (isChange.value && list.value.length) {
    const defPatient = list.value.find((item) => item.defaultFlag == 1)
    if (defPatient) patientId.value = defPatient.id
    else patientId.value = list.value[0].id
  }
}
// 男、女
const gender = ref(1)
const options = [
  {
    label: '男',
    value: 0
  },
  {
    label: '女',
    value: 1
  }
]
const selectedPatient = (item: Patient) => {
  if (!isChange.value) {
    patientId.value = item.id
  }
}
// 打开侧边边栏
const show = ref(false)
const showPopup = (item?: Patient) => {
  if (item) {
    // 有item是编辑，解构出后台需要的数据
    const { id, gender, name, idCard, defaultFlag } = item
    patient = { id, gender, name, idCard, defaultFlag }
  } else {
    /* empty */
  }
  show.value = true
}

// 表单的
const form = ref()
const initPatient: Patient = {
  name: '',
  idCard: '',
  gender: 1,
  defaultFlag: 0
}
// TODO 要解构初始数据 克隆一份新数据，要不然是同一个对象
let patient = reactive<Patient>({
  ...initPatient
})
// 替换默认值
const defaultFlag = computed({
  get() {
    return patient.defaultFlag === 1 ? true : false
  },
  set(value) {
    patient.defaultFlag = value ? 1 : 0
  }
})
const onSubmit = async () => {
  // await form.value?.validate()
  console.log(form.value)
  const gender = +patient.idCard.slice(-2, -1) % 2
  if (gender !== patient.gender) {
    await showConfirmDialog({
      title: '温馨提示',
      message: '填写的性别和省份证号中的不一致\n您确认提交吗'
    })
  }
  // 添加 & 修改
  patient.id ? await editPatient(patient) : await addPatient(patient)
  show.value = false
  loadList()
  showSuccessToast(patient.id ? '编辑成功' : '添加成功')
  console.log('通过校验')
}

// 删除患者
const remove = async () => {
  if (patient.id) {
    await showConfirmDialog({
      title: '温馨提示',
      message: `您确定要删除 ${patient.name}患者信息`
    })
    await delPatient(patient.id)
    show.value = false
    loadList()
    showSuccessToast('删除成功')
  }
}
const next = () => {
  if (!patientId.value) return showToast('请选择患者')
  store.setPatient(patientId.value)
  router.push('/consult/pay')
}
</script>

<style lang="scss" scoped>
.patient-page {
  padding: 45px 0 80px;
  .van-button {
    width: 90%;
    height: 36px;
    margin: 0 auto;
  }
  :deep() {
    .van-popup {
      width: 80%;
      height: 100%;
      padding-top: 46px;
      box-sizing: border-box;
      .van-action-bar {
        padding: 0 10px;
        margin-bottom: 10px;
        .van-button {
          color: var(--cp-price);
          background-color: var(--cp-bg);
        }
      }
    }
  }
}
.patient-list {
  padding: 15px;
}
.patient-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--cp-bg);
  border-radius: 8px;
  margin-bottom: 15px;
  position: relative;
  border: 1px solid var(--cp-bg);
  transition: all 0.3s;
  overflow: hidden;
  .info {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    span {
      color: var(--cp-tip);
      margin-right: 20px;
      line-height: 30px;
      &.name {
        font-size: 16px;
        color: var(--cp-text1);
        width: 80px;
        margin-right: 0;
      }
      &.id {
        color: var(--cp-text2);
        width: 180px;
      }
    }
  }
  .icon {
    color: var(--cp-tag);
    width: 20px;
    text-align: center;
  }
  .tag {
    position: absolute;
    right: 60px;
    top: 21px;
    width: 30px;
    height: 16px;
    font-size: 10px;
    color: #fff;
    background-color: var(--cp-primary);
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &.selected {
    border-color: var(--cp-primary);
    background-color: var(--cp-plain);
    .icon {
      color: var(--cp-primary);
    }
  }
}
.patient-add {
  background-color: var(--cp-bg);
  color: var(--cp-primary);
  text-align: center;
  padding: 15px 0;
  border-radius: 8px;
  .cp-icon {
    font-size: 24px;
  }
}
.patient-tip {
  color: var(--cp-tag);
  padding: 12px 0;
}
.pb4 {
  padding-bottom: 4px;
}
.patient-change {
  padding: 15px;
  > h3 {
    font-weight: normal;
    margin-bottom: 5px;
  }
  > p {
    color: var(--cp-text3);
  }
}
.patient-next {
  padding: 15px;
  background-color: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 80px;
  box-sizing: border-box;
}
</style>
