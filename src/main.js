import Vue from 'vue'
import App from './App'
import VueForm from '../dist/vueform'

Vue.use(VueForm)

/* eslint-disable no-new */
new Vue({ el: '#app', render: h => h(App) })
