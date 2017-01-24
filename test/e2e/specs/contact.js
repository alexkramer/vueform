module.exports = {
  'Contact Form Validation Failure Test': browser => {
    console.log(browser.page.contact())
    browser.page.contact().navigate()
      .waitForElementVisible('@contactForm', 10000)
      .submitForm('@contactForm')
      .assert.containsText('@contactForm', 'Name is required.')
      .assert.containsText('@contactForm', 'Email is required.')
      .assert.containsText('@contactForm', 'Phone is required.')
      .assert.containsText('@contactForm', 'Description is required.')
      .setValue('@email', 'notanaccount')
      .assert.containsText('@contactForm', 'Please enter a valid email address.')
      .api.end()
  }
}
