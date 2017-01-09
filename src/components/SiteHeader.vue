<template>
  <header>
    <section class="paddingTop50">

      <div class="displayTable marginLeftAuto marginRightAuto">

        <div class="displayTableCell widthTwelve verticalMiddle">
          <h1 class="marginBottom10 marginTop0">
            vue-valid
          </h1>
          <div class="fontSize18 weight500">
            Form validation for Vue.js that works alongside HTML5 from
            <a href="https://optick.io/" class="link border">Optick</a>
          </div>
        </div>

        <div class="displayTableCell width100 verticalMiddle textCenter">
          <a class="link"
             href="https://github.com/optick/vue-valid">
            <div class="width80 height80 fillElixir" v-html="githubSvg"></div>
          </a>
        </div>

    </section>
  </header>
</template>

<script>
  import githubSvg from '../assets/github.svg'

  export default {
    data () {
      return { githubSvg }
    }
  }
</script>
