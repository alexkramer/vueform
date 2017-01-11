<template>
  <div>
    <!-- <form>
      <label><input type="checkbox"> Show HTML5 messages</label>
    </form> -->

    <form id="contactForm" @submit.prevent="contact" v-form="contactForm">
      <input type="number" name="age" max="140" required>
      <div v-if="contactForm.$submitted">
        <div v-if="contactForm.$validity('age').rangeOverflow">
          Too old!
        </div>
      </div>
      <input type="email" name="name" required>
      <div v-if="contactForm.$submitted && contactForm.$invalid('name')">
        Name is required.
      </div>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
  import VueForm from '../../dist/vue-valid'

  export default {
    data () {
      return {
        contactForm: new VueForm()
      }
    },
    methods: {
      contact () {}
    }
  }
</script>

<style lang="scss">
  input:invalid {
    border-color: red;
  }
</style>
