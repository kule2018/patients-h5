<template>
  <div class="consult-dep-page">
    <cp-nav-bar title="选择科室" />
    <div class="wrapper">
      <van-sidebar v-model="active">
        <van-sidebar-item
          v-for="top in allDep"
          :key="top.id"
          :title="top.name"
        />
      </van-sidebar>
      <div class="sub-dep">
        <router-link
          to="/consult/illness"
          v-for="sub in subDep"
          :key="sub.id"
          @click="store.setDep(sub.id)"
          >{{ sub.name }}</router-link
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAllDep } from '@/services/consult'
import { useConsultStore } from '@/stores'
import type { TopDep } from '@/types/consult'
import { computed, onMounted, ref } from 'vue'
const store = useConsultStore()
const active = ref(0)
const allDep = ref<TopDep[]>([]) // 一级部门
const subDep = computed(() => allDep.value[active.value]?.child)

onMounted(async () => {
  const res = await getAllDep()
  allDep.value = res.data
})
</script>

<style lang="scss" scoped>
// TODO 修改sidebar样式
.van-sidebar {
  width: 114px;
  &-item {
    padding: 14px;
    color: var(--cp-tag);
    &--select {
      color: var(--cp-main);
      font-weight: normal;
      &::before {
        // display: none;
      }
    }
  }
}
.consult-dep-page {
  padding-top: 46px;
  .wrapper {
    height: calc(100vh - 46px);
    display: flex;
    overflow: hidden;
    .sub-dep {
      flex: 1;
      height: 100%;
      overflow-y: auto;
      > a {
        display: block;
        padding: 14px 30px;
        color: var(--cp-dark);
      }
    }
  }
}
</style>
