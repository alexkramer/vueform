<template>
  <form @submit.prevent="submit"
        v-form="patientForm"
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

        <div class="displayFlex lineHeight32 colorDarkGray">

          <label class="marginRight30 cursorPointer displayFlex itemsCenter">
            <input name="sex"
                   type="radio"
                   v-model="patientData.sex"
                   value="female"
                   class="marginRight10">
              <span class="paddingTop5">Female</span>
          </label>

          <label class="cursorPointer displayFlex itemsCenter">
            <input name="sex"
                   type="radio"
                   v-model="patientData.sex"
                   value="male"
                   class="marginRight10">
             <span class="paddingTop5">Male</span>
          </label>

        </div>

        <div v-if="patientForm.$wasSubmitted"
             class="marginTop12 widthTwelve colorRed fontSize14">
          <div v-if="patientForm.sex.valueMissing">
            Sex is required.
          </div>
        </div>

      </div>

      <!-- Pregnant field -->
      <div v-if="patientData.sex === 'female'"
           class="marginBottom30 widthTwelve">

        <div class="marginBottom10">
          <label for="email" class="colorMidGray fontSize14">
            Are you pregnant?
          </label>
        </div>

        <div class="displayFlex lineHeight32 colorDarkGray">

          <label class="marginRight30 cursorPointer displayFlex itemsCenter">
            <input name="pregnant"
                   type="radio"
                   v-model="patientData.pregnant"
                   value="yes"
                   class="marginRight10">
              <span class="paddingTop5">Yes</span>
          </label>

          <label class="cursorPointer displayFlex itemsCenter">
            <input name="pregnant"
                   type="radio"
                   v-model="patientData.pregnant"
                   value="no"
                   class="marginRight10">
             <span class="paddingTop5">No</span>
          </label>

        </div>

        <div v-if="patientForm.$wasSubmitted"
             class="marginTop12 widthTwelve colorRed fontSize14">
          <div v-if="patientForm.pregnant.valueMissing">
            Please specify whether you are pregnant or not.
          </div>
        </div>

      </div>

      <!-- Date of birth field -->
      <div class="marginBottom30 widthTwelve">

        <div class="marginBottom10">
          <label for="dob" class="colorMidGray fontSize14">
            Your date of birth
          </label>
        </div>

        <input id="dob"
               type="date"
               class="inputText widthTwelve"
               v-model="patientData.dob"
               required>

        <div v-if="patientForm.$wasSubmitted"
             class="marginTop12 widthTwelve colorRed fontSize14">
          <div v-if="patientForm.dob.valueMissing">
            Date of birth is required.
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
          <label class="colorDarkGray marginRight20 cursorPointer">
            <input name="reasons"
                   type="checkbox"
                   v-model="patientData.reasons"
                   value="checkup"
                   class="marginRight10">
              Checkup
          </label>
        </div>

        <div class="paddingBottom10 paddingTop10">
          <label class="colorDarkGray marginRight20 cursorPointer">
            <input name="reasons"
                   type="checkbox"
                   v-model="patientData.reasons"
                   value="illness"
                   class="marginRight10">
              Illness
          </label>
        </div>

        <div class="paddingBottom10 paddingTop10">
          <label class="colorDarkGray marginRight20 cursorPointer">
            <input name="reasons"
                   type="checkbox"
                   v-model="patientData.reasons"
                   value="pregnancy"
                   class="marginRight10">
              Pregnancy
          </label>
        </div>

        <div class="paddingBottom10 paddingTop10">
          <label class="colorDarkGray marginRight20 cursorPointer">
            <input name="reasons"
                   type="checkbox"
                   v-model="patientData.reasons"
                   value="consultation"
                   class="marginRight10">
              Consultation
          </label>
        </div>

        <div>
          <div class="paddingBottom10 paddingTop10 displayFlex itemsCenter">
              <div class="width30">
                <input name="reasons"
                       type="checkbox"
                       v-model="patientData.reasons"
                       value="other"
                       class="floatLeft">
              </div>
              <input type="text"
                     placeholder="Other"
                     v-model="patientData.otherReason"
                     minlength="3"
                     class="inputText widthTwelve"
                     :required="otherReasonRequired">
          </div>
        </div>

        <div v-if="patientForm.$wasSubmitted"
             class="marginTop12 widthTwelve colorRed fontSize14">
          <div v-if="patientForm.reasons.valueMissing">
            Reason is required.
          </div>
          <div v-if="otherReasonRequired && !patientData.otherReason">
            Please specify the other reason for your visit.
          </div>
        </div>

      </div>

      <!-- Success message -->
      <transition name="fade">
        <div v-if="formSent" class="colorOlive fontSize18 textCenter">
          Patient submitted.
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
                class="button circular width150 height50"
                :class="{ 'disabled': patientForm.$isInvalid }">
          <span class="verticalMiddle">Submit</span>
          <check-icon></check-icon>
        </button>

      </div>

    </div>

  </form>
</template>

<script>
  import VueForm from '../../dist/vueform'
  import ResetIcon from './ResetIcon'
  import CheckIcon from './CheckIcon'

  export default {
    name: 'PatientForm',
    components: { ResetIcon, CheckIcon },
    data () {
      const required = () => this.patientData.sex === 'female'
      const requiredFields = [
        'sex',
        'reasons',
        { name: 'pregnant', required }
      ]
      return {
        formSent: false,
        patientData: { reasons: [], sex: null },
        patientForm: new VueForm({ required: requiredFields })
      }
    },
    computed: {
      otherReasonRequired () {
        const { reasons } = this.patientData
        return reasons.indexOf('other') !== -1
      }
    },
    methods: {
      submit () {
        if (this.patientForm.$isValid) {
          this.formSent = true
          console.log('VALID')
        } else {
          console.log('INVALID')
        }
      }
    }
  }
</script>
