import Vue from "vue";
import VueRouter from "vue-router";
import Home from '@/views/Home';

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Home,
    redirect: "/home"
  },
  {
    path: "/home",
    name: "home",
    component: () => import('@/views/Home')
  },
  {
    path: "/tags",
    name: "tags",
    component: () => import('@/views/Tags')
  },
  {
    path: "/archive",
    name: "archive",
    component: () => import('@/views/Archive')
  },
  {
    path: "/about",
    name: "about",
    component: () => import('@/views/About')
  },
  {
    path: "/detail/:id",
    name: "Detail",
    component: () => import('@/views/Detail')
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

export default router