<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()

const props = defineProps<{
  title?: string
  rightText?: string
  back?: () => void
}>()

const emit = defineEmits<{
  (e: 'click-right'): void
}>()

const onClickLeft = () => {
  console.log(props.back)
  if (props.back) {
    return props.back()
  }
  // 判断历史记录中是否有回退
  if (history.state?.back) {
    router.back()
  } else {
    router.push('/')
  }
}
const onClickRight = () => {
  emit('click-right')
}
</script>

<template>
  <van-nav-bar
    fixed
    left-arrow
    :title="title"
    :right-text="rightText"
    @click-left="onClickLeft"
    @click-right="onClickRight"
  ></van-nav-bar>
</template>

<style lang="scss" scoped>
// TODO 深度作用其他组件样式
:deep() {
  .van-nav-bar {
    &__arrow {
      font-size: 18px;
      color: var(--cp-text1);
    }
    &__text {
      font-size: 15px;
    }
  }
}
</style>
