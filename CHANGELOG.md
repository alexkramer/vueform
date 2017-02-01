# Changes to vueform

## 1.4.0

* Fixed [#15: Add required fields to the form object on bind](https://github.com/optick/vueform/issues/15)
* Fixed [#13: Allow form directive to handle DOM updates and new fields](https://github.com/optick/vueform/issues/13)
* Fixed [#12: Allow arrays in required array so that users can supply a callback that determines if the field is required or not](https://github.com/optick/vueform/issues/12)

## 1.3.1

* Fixed [#10: Update form validity after setting named validity](https://github.com/optick/vueform/issues/10)

## 1.3.0

* Fixed [#7: Issue with implementing validation on multiple checkboxes](https://github.com/optick/vueform/issues/7)
* Fixed [#8: Listen to change event instead of input for checkboxes and radio buttons](https://github.com/optick/vueform/issues/8)

## 1.2.1

* Fixed [#5: Check for field existence in $setCustomValidity in case it gets
called before directive bind completes](https://github.com/optick/vueform/issues/5)

## 1.2.0

* Added [#3: Rename $updateCustomValidity to $setCustomValidity](https://github.com/optick/vueform/issues/3)
* Added [#4: Simplify $updateValidity by accepting a single result boolean or string](https://github.com/optick/vueform/issues/4)

## 1.1.0

* Added [#1: Add polyfill for ValidityState.tooShort](https://github.com/optick/vueform/issues/1)

## 1.0.1

* Removed dist/ from .gitignore so you can actually use this plugin!
* Added CHANGELOG.md

## 1.0.0

* Added field validation functionality
* Added form validity state
* Added $updateCustomValidity to update validity state in custom validators