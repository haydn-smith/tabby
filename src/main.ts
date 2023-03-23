import { createApp } from 'vue';
import App from './App.vue';
import './style.css';
import Player from './values/player';

Player.initialise();

createApp(App).mount('#app');
