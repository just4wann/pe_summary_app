import { createApp } from 'vue';
import { createWebHistory, createRouter } from 'vue-router';

import './style.css';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';

import {
  Card,
  Avatar,
  Divider,
  IconField,
  InputIcon,
  InputText,
  Textarea,
  FloatLabel,
  RadioButton,
  Select,
  Dialog,
  OverlayBadge,
  Password,
  ConfirmPopup,
  SpeedDial,
  FileUpload,
  Paginator,
  ConfirmationService,
  Image,
  Skeleton,
  DatePicker,
} from 'primevue';

import MainPage from './pages/MainPage.vue';
import LoginPage from './pages/LoginPage.vue';
import RegisterPage from './pages/RegisterPage.vue';
import ForgotPasswordPage from './pages/ForgotPasswordPage.vue';
import ProfilePage from './pages/ProfilePage.vue';
import SearchPage from './pages/SearchPage.vue';
import PostPage from './pages/PostPage.vue';
import StatisticPage from './pages/StatisticPage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: 'home',
      path: '/:id',
      component: MainPage,
      props: true,
    },
    {
      path: '/register',
      component: RegisterPage,
    },
    {
      path: '/login',
      component: LoginPage,
    },
    {
      path: '/forgot',
      component: ForgotPasswordPage,
    },
    {
      path: '/profile',
      component: ProfilePage,
    },
    {
      path: '/search',
      component: SearchPage,
    },
    {
      path: '/add',
      component: PostPage,
    },
    {
      path: '/stats',
      component: StatisticPage,
    },
  ],
});

const app = createApp(App);
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: '.dark',
    },
  },
});
app.use(ConfirmationService);

app.component('InputText', InputText);
app.component('Card', Card);
app.component('Avatar', Avatar);
app.component('Divider', Divider);
app.component('IconField', IconField);
app.component('InputIcon', InputIcon);
app.component('Textarea', Textarea);
app.component('Dialog', Dialog);
app.component('FloatLabel', FloatLabel);
app.component('RadioButton', RadioButton);
app.component('Select', Select);
app.component('OverlayBadge', OverlayBadge);
app.component('Password', Password);
app.component('ConfirmPopup', ConfirmPopup);
app.component('SpeedDial', SpeedDial);
app.component('FileUpload', FileUpload);
app.component('Paginator', Paginator);
app.component('Image', Image);
app.component('Skeleton', Skeleton);
app.component('DatePicker', DatePicker);

app.mount('#app');
