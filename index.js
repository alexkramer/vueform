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

/**
 * hasIdentifier - Determines if a given DOM element has an id or name attribute
 * that can be used to identify it.
 *
 * @param  {HTMLElement} el A DOM element.
 * @return {boolean}        True if the given element has an id or name
 *                          attribute, false otherwise.
 */
const hasIdentifier = el => el.hasAttribute('id') || el.hasAttribute('name')


/**
 * getFieldIdentifier - Returns the value of a given DOM elements id or name
 * attribute so that it can be identified using the value.
 *
 * @param  {HTMLElement} el A DOM element containing a id or name property.
 * @return {string}         The value of the id or name property that will be
 *                          be used to identify the element.
 */
function getFieldIdentifier(el) {
  let identifier = el.getAttribute('id')
  if (identifier === null || identifier === '') {
    identifier = el.getAttribute('name')
  }
  return identifier
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

      // Setup the form object when the directive is first bound to the
      // form element.
      bind (el, { value }) {
        value.$el = el
        value.$el.noValidate = value.$noValidate

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
            if (id.indexOf('$') === -1) {
              value[id].$wasFocused = false
              value[id].$el.classList.remove(value.$wasFocusedClass)
              Object.assign(value[id], extractValidity(value[id].$el))
              value.$updateFormValidity(id)
            }
          }
        })

        // Go through each field within the form, set up its state within
        // the form object, and listen to input or change events to keep its
        // state in sync.
        for (const $el of el.querySelectorAll('input, textarea, select')) {

          // Only work with elements that belong to the form, have the ability
          // to be validated, and have and id or name property.
          if ($el.form === el && $el.willValidate && hasIdentifier()) {

            // Create the field object and extract its validity state.
            const field = Object.assign({ $el }, extractValidity($el))
            const identifier = getFieldIdentifier($el)
            Vue.set(value, identifier, field)
            value.$updateFormValidity(identifier)

            // Add wasFocused class to element when focus event is triggered.
            $el.addEventListener('focus', ({ target }) => {
              const identifier = getFieldIdentifier(target)
              value[identifier].$wasFocused = true
              target.classList.add(value.$wasFocusedClass)
            })

            // TODO
            const type = $el.getAttribute('type')
            if (['radio', 'checkbox'].indexOf(type) !== -1) {
              $el.addEventListener('change', ({ target }) => {
                const id = target.getAttribute('id')
                Object.assign(value[id], extractValidity(target))
                value.$updateFormValidity(id)
              })
            } else {
              $el.addEventListener('input', ({ target }) => {
                const id = target.getAttribute('id')
                Object.assign(value[id], extractValidity(target))
                value.$updateFormValidity(id)
              })
            }

          }

        }
      }
    })

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
}
