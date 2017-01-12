function extractValidity(vs) {
  return {
    badInput: vs.badInput,
    customError: vs.customError,
    patternMismatch: vs.patternMismatch,
    rangeOverflow: vs.rangeOverflow,
    rangeUnderflow: vs.rangeUnderflow,
    stepMismatch: vs.stepMismatch,
    tooLong: vs.tooLong,
    typeMismatch: vs.typeMismatch,
    valid: vs.valid,
    valueMissing: vs.valueMissing,
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
              Object.assign(value[id], extractValidity(value[id].$el.validity))
              value.$updateFormValidity(id)
            }
          }
        })

        for (const $el of el.querySelectorAll('input, textarea, select')) {
          //
          if ($el.form === el && $el.willValidate && $el.hasAttribute('id')) {
            //
            const field = Object.assign({ $el }, extractValidity($el.validity))
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
              Object.assign(value[id], extractValidity(target.validity))
              value.$updateFormValidity(id)
            })
          }
        }
      }
    })
  }

  $updateCustomValidity (field, result) {
    if (result) {
      if (result && typeof result === 'string') {
        this[field].$el.setCustomValidity(result)
      } else {
        if (result.valid) {
          this[field].$el.setCustomValidity('')
        } else {
          this[field].$el.setCustomValidity('Multiple errors')
        }
        Object.assign(this[field], result)
      }
    } else {
      this[field].$el.setCustomValidity('')
    }
    Object.assign(this[field], extractValidity(this[field].$el.validity))
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
