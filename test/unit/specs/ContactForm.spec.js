import Vue from 'vue'
import ContactForm from 'src/components/ContactForm'

describe('ContactForm.vue', () => {
  it('should render field labels', () => {
    const vm = new Vue({
      el: document.createElement('div'),
      render: (h) => h(ContactForm)
    })
    expect(vm.$el.querySelector('label[for=name]').textContent)
      .to.equal('Your name')
  })
})
