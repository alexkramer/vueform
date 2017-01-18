// This is the only way I've been able to copy the ValidityState object.
function extractValidity(el) {
  const validity = el.validity

  // VaidityState.tooShort/minlength polyfill for older browsers.
  let tooShort = validity.tooShort
  let valid = validity.valid
  const minlength = el.getAttribute('minlength')
  if (minlength && typeof tooShort === 'undefined') {
    tooShort = el.value.length < minlength
    if (tooShort) {
      valid = false
      el.setCustomValidity(`
        Please lengthen this text to ${minlength} characters or more (you are
        currently using ${el.value.length} characters).
      `.trim())
    } else {
      el.setCustomValidity('')
    }
  }

  return {
    badInput: validity.badInput,
    customError: validity.customError,
    patternMismatch: validity.patternMismatch,
    rangeOverflow: validity.rangeOverflow,
    rangeUnderflow: validity.rangeUnderflow,
    stepMismatch: validity.stepMismatch,
    tooLong: validity.tooLong,
    tooShort,
    typeMismatch: validity.typeMismatch,
    valid,
    valueMissing: validity.valueMissing,
  }
}

export default class VueForm {
  constructor (options = {
    wasFocusedClass: 'wasFocused',
    wasSubmittedClass: 'wasSubmitted',
    noValidate: true
  }) {
    this.$noValidate = options.noValidate
    this.$wasFocusedClass = options.wasFocusedClass
    this.$wasSubmittedClass = options.wasSubmittedClass
    this.$wasSubmitted = false
    this.$isInvalid = false
    this.$isValid = true
    this.$invalidFields = []
  }

  static install (Vue) {
    // v-form directive.
    Vue.directive('form', {
      bind (el, { value }) {
        value.$el = el
        value.$el.noValidate = value.$noValidate

        //
        value.$el.addEventListener('submit', () => {
          value.$wasSubmitted = true
          value.$el.classList.add(value.$wasSubmittedClass)
        })

        value.$el.addEventListener('reset', () => {
          // Reset $wasSubmitted property.
          value.$wasSubmitted = false
          value.$el.classList.remove(value.$wasSubmittedClass)

          // Reset $wasFocused property and remove the corresponding class
          // from each child node.
          for (const id of Object.keys(value)) {
            if (id.indexOf('$') === -1) {
              value[id].$wasFocused = false
              value[id].$el.classList.remove(value.$wasFocusedClass)
              Object.assign(value[id], extractValidity(value[id].$el))
              value.$updateFormValidity(id)
            }
          }
        })

        for (const $el of el.querySelectorAll('input, textarea, select')) {
          //
          if ($el.form === el && $el.willValidate && $el.hasAttribute('id')) {
            //
            const field = Object.assign({ $el }, extractValidity($el))
            const id = $el.getAttribute('id')
            Vue.set(value, id, field)
            value.$updateFormValidity(id)

            // Add wasFocused class to element when focus event is triggered.
            $el.addEventListener('focus', ({ target }) => {
              const id = $el.getAttribute('id')
              value[id].$wasFocused = true
              target.classList.add(value.$wasFocusedClass)
            })

            $el.addEventListener('input', ({ target }) => {
              const id = target.getAttribute('id')
              Object.assign(value[id], extractValidity(target))
              value.$updateFormValidity(id)
            })
          }
        }
      }
    })
  }

  $setCustomValidity (field, invalid) {
    const isBoolean = typeof invalid === 'boolean'
    const isNonEmptyString = typeof invalid === 'string' && invalid.length > 0
    if (invalid && (isBoolean || isNonEmptyString)) {
      if (isNonEmptyString) {
        this[field].customMessage = invalid
        this[field].$el.setCustomValidity(invalid)
      } else {
        this[field].$el.setCustomValidity('Error')
      }
    } else {
      delete this[field].customMessage
      this[field].$el.setCustomValidity('')
    }
    Object.assign(this[field], extractValidity(this[field].$el))
    this.$updateFormValidity(field)
  }

  $updateFormValidity (field) {
    const index = this.$invalidFields.indexOf(field)
    if (this[field].valid && index !== -1) {
      this.$invalidFields.splice(index, 1)
      if (this.$invalidFields.length === 0) {
        this.$isValid = true
        this.$isInvalid = false
      }
    } else if (!this[field].valid && index === -1) {
      this.$isValid = false
      this.$isInvalid = true
      this.$invalidFields.push(field)
    }
  }
}
