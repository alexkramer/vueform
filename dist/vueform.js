(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.VueValid = factory());
}(this, (function () { 'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

/**
 * extractValidity - Extracts the ValidityState information from a given
 * object into an object suitable for manipulation.
 *
 * @param  {HTMLElement} el A DOM element containing a ValidityState object.
 * @return {object}         A non-read-only object mimicing the ValidityState
 *                          object for the given element.
 */
function extractValidity(el) {
  var validity = el.validity;

  // VaidityState.tooShort/minlength polyfill for older browsers.
  var tooShort = validity.tooShort;
  var valid = validity.valid;
  var minlength = el.getAttribute('minlength');
  if (minlength && typeof tooShort === 'undefined') {
    tooShort = el.value.length < minlength;
    if (tooShort) {
      valid = false;
      el.setCustomValidity(('\n        Please lengthen this text to ' + minlength + ' characters or more (you are\n        currently using ' + el.value.length + ' characters).\n      ').trim());
    } else {
      el.setCustomValidity('');
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
    tooShort: tooShort,
    typeMismatch: validity.typeMismatch,
    valid: valid,
    valueMissing: validity.valueMissing
  };
}

/**
 * hasIdentifier - Determines if a given DOM element has an id or name attribute
 * that can be used to identify it.
 *
 * @param  {HTMLElement} el A DOM element.
 * @return {boolean}        True if the given element has an id or name
 *                          attribute, false otherwise.
 */
var hasIdentifier = function hasIdentifier(el) {
  return el.hasAttribute('id') || el.hasAttribute('name');
};

/**
 * getFieldIdentifier - Returns the value of a given DOM elements id or name
 * attribute so that it can be identified using the value.
 *
 * @param  {HTMLElement} el A DOM element containing a id or name property.
 * @return {string}         The value of the id or name property that will be
 *                          be used to identify the element.
 */
function getFieldIdentifier(el) {
  var identifier = el.getAttribute('id');
  if (identifier === null || identifier === '') {
    identifier = el.getAttribute('name');
  }
  return identifier;
}

var VueForm = function () {
  function VueForm() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      wasFocusedClass: 'wasFocused',
      wasSubmittedClass: 'wasSubmitted',
      noValidate: true
    };
    classCallCheck(this, VueForm);

    this.$noValidate = options.noValidate;
    this.$wasFocusedClass = options.wasFocusedClass;
    this.$wasSubmittedClass = options.wasSubmittedClass;
    this.$wasSubmitted = false;
    this.$isInvalid = false;
    this.$isValid = true;
    this.$invalidFields = [];
  }

  createClass(VueForm, [{
    key: '$setCustomValidity',


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
    value: function $setCustomValidity(field, invalid) {
      if (this[field]) {
        var isBoolean = typeof invalid === 'boolean';
        var isNonEmptyString = typeof invalid === 'string' && invalid.length > 0;
        if (invalid && (isBoolean || isNonEmptyString)) {
          if (isNonEmptyString) {
            this[field].customMessage = invalid;
            this[field].$el.setCustomValidity(invalid);
          } else {
            this[field].$el.setCustomValidity('Error');
          }
        } else {
          delete this[field].customMessage;
          this[field].$el.setCustomValidity('');
        }
        Object.assign(this[field], extractValidity(this[field].$el));
        this.$updateFormValidity(field);
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

  }, {
    key: '$updateFormValidity',
    value: function $updateFormValidity(field) {
      var index = this.$invalidFields.indexOf(field);
      if (this[field].valid && index !== -1) {
        this.$invalidFields.splice(index, 1);
        if (this.$invalidFields.length === 0) {
          this.$isValid = true;
          this.$isInvalid = false;
        }
      } else if (!this[field].valid && index === -1) {
        this.$isValid = false;
        this.$isInvalid = true;
        this.$invalidFields.push(field);
      }
    }
  }], [{
    key: 'install',
    value: function install(Vue) {

      // v-form directive.
      Vue.directive('form', {

        // Setup the form object when the directive is first bound to the
        // form element.
        bind: function bind(el, _ref) {
          var value = _ref.value;

          value.$el = el;
          value.$el.noValidate = value.$noValidate;

          // Update the forms $wasSubmitted state and apply the appropriate CSS
          // class when the forms submit event is triggered.
          value.$el.addEventListener('submit', function () {
            value.$wasSubmitted = true;
            value.$el.classList.add(value.$wasSubmittedClass);
          });

          // Update the form and child field state and remove any corresponding
          // CSS classes when the forms reset event is triggered.
          value.$el.addEventListener('reset', function () {
            value.$wasSubmitted = false;
            value.$el.classList.remove(value.$wasSubmittedClass);

            // Reset $wasFocused property and remove the corresponding class
            // from each child node.
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = Object.keys(value)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var id = _step.value;

                if (id.indexOf('$') === -1) {
                  value[id].$wasFocused = false;
                  value[id].$el.classList.remove(value.$wasFocusedClass);
                  Object.assign(value[id], extractValidity(value[id].$el));
                  value.$updateFormValidity(id);
                }
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }
          });

          // Go through each field within the form, set up its state within
          // the form object, and listen to input or change events to keep its
          // state in sync.
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = el.querySelectorAll('input, textarea, select')[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var $el = _step2.value;


              // Only work with elements that belong to the form, have the ability
              // to be validated, and have and id or name property.
              if ($el.form === el && $el.willValidate && hasIdentifier($el)) {

                // Create the field object and extract its validity state.
                var field = Object.assign({ $el: $el }, extractValidity($el));
                var identifier = getFieldIdentifier($el);
                Vue.set(value, identifier, field);
                value.$updateFormValidity(identifier);

                // Add wasFocused class to element when focus event is triggered.
                $el.addEventListener('focus', function (_ref2) {
                  var target = _ref2.target;

                  var identifier = getFieldIdentifier(target);
                  value[identifier].$wasFocused = true;
                  target.classList.add(value.$wasFocusedClass);
                });

                // TODO
                var type = $el.getAttribute('type');
                if (['radio', 'checkbox'].indexOf(type) !== -1) {
                  $el.addEventListener('change', function (_ref3) {
                    var target = _ref3.target;

                    var id = target.getAttribute('id');
                    Object.assign(value[id], extractValidity(target));
                    value.$updateFormValidity(id);
                  });
                } else {
                  $el.addEventListener('input', function (_ref4) {
                    var target = _ref4.target;

                    var id = target.getAttribute('id');
                    Object.assign(value[id], extractValidity(target));
                    value.$updateFormValidity(id);
                  });
                }
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
      });
    }
  }]);
  return VueForm;
}();

return VueForm;

})));
