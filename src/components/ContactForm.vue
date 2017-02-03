<template>
  <form @submit.prevent="send"
        v-form="contactForm"
        class="borderRadius25 marginRightAuto marginLeftAuto displayFlex
               bgWhisper">

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
               minlength="3"
               required>

        <div v-if="contactForm.$wasSubmitted"
             class="marginTop12 widthTwelve colorRed fontSize14">
          <div v-if="contactForm.name.valueMissing">
            Name is required.
          </div>
          <div v-if="contactForm.name.tooShort">
            Please enter your first and last name.
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
          <div v-if="contactForm.description.customError">
            {{ contactForm.description.customMessage }}
          </div>
        </div>

      </div>

      <!-- Success message -->
      <transition name="fade">
        <div v-if="formSent" class="colorOlive fontSize18 textCenter">
          Thanks! We'll be in touch soon.
        </div>
      </transition>

      <!-- Form buttons -->
      <div v-if="!formSent" class="textRight fontSize20">

        <!-- Reset button -->
        <button type="reset"
                class="button circular width140 height50 marginRight30 bgGray">
          <span class="verticalMiddle">Reset</span>
          <reset-icon></reset-icon>
        </button>

        <!-- Submit button -->
        <button type="submit"
                class="button circular width140 height50"
                :class="{ 'disabled': contactForm.$isInvalid }">
          <span class="verticalMiddle">Send</span>
          <plane-icon></plane-icon>
        </button>

      </div>

    </div>

  </form>
</template>

<script>
  import VueForm from '../../dist/vueform'
  import ResetIcon from './ResetIcon'
  import PlaneIcon from './PlaneIcon'

  export default {
    name: 'ContactForm',
    components: { ResetIcon, PlaneIcon },
    data () {
      return {
        formSent: false,
        contactData: {},
        contactForm: new VueForm()
      }
    },
    methods: {
      send () {
        if (this.contactForm.$isValid) {
          console.log('VALID')
          this.formSent = true
        } else {
          console.log('INVALID')
        }
      },
      hasOneWordValidator ({ target }) {
        const id = target.getAttribute('id')
        if (target.value.match(/\w+/)) {
          this.contactForm.$setCustomValidity(id)
        } else {
          const errorMessage = 'Description must contain at least one word.'
          this.contactForm.$setCustomValidity(id, errorMessage)
        }
      }
    }
  }
</script>
