import Vue from 'vue'
import App from './App.vue'
import router from './routes/index.js'

export function createApp () {
  const app = new Vue({
    router,
    render: h => h(App)
  })
  return { app, router }
}