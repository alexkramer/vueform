<template>
  <div class="heightFull paddingLeft20 paddingRight20 maxWidth900
              marginLeftAuto marginRightAuto">
    <site-header></site-header>
    <form-nav></form-nav>
    <router-view></router-view>
    <site-footer></site-footer>
  </div>
</template>

<script>
  import Vue from 'vue'
  import VueRouter from 'vue-router'

  import SiteHeader from './components/SiteHeader'
  import FormNav from './components/FormNav'
  import SiteFooter from './components/SiteFooter'
  import ContactForm from './components/ContactForm'
  import PatientForm from './components/PatientForm'

  Vue.use(VueRouter)

  const routes = [
    { name: 'ContactForm', path: '/contact', component: ContactForm },
    { name: 'PatientForm', path: '/patient', component: PatientForm },
    { path: '*', redirect: { name: 'ContactForm' } }
  ]

  export default {
    name: 'App',
    router: new VueRouter({ mode: 'history', routes }),
    components: { SiteHeader, SiteFooter, FormNav }
  }
</script>

<style lang="scss">
  html {
    overflow: hidden;
  }

  html,
  body {
    height: 100%;
    padding: 0;
    margin: 0;
  }

  body {
    overflow: auto;
    color: rgba(100, 255, 200, .8);
    font-family: 'Montserrat', sans-serif;
    background: #136a8a; /* fallback for old browsers */
    background: -webkit-linear-gradient(0, #267871 , #136a8a); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(0deg, #267871 , #136a8a); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    background-repeat: no-repeat;
    background-attachment: fixed;
  }

  a.link,
  a:visited.link {
    color: rgba(100, 255, 200, .8);
    fill: rgba(100, 255, 200, .8);
    transition: color 0.5s ease-in-out,
                fill 0.5s ease-in-out;
  }
  a:hover.link {
    color: rgba(244, 245, 249, 1);
    fill: rgba(244, 245, 249, 1);
  }
  a.link.border {
    border-bottom: 1px solid rgba(100, 255, 200, .4);
  }

  footer::selection,
  h1::selection,
  div::selection,
  a::selection,
  code::selection {
    color: #ddd;
    background: #482292;
  }

  .bgWhisper {
    background-color: #f4f5f9;
  }

  .borderRadius25 {
    border-radius: 25px;
  }

  .button:focus {
    outline: 0;
  }
  .button.disabled,
  .button.disabled:hover {
    background-color: #999;
  }
  .button:not(.disabled) {
    box-shadow: 0px 2px 7px rgba(0, 0, 0, 0.15);

    &:hover {
      box-shadow: 0px 6px 14px rgba(0, 0, 0, 0.30);
    }

    &:active {
      transform: scale3d(0.96, 0.96, 1);
      box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.15);
    }
  }



  .wasSubmitted :invalid:not(:focus),
  .wasFocused:invalid:not(:focus) {
    color: #ff4136;
    border-color: #ff4136;
    background-color: #FEE9E7;
    transition: all 0.2s;
  }

  .showUsageInstructionsButton {
    border-radius: 20px;
    padding: 12px 16px;
    background-color: #a873d1;
    transition: all 500ms ease-in-out;
  }

  form {
    box-shadow: 0 18px 24px rgba(0, 0, 0, 0.1);
  }

  textarea {
    max-width: 548px;
  }
</style>
