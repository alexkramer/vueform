import Vue from 'vue'

import App from './App'
import VueForm from '../dist/vueform'
import router from './router'

Vue.use(VueForm)

const wfLoadinginterval = setInterval(() => {
  if (document.documentElement.className.indexOf('wf-active') !== -1) {
    clearInterval(wfLoadinginterval)
    /* eslint-disable no-new */
    new Vue({ el: '#app', router, render: h => h(App) })
  }
})
