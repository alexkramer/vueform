import 'babel-polyfill';

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

var _window = window;
var MutationObserver = _window.MutationObserver;

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
      var one = 'Please lengthen this text to ' + minlength + ' characters or more';
      var two = ' (you are currently using ' + el.value.length + ' characters).';
      el.setCustomValidity(one + two);
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

var VueForm = function () {
  function VueForm(options) {
    classCallCheck(this, VueForm);

    var defaults$$1 = {
      wasFocusedClass: 'wasFocused',
      wasSubmittedClass: 'wasSubmitted',
      noValidate: true,
      required: []
    };
    Object.assign(defaults$$1, options);
    this.$noValidate = defaults$$1.noValidate;
    this.$wasFocusedClass = defaults$$1.wasFocusedClass;
    this.$wasSubmittedClass = defaults$$1.wasSubmittedClass;
    this.$requiredFields = defaults$$1.required;
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
          } else {
            invalid = 'Error';
          }
        } else {
          delete this[field].customMessage;
          invalid = '';
        }
        if (this[field].$el) {
          this[field].$el.setCustomValidity(invalid);
          Object.assign(this[field], extractValidity(this[field].$el));
        } else {
          this[field].customError = invalid !== '';
          this[field].valid = this[field].valid && invalid === '';
        }
        this.$updateFormValidity(field);
      }
    }

    /**
     * updateFormValidity - Updates the overall validity of the form based on the
     * existing validity state of its fields and the updated validity state of
     * the given field.
     *
     * @param {string} id The identifier for the field whose validity state has
     *                    updated and has consequently triggered the update of the
     *                    overall forms validity.
     */

  }, {
    key: '$updateFormValidity',
    value: function $updateFormValidity(id) {
      var index = this.$invalidFields.indexOf(id);
      var field = this[id];
      var valid = field.valid || field.valid === undefined;
      if (valid && index !== -1) {
        this.$invalidFields.splice(index, 1);
        if (this.$invalidFields.length === 0) {
          this.$isValid = true;
          this.$isInvalid = false;
        }
      } else if (!valid && index === -1) {
        this.$isValid = false;
        this.$isInvalid = true;
        this.$invalidFields.push(id);
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

  }, {
    key: '$isFieldRequired',
    value: function $isFieldRequired(name) {
      return this.$requiredFields.filter(function (field) {
        var isDynamic = field.name && field.name === name && field.required();
        if (field === name || isDynamic) {
          return field;
        }
      }).length > 0;
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

  }, {
    key: '$updateNamedValidity',
    value: function $updateNamedValidity(el, Vue) {

      // Check if the element has a name
      if (el.hasAttribute('name')) {
        var name = el.getAttribute('name');

        // Check if the named group was marked as required.
        var valid = true;
        if (this.$isFieldRequired(name)) {
          valid = !!this.$getNamedValue(name);
        }

        // Set the validity state of the named group.
        var validity = { valid: valid, valueMissing: !valid };
        if (this[name]) {
          Object.assign(this[name], validity);
        } else {
          Vue.set(this, name, validity);
        }

        // Update the forms overall validity.
        this.$updateFormValidity(name);
      }
    }

    /**
     * getNamedValue -
     *
     * @param  {type} name description
     * @return {type}      description
     */

  }, {
    key: '$getNamedValue',
    value: function $getNamedValue(name) {
      var elements = this.$el.querySelectorAll('[name=' + name + ']');
      var value = true;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = elements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var el = _step.value;

          if (['radio', 'checkbox'].indexOf(el.type) !== -1) {
            if (el.checked) {
              if (el.type === 'radio') {
                value = el.value;
                break;
              } else if (el.type === 'checkbox') {
                if (Array.isArray(value)) {
                  value.push(el.value);
                } else {
                  value = [el.value];
                }
              }
            } else if (value === true) {
              value = false;
            }
          } else if (elements.length === 1) {
            value = el.value;
          } else if (Array.isArray(value)) {
            value.push(el.value);
          } else if (el.value) {
            value = [el.value];
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

      return value;
    }
  }], [{
    key: 'install',
    value: function install(Vue) {

      // Query string for elements that can be validated.
      var fieldTags = 'input, textarea, select';

      // TODO comment
      var componentUpdated = function componentUpdated(el, _ref) {
        var value = _ref.value;


        if (value instanceof VueForm) {

          // Setup the form object when the directive is first bound to the
          // form element.
          if (!value.$el) {
            value.$el = el;
            value.$el.noValidate = value.$noValidate;

            // Pre-populate required fields with an empty object in case they are
            // dynamically inserted.
            value.$requiredFields.forEach(function (field) {
              return value[field.name || field] = {};
            });

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
              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                for (var _iterator2 = Object.keys(value)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  var id = _step2.value;

                  if (id.indexOf('$') === -1 && value[id].$el) {
                    value[id].$wasFocused = false;
                    value[id].$el.classList.remove(value.$wasFocusedClass);
                    Object.assign(value[id], extractValidity(value[id].$el));
                    value.$updateFormValidity(id);
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
            });
          }

          // Go through each field within the form, set up its state within
          // the form object, and listen to input or change events to keep its
          // state in sync.
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = el.querySelectorAll(fieldTags)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var $el = _step3.value;


              // Only work with elements that belong to the form, have the ability
              // to be validated, and have and id or name property.
              if ($el.form === el && $el.willValidate) {
                (function () {
                  var id = $el.getAttribute('id');
                  var isUnregistered = id && (!value[id] || !value[id].$el);

                  // TODO comment
                  if (isUnregistered) {

                    // Create the field object and extract its validity state.
                    var field = Object.assign({ $el: $el }, extractValidity($el));
                    Vue.set(value, id, field);
                    value.$updateFormValidity(id);

                    // Add wasFocused class to element when focus event is triggered.
                    $el.addEventListener('focus', function (_ref2) {
                      var target = _ref2.target;

                      value[id].$wasFocused = true;
                      target.classList.add(value.$wasFocusedClass);
                    });
                  }

                  // TODO comment
                  value.$updateNamedValidity($el, Vue);

                  // On change or input events, update the field and form validity
                  // state.
                  var type = $el.getAttribute('type');
                  var isCheckable = ['radio', 'checkbox'].indexOf(type) !== -1;
                  var eventType = isCheckable ? 'change' : 'input';
                  $el.addEventListener(eventType, function (_ref3) {
                    var target = _ref3.target;

                    if (id) {
                      Object.assign(value[id], extractValidity(target));
                      value.$updateFormValidity(id);
                    }
                    value.$updateNamedValidity(target, Vue);
                  });
                })();
              }
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
        }
      };

      // TODO comment
      var inserted = function inserted(el, context) {

        componentUpdated(el, context);

        // TODO comment
        var observer = new MutationObserver(function (mutations) {
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = mutations[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var mutation = _step4.value;

              var rootNode = mutation.removedNodes[0] || mutation.target;
              if (rootNode && rootNode.hasAttribute) {
                var nodes = rootNode.querySelectorAll(fieldTags);

                // TODO comment
                if (fieldTags.indexOf(rootNode.tagName) !== -1) {
                  nodes.push(rootNode);
                }

                // TODO comment
                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                  for (var _iterator5 = nodes[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var node = _step5.value;

                    var id = node.getAttribute('id');
                    var name = node.getAttribute('name');

                    // TODO comment
                    if (id && context.value[id]) {
                      if (mutation.type === 'attributes') {
                        // Update the fields validity state because it may have
                        // changed due to an updated attribute on it's element.
                        Object.assign(context.value[id], extractValidity(node));
                      } else if (mutation.removedNodes.length) {
                        // If the field has been removed, set it to an empty object
                        // so that VueForm will not consider it invalid.
                        context.value[id] = {};
                      }
                      context.value.$updateFormValidity(id);
                    }

                    // TODO comment
                    if (name && context.value[name]) {
                      context.value.$updateNamedValidity(node, Vue);
                    }
                  }
                } catch (err) {
                  _didIteratorError5 = true;
                  _iteratorError5 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                      _iterator5.return();
                    }
                  } finally {
                    if (_didIteratorError5) {
                      throw _iteratorError5;
                    }
                  }
                }
              }
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }
        });
        observer.observe(el, { attributes: true, subtree: true, childList: true });
      };

      // Register the v-form directive.
      Vue.directive('form', { inserted: inserted, componentUpdated: componentUpdated });
    }
  }]);
  return VueForm;
}();

export default VueForm;
