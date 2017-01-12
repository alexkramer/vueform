<template>
  <div>

    <form @submit.prevent="send"
          v-form="contactForm"
          class="borderRadius25 marginRightAuto marginLeftAuto marginTop40
                 displayFlex bgIan">

      <div class="flex1 padding30">

        <!-- Name field -->
        <div class="marginBottom30 widthTwelve">

          <div class="marginBottom10">
            <label for="name" class="colorMidGray fontSize14">
              Your name
            </label>
          </div>

          <input id="name"
                 type="text"
                 class="inputText widthTwelve"
                 v-model="contactData.name"
                 pattern="[A-Za-z\s'\-]+"
                 required>

          <div v-if="contactForm.$wasSubmitted"
               class="marginTop15 widthTwelve colorRed fontSize14">
            <div v-if="contactForm.name.valueMissing">
              Name is required.
            </div>
            <div v-if="contactForm.name.patternMismatch">
              Please use only letters, spaces, dashes, and apostrophes.
            </div>
          </div>

        </div>

        <!-- Email field -->
        <div class="marginBottom30 widthTwelve">

          <div class="marginBottom10">
            <label for="email" class="colorMidGray fontSize14">
              Your email address
            </label>
          </div>

          <input id="email"
                 type="email"
                 class="inputText widthTwelve"
                 v-model="contactData.email"
                 required>

          <div v-if="contactForm.$wasSubmitted"
               class="marginTop15 widthTwelve colorRed fontSize14">
            <div v-if="contactForm.email.valueMissing">
              Email is required.
            </div>
            <div v-if="contactForm.email.typeMismatch">
              Please enter a valid email address.
            </div>
          </div>

        </div>

        <!-- Phone field -->
        <div class="marginBottom30 widthTwelve">

          <div class="marginBottom10">
            <label for="phone" class="colorMidGray fontSize14">
              Your phone number
            </label>
          </div>

          <input id="phone"
                 type="text"
                 class="inputText widthTwelve"
                 v-model="contactData.phone"
                 required>

          <div v-if="contactForm.$wasSubmitted"
               class="marginTop15 widthTwelve colorRed fontSize14">
            <div v-if="contactForm.phone.valueMissing">
              Phone is required.
            </div>
            <div v-if="contactForm.phone.patternMismatch">
              Please use only numbers, spaces, dashes, and parenthesis.
            </div>
          </div>

        </div>

        <!-- Project field -->
        <div class="widthTwelve">

          <div class="marginBottom10">
            <label for="project" class="colorMidGray fontSize14">
              Your company/project name
            </label>
          </div>

          <input id="project"
                 type="text"
                 class="inputText widthTwelve"
                 v-model="contactData.project">

        </div>

      </div>

      <div class="flex1 padding30">

        <!-- Description field -->
        <div class="marginBottom30">

          <div class="marginBottom10">
            <label for="description" class="colorMidGray fontSize14">
              How can we help you?
            </label>
          </div>

          <textarea id="description"
                    class="textArea widthTwelve resizeVertical"
                    rows="13"
                    v-model="contactData.description">
          </textarea>

        </div>

        <!-- Submit button -->
        <button type="submit"
                class="button circular floatRight width140 height50 fontSize20
                       lineHeight32">
          Send
          <div class="width30 fillWhite floatRight marginRight10 marginTop2"
               v-html="plane">
          </div>
        </button>

        <!-- Submit button -->
        <button type="reset"
                class="button circular floatRight width140 height50 fontSize20
                       lineHeight32 marginRight30 bgGray">
          Reset
          <div class="width22 fillWhite floatRight marginRight10 marginTop2"
               v-html="reset">
          </div>
        </button>

      </div>

    </form>

  </div>
</template>

<script>
  import plane from '../assets/plane.svg'
  import reset from '../assets/reset.svg'
  import VueForm from '../../dist/vue-valid'

  export default {
    data () {
      return {
        plane,
        reset,
        contactData: {},
        contactForm: new VueForm()
      }
    },
    methods: {
      send () {}
    }
  }
</script>

<style lang="scss">
  .wasFocused:invalid:not(:focus) {
    color: #ff4136;
    border-color: #ff4136;
    background-color: #FEE9E7;
    transition: all 0.2s;
  }
</style>
