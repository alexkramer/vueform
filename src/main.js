import Vue from 'vue'
import App from './App'
import VueValid from '../dist/vue-valid'

Vue.use(VueValid)

/* eslint-disable no-new */
new Vue({ el: '#app', render: h => h(App) })
