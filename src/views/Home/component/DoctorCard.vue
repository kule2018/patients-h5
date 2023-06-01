<template>
  <div class="doctor-card">
    <van-image round :src="item.avatar"></van-image>
    <p class="name">{{ item.name }}</p>
    <p class="van-ellipsis">
      {{ item.hospitalName }}
      {{ item.depName }}
    </p>
    <p>{{ item.positionalTitles }}</p>
    <van-button
      :loading="loading"
      round
      size="small"
      type="primary"
      @click="follow(item)"
    >
      {{ item.likeFlag === 1 ? '已关注' : '+关注' }}
    </van-button>
  </div>
</template>

<script setup lang="ts">
import { useFollow } from '@/composable';
import type { Doctor } from '@/types/consult';
const { loading, follow } = useFollow()
defineProps<{ item: Doctor }>()
</script>

<style lang="scss" scoped>
.doctor-card {
  width: 135px;
  height: 190px;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0px 0px 11px 0px rgba(229, 229, 229, 0.2);
  text-align: center;
  display: inline-block;
  padding: 15px;
  box-sizing: border-box;
  margin-left: 15pxs;
  > .van-image {
    width: 58px;
    height: 58px;
    vertical-align: top;
    border-radius: 50%;
    margin: 0 auto 8px;
  }
  > p {
    font-size: 11px;
    margin-bottom: 11px;
    color: var(--cp-tip);
    &.name {
      font-size: 13px;
      color: var(--cp-text1);
      margin-bottom: 5px;
    }
  }
  > .van-button {
    padding: 0 12px;
    height: 28px;
    margin-top: 8px;
    width: 72px;
  }
}
</style>
