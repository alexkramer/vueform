module.exports = {
  url() {
    return `${this.api.globals.devServerURL}/patient`;
  },
  elements: [
    {
      patientForm: 'form',
      name: '#name',
      female: 'input[value=female]'
    }
  ]
};
