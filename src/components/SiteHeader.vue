<template>
  <header>
    <section class="paddingTop40">

      <div class="displayTable marginLeftAuto marginRightAuto">

        <div class="displayTableCell widthTwelve verticalMiddle">
          <h1 class="marginBottom10 marginTop0">
            vueform
          </h1>
          <div class="fontSize18 fontWeight500 lineHeight32">
            Form validation for
            <a href="https://vuejs.org" class="link border">Vue.js</a>
            powered by HTML5 from
            <a href="https://optick.io/" class="link border">Optick</a> and
            <a href="https://www.goodstartgenetics.com" class="link border">
              Good Start Genetics
            </a>
          </div>
        </div>

        <div class="displayTableCell width100 verticalMiddle textCenter">
          <a class="link" href="https://github.com/optick/vueform">
            <git-hub-icon></git-hub-icon>
          </a>
        </div>

    </section>
  </header>
</template>

<script>
  import GitHubIcon from './GitHubIcon'

  export default {
    name: 'SiteHeader',
    components: { GitHubIcon }
  }
</script>
