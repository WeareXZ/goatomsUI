import Home from '@/module/home/page/home.vue';
import Login from '@/module/home/page/login.vue';
import register from '@/module/home/page/register.vue';

export default [
  {
    path: '/login',
    component: Login,
    name: 'Login',
    hidden: true
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    component: Home,
    name: '系统管理首页',
    hidden: true
  },
  {
    path: '/register',
    name: '用户注册',
    component: register,
    hidden: true
  }
]
