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
          console.log('submit')
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
            }
          }
        })

        for (const $el of el.querySelectorAll('input, textarea, select')) {
          //
          if ($el.form === el && $el.willValidate && $el.hasAttribute('id')) {
            //
            const field = Object.assign({ $el }, extractValidity($el.validity))
            Vue.set(value, $el.getAttribute('id'), field)

            // Add wasFocused class to element when focus event is triggered.
            $el.addEventListener('focus', ({ target }) => {
              const id = $el.getAttribute('id')
              value[id].$wasFocused = true
              target.classList.add(value.$wasFocusedClass)
            })

            $el.addEventListener('input', ({ target }) => {
              // Update field validity state.
              const id = target.getAttribute('id')
              Object.assign(value[id], extractValidity(target.validity))

              // Update form validity state.
              const index = form.$invalidFields.indexOf(id)
              if (value[id].valid && index !== -1) {
                form.$invalidFields.splice(index, 1)
                if (form.$invalidFields.length === 0) {
                  form.$isValid = true
                  form.$isInvalid = false
                }
              } else if (!value[id].valid) {
                form.$invalidFields.push(id)
                form.$isInvalid = true
              }
            })
          }
        }
      }
    })
  }

  $setValidity (field, result) {
    if (result && typeof result === 'string') {
      this[field].customError = result
      this[field].valid = false
    } else if (result && !result.valid) {
      Object.assign(this[field], result)
    }
  }
}
