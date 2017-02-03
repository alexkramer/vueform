import Vue from 'vue'
import App from './App'
import VueForm from '../dist/vueform'

Vue.use(VueForm)

const wfLoadinginterval = setInterval(() => {
  if (document.documentElement.className.indexOf('wf-active') !== -1) {
    clearInterval(wfLoadinginterval)
    /* eslint-disable no-new */
    new Vue(App).$mount('#app')
  }
})
