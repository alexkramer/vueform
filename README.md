# [vueform](https://vueform.optick.io)

> Form validation for [Vue.js](https://vuejs.org/) powered by HTML5

## Features

* Easy: integrates with Vue.js to provide a reactive interface for working with
  validity state.
* Lightweight: uses the HTML5 validation API whenever possible.
* Flexible: allows you to set the validity state within your own custom
  validators.
* Convenient: adds a configurable `.wasSubmitted` class to your forms when they
  are submitted and `.wasFocused` class to your fields when they are focused so
  that you're able to have more control when styling invalid fields with the
  `:invalid` psuedo-class.

## Instructions

1. Install `vueform`:

   ```
   npm install vueform --save
   ```

2. Tell Vue.js to use vueform and then create a new form in your component data
   hook:

   ```js
   import Vue from 'vue'
   import VueForm from 'vueform'

   Vue.use(VueForm)

   //...
   data() {
     return {
       contactForm: new VueForm()
     }
   }
   //...
   ```

3. Pass the form object to vueform with the `v-form` directive:

   ```html
   <form v-form="contactForm">
   <!-- ... -->
   </form>
   ```

4. Add a form field to the form. Make sure it has an `id` or `name` property so
   that it can be identified:

   ```html
   <label for="name">Name:</label>
   <input type="text" id="name" v-model="contactData.name" required>
   ```

5. By default, your form will be set to `noValidate` which tells the browser to
   *slow it's roll* and gives you more control over the validation process. This
   means the browser won't show validation error messages. You can either
   display your own validation error messages, for example:

   ```html
   <div v-if="contactForm.$wasSubmitted" class="colorRed">
     <div v-if="contactForm.name.valueMissing">
       Name is required.
     </div>
     <div v-if="contactForm.name.patternMismatch">
       Please use only letters, spaces, dashes, and apostrophes.
     </div>
   </div>
   ```

   Or disable `noValidate` so that the browser displays validation error
   messages, by passing the `noValidate: false` option when creating your form,
   for example:

   ```js
   contactForm: new VueForm({ noValidate: false })
   ```

## API

VueForm constructor options (with default values):

```js
{
  wasFocusedClass: `wasFocused`
  wasSubmittedClass: `wasSubmitted`
  noValidate: true
}
```

VueForm properties:

| Property        | Type    | Description                              |
|-----------------|---------|------------------------------------------|
| `$wasSubmitted` | boolean | True if the form was submitted.          |
| `$isInvalid`    | boolean | True if the form is invalid.             |
| `$isValid`      | boolean | True if the form is valid.               |
| `$invalidFields`| array   | A collection of names of invalid fields. |

VueForm methods:

| Method                  | Parameters | Description                           |
|-------------------------|------------|---------------------------------------|
| `$setCustomValidity` | `field`: string, `invalid`: boolean or string | A convenience wrapper for element.setCustomValidity(). Useful when updating the validity of a field based on a custom validator. |
