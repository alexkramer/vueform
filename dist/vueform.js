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

// This is the only way I've been able to copy the ValidityState object.
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
    valueMissing: vs.valueMissing
  };
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
    key: '$updateCustomValidity',
    value: function $updateCustomValidity(field, result) {
      if (result) {
        if (result && typeof result === 'string') {
          this[field].$el.setCustomValidity(result);
          this[field].customErrorMessage = result;
        } else {
          if (result.valid) {
            this[field].$el.setCustomValidity('');
          } else {
            this[field].$el.setCustomValidity('Multiple errors');
          }
          Object.assign(this[field], result);
        }
      } else {
        this[field].$el.setCustomValidity('');
        this[field].customErrorMessage = null;
      }
      Object.assign(this[field], extractValidity(this[field].$el.validity));
      this.$updateFormValidity(field);
    }
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
        bind: function bind(el, _ref) {
          var value = _ref.value;

          value.$el = el;
          value.$el.noValidate = value.$noValidate;

          //
          value.$el.addEventListener('submit', function () {
            value.$wasSubmitted = true;
            value.$el.classList.add(value.$wasSubmittedClass);
          });

          value.$el.addEventListener('reset', function () {
            // Reset $wasSubmitted property.
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
                  Object.assign(value[id], extractValidity(value[id].$el.validity));
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

          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            var _loop = function _loop() {
              var $el = _step2.value;

              //
              if ($el.form === el && $el.willValidate && $el.hasAttribute('id')) {
                //
                var field = Object.assign({ $el: $el }, extractValidity($el.validity));
                var id = $el.getAttribute('id');
                Vue.set(value, id, field);
                value.$updateFormValidity(id);

                // Add wasFocused class to element when focus event is triggered.
                $el.addEventListener('focus', function (_ref2) {
                  var target = _ref2.target;

                  var id = $el.getAttribute('id');
                  value[id].$wasFocused = true;
                  target.classList.add(value.$wasFocusedClass);
                });

                $el.addEventListener('input', function (_ref3) {
                  var target = _ref3.target;

                  var id = target.getAttribute('id');
                  Object.assign(value[id], extractValidity(target.validity));
                  value.$updateFormValidity(id);
                });
              }
            };

            for (var _iterator2 = el.querySelectorAll('input, textarea, select')[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              _loop();
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
