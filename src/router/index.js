import Vue from 'vue'
import Router from 'vue-router'

import ContactForm from '../components/ContactForm'
import PatientForm from '../components/PatientForm'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { name: 'ContactForm', path: '/contact', component: ContactForm },
    { name: 'PatientForm', path: '/patient', component: PatientForm },
    { path: '*', redirect: { name: 'ContactForm' } }
  ]
})
