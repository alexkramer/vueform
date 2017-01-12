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
  constructor (options = { wasFocusedClass: 'wasFocused', noValidate: true }) {
    this.$noValidate = options.noValidate
    this.$wasFocusedClass = options.wasFocusedClass
    this.$wasSubmitted = false
    this.$isInvalid = false
    this.$isValid = true
  }

  static install (Vue) {
    Vue.directive('form', {
      id: 'form',
      bind (el, binding) {
        const form = binding.value
        form.$el = el
        form.$el.noValidate = form.$noValidate

        //
        form.$el.addEventListener('submit', () => {
          console.log('submit')
          form.$wasSubmitted = true
        })

        form.$el.addEventListener('reset', () => {
          // Reset $wasSubmitted property.
          form.$wasSubmitted = false

          // Reset $wasFocused property and remove the corresponding class
          // from each child node.
          for (const id of Object.keys(form)) {
            if (id.indexOf('$') === -1) {
              form[id].$wasFocused = false
              form[id].$el.classList.remove(form.$wasFocusedClass)
            }
          }
        })

        for (const $el of el.querySelectorAll('input, textarea, select')) {
          //
          if ($el.form === el && $el.willValidate && $el.hasAttribute('id')) {
            //
            const field = Object.assign({ $el }, extractValidity($el.validity))
            Vue.set(form, $el.getAttribute('id'), field)

            // Add wasFocused class to element when focus event is triggered.
            $el.addEventListener('focus', ({ target }) => {
              const id = $el.getAttribute('id')
              form[id].$wasFocused = true
              target.classList.add(form.$wasFocusedClass)
            })

            $el.addEventListener('input', ({ target }) => {
              const formField = form[target.getAttribute('id')]
              Object.assign(formField, extractValidity(target.validity))

              // TODO run custom validator

              // TODO update form state
            })
          }
        }
      }
    })
  }

  $validity (id) {
    if (id) {
      const formField = this[id]
      if (formField) {
        return formField.$validity
      }
      return {}
    }
    return { todo: 'Return forms overall validity' }
  }

  $valid (id) {
    if (id) {
      const formField = this[id]
      if (formField) {
        return formField.$validity.valid
      }
      return false
    }
    return { todo: 'Return forms overall validity' }
  }

  $invalid (id) {
    if (id) {
      const formField = this[id]
      if (formField) {
        return !formField.$validity.valid
      }
      return true
    }
    return { todo: 'Return forms overall validity' }
  }
}


// const store = {
//   forms: {},
//   elements: []
// }
//
//
//
// // const inputHandler = { target } => {
// //   store.elements[target].binding.value = target.validity
// // }
//
// export default {
//   install (Vue) {
//     Vue.directive('validate', {
//       id: 'validate',
//       priority: 10001,
//       bind (el, binding) {
//         console.log('yo', el.tagName)
//         if (el.tagName === 'FORM') {
//         //   // Save the form object to the store.
//         //   store.forms[binding.expression] = { $form: binding.value }
//         //
//         //   //
//         //   for (const formEl of store.elements) {
//         //     if (el.contains(formEl)) {
//         //       formEl.form = binding.expression
//         //       store.forms[binding.expression].$form[formEl.binding.value] = formEl.validity
//         //     }
//         //   }
//         //
//         //   console.log('CHANGING value')
//           binding.value.age = { valid: true }
//           console.log('STRAIGHT UP', binding.value)
//         }
//         // } else if (el.willValidate || el.hasAttribute('custom-validator')) {
//           // If an element is a candidate for constraint validation or custom
//           // validation, save it to the store.
//           // store.elements[el] = { el, binding }
//
//           //
//
//
//           // el.addEventListener('invalid', { target } => {
//           //   console.log('invalid', evt.target.validity)
//           //
//           // })
//         // }
//       },
//       unbind (el, binding) {
//         if (el.tagName === 'form') {
//           delete store.forms[binding.expression]
//         } else {
//           delete store.elements[el]
//         }
//       }
//     })
//   }
// }
