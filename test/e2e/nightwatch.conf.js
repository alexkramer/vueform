require('babel-register')
var config = require('../../config')

const serverUrl = `http://${process.env.SERVER_HOST || 'localhost'}:`

// http://nightwatchjs.org/guide#settings-file
module.exports = {
  src_folders: ['test/e2e/specs'],
  output_folder: 'test/e2e/reports',
  custom_assertions_path: ['test/e2e/custom-assertions'],
  page_objects_path : ["test/e2e/page-objects"],

  // test_workers: true,

  selenium: {
    start_process: typeof process.env.SELENIUM_HUB_HOST === 'undefined',
    server_path: 'node_modules/selenium-server/lib/runner/selenium-server-standalone-2.53.1.jar',
    host: '127.0.0.1',
    port: 4444,
    cli_args: {
      'webdriver.chrome.driver': require('chromedriver').path
    }
  },

  test_settings: {
    default: {
      selenium_port: 4444,
      selenium_host: process.env.SELENIUM_HUB_HOST || 'localhost',
      silent: true,
      globals: {
        devServerURL: serverUrl + (process.env.PORT || config.dev.port)
      }
    },

    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true
      }
    },

    firefox: {
      desiredCapabilities: {
        browserName: 'firefox',
        javascriptEnabled: true,
        acceptSslCerts: true
      }
    }
  }
}
