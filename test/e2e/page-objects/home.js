module.exports = {
  url() {
    return `${this.api.globals.devServerURL}/`;
  },
  elements: [
    {
      contactForm: 'form',
      email: '#email'
    }
  ]
};
