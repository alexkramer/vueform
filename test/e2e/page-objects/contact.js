module.exports = {
  url() {
    return `${this.api.globals.devServerURL}/contact`;
  },
  elements: [
    {
      contactForm: 'form',
      email: '#email'
    }
  ]
};
