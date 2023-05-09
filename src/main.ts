import 'vant/es/dialog/style'; // Notify
import 'vant/es/image-preview/style'
import 'vant/es/notify/style'
import 'vant/es/toast/style'; // Dialog
import 'vant/lib/index.css'; // 引入组件样式
import 'virtual:svg-icons-register'

import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import router from './router'
import pinia from './stores'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
