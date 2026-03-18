import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import request from './utils/request'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.config.globalProperties.$http = request
app.provide('http', request)

app.mount('#app')
