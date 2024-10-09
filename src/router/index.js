// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue';
import Folders from '../views/Folders.vue'; // Import the new Folders component

const routes = [
  {
    path: '/',
    name: 'Home',
    component: App,
  },
  {
    path: '/folders',
    name: 'Folders',
    component: Folders, // Assign the Folders component to this route
  },
  // Other routes...
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
