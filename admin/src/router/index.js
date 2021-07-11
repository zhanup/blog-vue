import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Login
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/manage",
    name: "Manage",
    component: () => import('@/views/Manage'),
    meta: {
      requireAuth: true
    }
  },
  {
    path: "/edit/:id",
    name: "Edit",
    component: () => import('@/views/Edit'),
    meta: {
      requireAuth: true
    }
  }
]

const router = new VueRouter({
  routes,
  mode: "history"
})

router.beforeEach((to, from, next) => {
  let token = sessionStorage.getItem("token");
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
    if (token) {  // 判断当前的token是否存在
      next()
    } else {
      next({path: '/login'})
    }
  } else {
    next()
  }
})

export default router
