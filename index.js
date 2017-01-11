export default class VueForm {
  constructor (options = { wasFocusedClass: 'wasFocused' }) {
    this.$wasFocusedClass = options.wasFocusedClass
    this.$hasSubmitted = false
    this.$isInvalid = false
    this.$isValid = true
  }

  static install (Vue) {
    Vue.directive('form', {
      id: 'form',
      bind (el, binding) {
        const form = binding.value
        form.$el = el
        for (const $el of el.childNodes) {
          if ($el.willValidate && $el.form === el && $el.hasAttribute('id')) {
            form[$el.getAttribute('id')] = { $el, $validity: $el.validity }
          }
        }
      }
    })
  }

  $validity (id) {
    if (id) {
      if (this[id]) {
        this[id].$validity
      }
      return {}
    }
    return { todo: 'Return forms overall validity' }
  }

  $valid (id) {
    if (id) {
      if (this[id]) {
        return this[id].$validity.valid
      }
      return false
    }
    return { todo: 'Return forms overall validity' }
  }

  $invalid (id) {
    if (id) {
      if (this[id]) {
        return !this[id].$validity.valid
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
