module.exports = {
  'Patient Form Validation Failure Test': browser => {
    console.log(browser.page.patient())
    browser.page.patient().navigate()
      .waitForElementVisible('@patientForm', 10000)
      .submitForm('@patientForm')
      .assert.containsText('@patientForm', 'Name is required.')
      .assert.containsText('@patientForm', 'Sex is required.')
      .assert.containsText('@patientForm', 'Date of birth is required.')
      .assert.containsText('@patientForm', 'Reason is required.')
      .api.end()
  }
}
