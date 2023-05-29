<script setup lang="ts">
import { ref } from 'vue'
import type { KnowledgeType, KnowledgeParams, Knowledge } from '@/types/consult'
import KnowledgeCard from './KnowledgeCard.vue'
import { getKnowledgePage } from '@/services/consult'
const props = defineProps<{
  type: KnowledgeType
}>()
const list = ref<Knowledge[]>([])
const loading = ref(false)
const finished = ref(false)
const params = ref<KnowledgeParams>({
  type: props.type,
  current: 1,
  pageSize: 10
})
const onLoad = async () => {
  // 加载更多
  const res = await getKnowledgePage(params.value)
  console.log(res.data.rows)

  list.value.push(...res.data.rows)
  if (params.value.current >= res.data.pageTotal) {
    finished.value = true
  } else {
    params.value.current++
  }
  loading.value = false
}
</script>

<template>
  <div class="knowledge-list">
    <van-list
      finished-text="没有更多了"
      v-model:loading="loading"
      :finished="finished"
      @load="onLoad"
    >
      <KnowledgeCard v-for="(item, i) in list" :key="i" :item="item" />
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>
