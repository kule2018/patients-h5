import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'
// TODO 使用 pinia-plugin-persistedstate 实现pinia仓库状态持久化

// 创建pinia实例
const pinia = createPinia()
// 使用persist插件
pinia.use(persist)

export * from './modules/consult'
export * from './modules/user'

// 导出pinia实例，给main使用
export default pinia
