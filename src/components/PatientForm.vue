<template>
  <form @submit.prevent="submit"
        v-form="patientForm"
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
               v-model="patientData.name"
               pattern="[A-Za-z\s'\-]+"
               minlength="3"
               required>

        <div v-if="patientForm.$wasSubmitted"
             class="marginTop12 widthTwelve colorRed fontSize14">
          <div v-if="patientForm.name.valueMissing">
            Name is required.
          </div>
          <div v-if="patientForm.name.tooShort">
            Please enter your first and last name.
          </div>
          <div v-if="patientForm.name.patternMismatch">
            Please use only letters, spaces, dashes, and apostrophes.
          </div>
        </div>

      </div>

      <!-- Sex field -->
      <div class="marginBottom30 widthTwelve">

        <div class="marginBottom10">
          <label for="email" class="colorMidGray fontSize14">
            Your sex
          </label>
        </div>

        <label class="colorMidGray fontSize14 marginRight20">
          <input id="female"
                 type="radio"
                 name="sex"
                 v-model="patientData.sex"
                 class="inputRadio marginRight5 padding20"
                 required>
            Female
        </label>

        <label class="colorMidGray fontSize14">
          <input id="male"
                 type="radio"
                 name="sex"
                 v-model="patientData.sex"
                 class="inputRadio marginRight5"
                 required>
           Male
        </label>

        <div v-if="patientForm.$wasSubmitted"
             class="marginTop12 widthTwelve colorRed fontSize14">
          <div v-if="patientForm.email.valueMissing">
            Sex is required.
          </div>
        </div>

      </div>

      <!-- Date of birth field -->
      <div class="marginBottom30 widthTwelve">

        <div class="marginBottom10">
          <label for="phone" class="colorMidGray fontSize14">
            Your date of Birth
          </label>
        </div>

        <input id="phone"
               type="date"
               class="inputText widthTwelve"
               v-model="patientData.phone"
               pattern="^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$"
               required>

        <div v-if="patientForm.$wasSubmitted"
             class="marginTop12 widthTwelve colorRed fontSize14">
          <div v-if="patientForm.phone.valueMissing">
            Phone is required.
          </div>
          <div v-if="patientForm.phone.patternMismatch">
            Please use only numbers, spaces, dashes, and parenthesis.
          </div>
        </div>

      </div>

    </div>

    <div class="flex1 padding30">

      <!-- Reason field -->
      <div class="marginBottom30">

        <div class="marginBottom10">
          <label for="description" class="colorMidGray fontSize14">
            The reason for your visit
          </label>
        </div>

        <div class="paddingBottom10 paddingTop10">
          <label class="colorMidGray fontSize14 marginRight20">
            <input id="email"
                   type="checkbox"
                   name="reason"
                   v-model="patientData.sex"
                   class="inputCheckbox marginRight5 padding20"
                   required>
              Checkup
          </label>
        </div>

        <div class="paddingBottom10 paddingTop10">
          <label class="colorMidGray fontSize14 marginRight20">
            <input id="email"
                   type="checkbox"
                   name="reason"
                   v-model="patientData.sex"
                   class="inputCheckbox marginRight5 padding20"
                   required>
              Illness
          </label>
        </div>

        <div class="paddingBottom10 paddingTop10">
          <label class="colorMidGray fontSize14 marginRight20">
            <input id="email"
                   type="checkbox"
                   name="reason"
                   v-model="patientData.sex"
                   class="inputCheckbox marginRight5 padding20"
                   required>
              Pregnancy
          </label>
        </div>

        <div class="paddingBottom10 paddingTop10">
          <label class="colorMidGray fontSize14 marginRight20">
            <input id="email"
                   type="checkbox"
                   name="reason"
                   v-model="patientData.sex"
                   class="inputCheckbox marginRight5 padding20"
                   required>
              Consultation
          </label>
        </div>

        <div>
          <div class="paddingBottom10 paddingTop10">
            <label class="colorMidGray fontSize14 marginRight20">
              <input id="email"
                     type="checkbox"
                     name="reason"
                     v-model="patientData.sex"
                     class="inputCheckbox marginRight5 padding20"
                     required>
              <input id="name"
                    type="text"
                    class="inputText widthTen"
                    placeholder="Other"
                    v-model="patientData.name"
                    pattern="[A-Za-z\s'\-]+"
                    minlength="3"
                    required>
            </label>
          </div>
        </div>

      </div>

      <!-- Submit button -->
      <button type="submit"
              class="button circular floatRight width140 height50 fontSize20
                     lineHeight32"
              :class="{ 'disabled': patientForm.$isInvalid }">
        <div class="width30 fillWhite floatRight marginRight10 marginTop2"
             v-html="">
        </div>
        Submit
      </button>

      <!-- Reset button -->
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
</template>

<script>
  import VueForm from '../../dist/vueform'
  import reset from '../assets/reset.svg'

  export default {
    name: 'PatientForm',
    data () {
      return {
        reset,
        patientData: {},
        patientForm: new VueForm()
      }
    },
    methods: {
      submit () {

      }
    }
  }
</script>
