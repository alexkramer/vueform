<template>
  <div>

    <form @submit.prevent="send"
          v-form="contactForm"
          class="borderRadius25 marginRightAuto marginLeftAuto marginTop40
                 displayFlex bgWhisper">

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
               class="marginTop12 widthTwelve colorRed fontSize14">
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
               class="marginTop12 widthTwelve colorRed fontSize14">
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
                 pattern="^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$"
                 required>

          <div v-if="contactForm.$wasSubmitted"
               class="marginTop12 widthTwelve colorRed fontSize14">
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
                    @input="hasOneWordValidator"
                    v-model="contactData.description"
                    required>
          </textarea>

          <div v-if="contactForm.$wasSubmitted"
               class="marginTop12 widthTwelve colorRed fontSize14">
            <div v-if="contactForm.description.valueMissing">
              Description is required.
            </div>
            <div v-if="contactForm.description.patternMismatch">
              Please use only numbers, spaces, dashes, and parenthesis.
            </div>
          </div>

        </div>

        <!-- Submit button -->
        <button type="submit"
                class="button circular floatRight width140 height50 fontSize20
                       lineHeight32"
                :class="{ 'disabled': contactForm.$isInvalid }">
          <div class="width30 fillWhite floatRight marginRight10 marginTop2"
               v-html="plane">
          </div>
          Send
        </button>

        <!-- Submit button -->

        <button type="reset"
                class="button circular floatRight width140 height50 fontSize20
                       lineHeight32 marginRight30 bgGray">
          <div class="width22 fillWhite floatRight marginRight10 marginTop2"
               v-html="reset">
          </div>
          Reset
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
      send () {
        if (this.contactForm.$isValid) {
          console.log('VALID')
        } else {
          console.log('INVALID')
        }
      },
      hasOneWordValidator (test) {
        console.log(test)
      }
    }
  }
</script>

<style lang="scss">
  .wasSubmitted :invalid:not(:focus),
  .wasFocused:invalid:not(:focus) {
    color: #ff4136;
    border-color: #ff4136;
    background-color: #FEE9E7;
    transition: all 0.2s;
  }

  form {
    box-shadow: 0 18px 24px rgba(0, 0, 0, 0.1);
  }

  textarea {
    max-width: 548px;
  }
</style>
