import Vue from 'vue';
import Router from 'vue-router';
import Name from './views/Name.vue';
import Labeling from './views/Labeling.vue';
import Admin from './views/Admin.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'name',
      component: Name,
    },
    {
      path: '/labeling',
      name: 'labeling',
      component: Labeling,
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
    },
  ],
});
