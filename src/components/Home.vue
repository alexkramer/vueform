<template>
  <div>
    <form @submit.prevent="contact">
      <input type="number" min="0" max="10" required>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
  const { document } = window

  export default {
    data () {
      return {
        contactForm: {

        }
      }
    },
    methods: {
      contact () {
        console.log(document.querySelectorAll('form :invalid'))
      }
    }
  }
</script>

<style lang="scss">

</style>
