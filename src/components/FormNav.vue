<template>
  <div class="nav displayFlex marginTop20 marginBottom25">
    <router-link to="/contact" class="link marginRight20">
      ContactForm
    </router-link>
    <router-link to="/patient" class="link">
      PatientForm
    </router-link>
  </div>
</template>

<script>
  export default {
    name: 'FormNav'
  }
</script>

<style lang="scss">
  .nav .link {
    background-color: rgba(255, 255, 255, .1);
    border-radius: 25px;
    padding: 5px 15px;
    transition: all 0.5s ease-in-out;

    &:hover {
      background-color: rgba(255, 255, 255, .2);
    }

    &.router-link-active {
      color: #fff;
      background-color: rgba(255, 255, 255, .2);
    }
  }
</style>
