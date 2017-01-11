# v-validate

> Form validation for Vue.js that integrates with HTML5

Create a form object to store the state of the form's validity:

```js
data() {
  return {
    contactForm: {}
  }
}
```

Pass the form object to v-validate with the `v-validate` directive:

```html
<form v-validate="contactForm">
<!-- ... -->
</form>
```

Add a form element to the form with the `v-validate` directive:

```html
<input type="text" v-validate="contactForm.name" required>
```

* Provides an easy way to get the validity state of a form and individual form
  elements
* Uses HTML5 validation to provide a lightweight solution
* Accepts custom validators to provide flexibility
* Adds a `.wasFocused` class to elements that have been focused so you can use
  it with the standard `:invalid` pseudo-class to easily style invalid
  `required` elements *after* they have been interacted with by the user.

Form $options:

wasFocusedClass: `wasFocused`

Form API

Properties:

`$hasSubmitted`
`$isInvalid`
`$isValid`

Methods:

`$invalid`
`$valid`
`$validity`
