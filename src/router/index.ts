import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import EditClothingItem from '@/components/EditClothingItem.vue';
import AddClothingItem from '@/components/AddClothingItem.vue';

import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';

const routes = [
  { path: '/',name: 'Home' ,component: HomeView },
  { path: '/add', name: 'AddItem', component: AddClothingItem },
  { path: '/edit/:id', component: EditClothingItem, props: true },
  { path: '/login',name: 'Login' ,component: Login },
  { path: '/register',name: 'Register' ,component: Register },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
