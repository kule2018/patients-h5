<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()

defineProps<{
  title?: string
  rightText?: string
}>()

const emit = defineEmits<{
  (e: 'click-right'): void
}>()

const onClickLeft = () => {
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
  // .van-nav-bar {
  //   &__arrow {
  //     font-size: 18px;
  //     color: var(--cp-text1);
  //   }
  //   &__text {
  //     font-size: 15px;
  //   }
  // }
}
</style>
