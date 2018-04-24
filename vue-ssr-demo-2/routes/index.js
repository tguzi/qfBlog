import Vue                        from 'vue'
import Router                     from 'vue-router'

import Home from '../view/home.vue'
import Blog from '../view/blog.vue'


Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/home', component: Home },
    { path: '/blog', component: Blog }
  ]
})