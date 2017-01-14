// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'Home Validation Failure Test': browser => {
    console.log(browser.page.home())
    browser.page.home().navigate()
      .waitForElementVisible('@contactForm', 10000)
      .submitForm('@contactForm')
      .assert.containsText('@contactForm', 'Name is required.')
      .assert.containsText('@contactForm', 'Email is required.')
      .assert.containsText('@contactForm', 'Phone is required.')
      .assert.containsText('@contactForm', 'Description is required.')
      .assert.urlEquals(browser.page.home().url())
      .setValue('@email', 'notanaccount')
      .assert.containsText('@contactForm', 'Please enter a valid email address.')
      .api.end()
  }
}
