import { createApp } from 'vue';
import { createWebHistory, createRouter } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

import './style.css';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';

import Button from 'primevue/button';
import Card from 'primevue/card';
import Avatar from 'primevue/avatar';
import Tag from 'primevue/tag';
import Badge from 'primevue/badge';
import MenuBar from 'primevue/menubar';
import Divider from 'primevue/divider';
import { IconField, InputIcon, InputText, Textarea, FloatLabel, RadioButton, Select } from 'primevue';
import Dialog from 'primevue/dialog';
import ScrollPanel from 'primevue/scrollpanel';
import Toast from 'primevue/toast';
import Chip from 'primevue/chip';
import ToastService from 'primevue/toastservice';
import OverlayBadge from 'primevue/overlaybadge';
import Password from 'primevue/password';
import Checkbox from 'primevue/checkbox';
import ConfirmPopup from 'primevue/confirmpopup';
import FocusTrap from 'primevue/focustrap';
import Tooltip from 'primevue/tooltip';
import SpeedDial from 'primevue/speeddial';
import FileUpload from 'primevue/fileupload';
import Paginator from 'primevue/paginator';
import Message from 'primevue/message';
import ConfirmationService from 'primevue/confirmationservice';

import MainPage from './pages/MainPage.vue';
import LoginPage from './pages/LoginPage.vue';
import RegisterPage from './pages/RegisterPage.vue';
import ForgotPasswordPage from './pages/ForgotPasswordPage.vue';
import ProfilePage from './pages/ProfilePage.vue';
import SearchPage from './pages/SearchPage.vue';
import PostPage from './pages/PostPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainPage,
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
    component: ForgotPasswordPage
  },
  {
    path: '/profile',
    component: ProfilePage
  },
  {
    path: '/search',
    component: SearchPage
  },
  {
    path: '/add',
    component: PostPage
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
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
app.use(ToastService);
app.use(ConfirmationService);

app.component('Button', Button);
app.component('InputText', InputText);
app.component('Card', Card);
app.component('Avatar', Avatar);
app.component('Tag', Tag);
app.component('Badge', Badge);
app.component('MenuBar', MenuBar);
app.component('Divider', Divider);
app.component('IconField', IconField);
app.component('InputIcon', InputIcon);
app.component('Textarea', Textarea);
app.component('Dialog', Dialog);
app.component('FloatLabel', FloatLabel);
app.component('RadioButton', RadioButton);
app.component('Select', Select);
app.component('ScrollPanel', ScrollPanel);
app.component('Toast', Toast);
app.component('Chip', Chip);
app.component('OverlayBadge', OverlayBadge);
app.component('Password', Password);
app.component('Checkbox', Checkbox);
app.component('ConfirmPopup', ConfirmPopup);
app.component('SpeedDial', SpeedDial);
app.component('FileUpload', FileUpload);
app.component('Paginator', Paginator);
app.component('Message', Message);

app.directive('focustrap', FocusTrap);
app.directive('tooltip', Tooltip);

app.mount('#app');
