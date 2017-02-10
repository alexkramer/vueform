import 'babel-polyfill';

/**
 * extractValidity - Extracts the ValidityState information from a given
 * object into an object suitable for manipulation.
 *
 * @param  {HTMLElement} el A DOM element containing a ValidityState object.
 * @return {object}         A non-read-only object mimicing the ValidityState
 *                          object for the given element.
 */
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
      const one = `Please lengthen this text to ${minlength} characters or more`
      const two = ` (you are currently using ${el.value.length} characters).`
      el.setCustomValidity(one + two)
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

  constructor (options) {
    const defaults = {
      wasFocusedClass: 'wasFocused',
      wasSubmittedClass: 'wasSubmitted',
      noValidate: true,
      required: []
    }
    Object.assign(defaults, options)
    this.$noValidate = defaults.noValidate
    this.$wasFocusedClass = defaults.wasFocusedClass
    this.$wasSubmittedClass = defaults.wasSubmittedClass
    this.$requiredFields = defaults.required
    this.$wasSubmitted = false
    this.$isInvalid = false
    this.$isValid = true
    this.$invalidFields = []
  }

  static install (Vue) {

    //
    const register = (el, { value }) => {

      if (value instanceof VueForm) {

        // Setup the form object when the directive is first bound to the
        // form element.
        if (!value.$el) {
          value.$el = el
          value.$el.noValidate = value.$noValidate

          // Pre-populate required fields with an empty object in case they are
          // dynamically inserted.
          value.$requiredFields.forEach(field => value[field.name || field] = {})

          // Update the forms $wasSubmitted state and apply the appropriate CSS
          // class when the forms submit event is triggered.
          value.$el.addEventListener('submit', () => {
            value.$wasSubmitted = true
            value.$el.classList.add(value.$wasSubmittedClass)
          })

          // Update the form and child field state and remove any corresponding
          // CSS classes when the forms reset event is triggered.
          value.$el.addEventListener('reset', () => {
            value.$wasSubmitted = false
            value.$el.classList.remove(value.$wasSubmittedClass)

            // Reset $wasFocused property and remove the corresponding class
            // from each child node.
            for (const id of Object.keys(value)) {
              if (id.indexOf('$') === -1 && value[id].$el) {
                value[id].$wasFocused = false
                value[id].$el.classList.remove(value.$wasFocusedClass)
                Object.assign(value[id], extractValidity(value[id].$el))
                value.$updateFormValidity(id)
              }
            }
          })
        }

        // Go through each field within the form, set up its state within
        // the form object, and listen to input or change events to keep its
        // state in sync.
        for (const $el of el.querySelectorAll('input, textarea, select')) {

          // Only work with elements that belong to the form, have the ability
          // to be validated, and have and id or name property.
          if ($el.form === el && $el.willValidate) {
            const id = $el.getAttribute('id')
            const isUnregistered = id && (!value[id] || !value[id].$el)

            //
            if (isUnregistered) {

              // Create the field object and extract its validity state.
              const field = Object.assign({ $el }, extractValidity($el))
              Vue.set(value, id, field)
              value.$updateFormValidity(id)

              // Add wasFocused class to element when focus event is triggered.
              $el.addEventListener('focus', ({ target }) => {
                value[id].$wasFocused = true
                target.classList.add(value.$wasFocusedClass)
              })

            }

            //
            value.$updateNamedValidity($el, Vue)

            // On change or input events, update the field and form validity
            // state.
            const type = $el.getAttribute('type')
            const isCheckable = ['radio', 'checkbox'].indexOf(type) !== -1
            const eventType = isCheckable ? 'change' : 'input'
            $el.addEventListener(eventType, ({ target }) => {
              if (id) {
                Object.assign(value[id], extractValidity(target))
                value.$updateFormValidity(id)
              }
              value.$updateNamedValidity(target, Vue)
            })
          }

        }

      }

    }

    // v-form directive.
    Vue.directive('form', { inserted: register, componentUpdated: register })

  }

  /**
   * setCustomValidity - A wrapper for HTML5s setCustomValidity function so that
   * the end user can trigger a custom error without an error message, the
   * custom error message is accessible through the form object, and the overall
   * form validity is updated.
   *
   * @param {string}          field   The identifier for the field you wish to
   *                                  set the validity for.
   * @param {boolean|string}  invalid Whether the field is invalid (true), or
   *                                  not (false), or the custom error message
   *                                  for an invalid field.
   */
  $setCustomValidity (field, invalid) {
    if (this[field]) {
      const isBoolean = typeof invalid === 'boolean'
      const isNonEmptyString = typeof invalid === 'string' && invalid.length > 0
      if (invalid && (isBoolean || isNonEmptyString)) {
        if (isNonEmptyString) {
          this[field].customMessage = invalid
        } else {
          invalid = 'Error'
        }
      } else {
        delete this[field].customMessage
        invalid = ''
      }
      if (this[field].$el) {
        this[field].$el.setCustomValidity(invalid)
        Object.assign(this[field], extractValidity(this[field].$el))
      } else {
        this[field].customError = invalid !== ''
        this[field].valid = this[field].valid && invalid === ''
      }
      this.$updateFormValidity(field)
    }
  }

  /**
   * updateFormValidity - Updates the overall validity of the form based on the
   * existing validity state of its fields and the updated validity state of
   * the given field.
   *
   * @param {string} field The identifier for the field whose validity state
   *                       has updated and has consequently triggered the update
   *                       of the overall forms validity.
   */
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


  /**
   * $isFieldRequired - Checks if a given named group has been manually
   * designated as required through the VueForm constructor options.
   *
   * @param   {string} name The name of the field to be checked.
   *
   * @returns {boolean}     True if the field is required, false otherwise.
   */
  $isFieldRequired(name) {
    return this.$requiredFields.filter(field => {
      const isDynamic = field.name && field.name === name && field.required()
      if (field === name || isDynamic) {
        return field
      }
    }).length > 0
  }


  /**
   * $updateNamedValidity - For the use case of requiring a value for a set of
   * checkboxes or radio buttons with the same name, VueForm provides the
   * validity state of the overall group using the name as the identifier. This
   * function updates this validity state.
   *
   * @param {HTMLElement} el  The DOM element that may trigger an update to the
   *                          validity of the named group.
   * @param {Vue}         Vue The Vue.js instance given when this plugin is
   *                          installed.
   */
  $updateNamedValidity (el, Vue) {

    // Check if the element has a name
    if (el.hasAttribute('name')) {
      const name = el.getAttribute('name')

      // Check if the named group was marked as required.
      if (this.$isFieldRequired(name)) {

        // Set the validity state of the named group.
        const valid = !!this.$getNamedValue(name)
        const validity = { valid, valueMissing: !valid  }
        if (this[name]) {
          Object.assign(this[name], validity)
        } else {
          Vue.set(this, name, validity)
        }

        // Update the forms overall validity.
        this.$updateFormValidity(name)

      }
    }

  }

  $getNamedValue (name) {
    const elements = this.$el.querySelectorAll(`[name=${name}]`)
    let value
    for (const el of elements) {
      if (['radio', 'checkbox'].indexOf(el.type) !== -1) {
        if (el.checked) {
          if (el.type === 'radio') {
            value = el.value
            break;
          } else if (el.type === 'checkbox') {
            if (value) {
              value.push(el.value)
            } else {
              value = [el.value]
            }
          }
        }
      } else if (elements.length === 1) {
        value = el.value
      } else if (value) {
        value.push(el.value)
      } else if (el.value) {
        value = [el.value]
      }
    }

    return value
  }

}
