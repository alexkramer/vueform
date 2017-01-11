import Vue from 'vue'
import App from './App'
import VueForm from '../dist/vue-valid'

Vue.use(VueForm)

/* eslint-disable no-new */
new Vue({ el: '#app', render: h => h(App) })
