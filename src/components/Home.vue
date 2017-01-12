<template>
  <div>
    <!-- <form>
      <label><input type="checkbox"> Show HTML5 messages</label>
    </form> -->

    <form id="contactForm" @submit.prevent="contact" v-form="contactForm">
      <input type="number" id="age" max="140" required>
      <div v-if="contactForm.$wasSubmitted">
        <div>enter</div>
        <div v-if="contactForm.$validity('age').rangeOverflow">
          Too old!
        </div>
      </div>
      <input type="email" id="name" required>
      <div v-if="contactForm.$submitted && contactForm.$invalid('name')">
        Name is required.
      </div>
      <select id="sex" required>
        <option value="">Select One:</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
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
  .wasFocused:invalid {
    border-color: red;
  }
</style>
