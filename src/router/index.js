import Vue from "vue";
import VueRouter from "vue-router";
import Index from '@/views/Index';

Vue.use(VueRouter);

const routes = [{
    path: "/",
    component: Index,
    redirect: "/home",
    meta: {
      requireAuth: false
    },
    children: [{
        path: "home",
        name: "home",
        component: () => import('@/views/Home')
      },
      {
        path: "tags",
        name: "tags",
        component: () => import('@/views/Tags')
      },
      {
        path: "archive",
        name: "archive",
        component: () => import('@/views/Archive')
      },
      {
        path: "about",
        name: "about",
        component: () => import('@/views/About')
      },
      {
        path: "/detail/:id",
        name: "Detail",
        component: () => import('@/views/Detail')
      }
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: () => import('@/views/Login')
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
  mode: "history",
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
});

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